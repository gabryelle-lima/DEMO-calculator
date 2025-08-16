// js/calculadora.js — versão produção com FLOOR (intervalos NUNCA contam; noturno = 60/52,5; advertência se passar do minuto)
export function calculateExitTime(entry, breakOut, breakIn, breakOut2 = null, breakIn2 = null) {
  const FATOR_NOTURNO = 60 / 52.5;   // cada minuto noturno “vale” ≈1.142857 efetivos
  const META_TRABALHO = 440;         // 7h20 em minutos efetivos
  const META_EXTRAS   = 110;         // +2h em minutos efetivos

  // Converte “HH:MM” → minutos desde meia‑noite
  function parseHM(s) {
    if (!s) return 0;
    const [h,m] = s.split(':').map(x => parseInt(x, 10));
    return (isNaN(h)||isNaN(m)) ? 0 : h*60 + m;
  }

  // Formata minutos absolutos → “HH:MM”
  function fmt(min) {
    const mTot = ((min % 1440) + 1440) % 1440;
    const hh = Math.floor(mTot/60), mm = mTot%60;
    return `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
  }

  // Valor efetivo de 1 minuto real no instante t
  function valorMinuto(t) {
    const mod = t % 1440;
    return (mod >= 1320 || mod < 300) ? FATOR_NOTURNO : 1;
  }

  // Soma efetiva em [start, end)
  function somaEfetiva(start, end) {
    let total = 0;
    for (let t = start; t < end; t++) total += valorMinuto(t);
    return total;
  }

  // Avança de “ini” minuto a minuto, parando **antes** de ultrapassar “alvoEff” (FLOOR)
  function avancarAte(ini, alvoEff) {
    let acc = 0, t = ini;
    while (acc + valorMinuto(t) <= alvoEff) {
      acc += valorMinuto(t);
      t++;
    }
    return t; // primeiro minuto não contado (colaborador deve sair até t)
  }

  // — parse e normalização de cruzamento de meia‑noite —
  let t0 = parseHM(entry);
  let t1 = parseHM(breakOut);    if (t1 < t0) t1 += 1440;
  let t2 = parseHM(breakIn);     if (t2 < t1) t2 += 1440;
  let t3 = breakOut2 ? parseHM(breakOut2) : null;
      if (t3 !== null && t3 < t2) t3 += 1440;
  let t4 = breakIn2  ? parseHM(breakIn2)  : null;
      if (t4 !== null && t4 < (t3 !== null ? t3 : t2)) t4 += 1440;

  // — trabalho antes e (se houver) entre intervalos (intervalos NUNCA contam) —
  const e1 = somaEfetiva(t0, t1);
  let e2 = 0, inicio = t2;
  if (t3 !== null) {
    e2 = somaEfetiva(t2, t3);
    inicio = (t4 !== null ? t4 : t3);
  }

  // — calcula saída e limite (sempre FLOOR) —
  const faltante = Math.max(0, META_TRABALHO - (e1 + e2));
  const saidaAbs = avancarAte(inicio, faltante);
  const limiteAbs = avancarAte(saidaAbs, META_EXTRAS);

  return {
    saidaSugerida: fmt(saidaAbs),
    horarioLimite: fmt(limiteAbs),
    minutosSaida: Math.round(e1 + e2 + somaEfetiva(inicio, saidaAbs))
  };
}
