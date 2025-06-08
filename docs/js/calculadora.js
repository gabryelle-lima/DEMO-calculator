// Funções exportadas podem ser usadas em outros módulos, como o main.js
export function calculateExitTime(entry, breakOut, breakIn, breakOut2 = null, breakIn2 = null, debug = false) {
  function parseHM(str) {
    if (!str) return 0;
    const parts = str.split(":");
    if (parts.length !== 2) return 0;
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (isNaN(h) || isNaN(m)) return 0;
    return h * 60 + m;
  }

  // Calcula minutos efetivos: minuto diurno = 1, minuto noturno = 60/52.5 = 1.142857...
  function calcularMinutosEfetivos(start, end) {
    let total = 0;
    let log = [];
    for (let m = start; m < end; m++) {
      const mod = m % 1440;
      const isNight = (mod >= 1320 || mod < 300);
      const valor = isNight ? (60 / 52.5) : 1;
      total += valor;
      if (debug) {
        const hora = String(Math.floor(mod / 60)).padStart(2, '0');
        const minuto = String(mod % 60).padStart(2, '0');
        log.push(`${hora}:${minuto} = ${valor.toFixed(3)}`);
      }
    }
    return debug ? { total, log } : total;
  }

  // Parse e normaliza horários
  let t0 = parseHM(entry);
  let t1 = parseHM(breakOut);
  if (t1 < t0) t1 += 1440;
  let t2 = parseHM(breakIn);
  if (t2 < t1) t2 += 1440;
  let t3 = breakOut2 ? parseHM(breakOut2) : null;
  if (t3 !== null && t3 < t2) t3 += 1440;
  let t4 = breakIn2 ? parseHM(breakIn2) : null;
  if (t4 !== null && t4 < (t3 !== null ? t3 : t2)) t4 += 1440;

  // Calcula efetivos dos períodos já trabalhados
  const parte1 = calcularMinutosEfetivos(t0, t1, debug);
  const efetivo1 = debug ? parte1.total : parte1;
  let efetivo2 = 0;
  let log2 = [];
  let fimIntervalo = t2;
  if (t3 !== null) {
    const parte2 = calcularMinutosEfetivos(t2, t3, debug);
    efetivo2 = debug ? parte2.total : parte2;
    if (debug) log2 = parte2.log;
    fimIntervalo = (t4 !== null) ? t4 : t3;
  }

  // Determina início do cálculo de saída e acumula já trabalhado
  const inicioSaida = fimIntervalo;
  let saidaMin = inicioSaida;
  let acumulado = efetivo1 + efetivo2;
  const metaEfetiva = 440; // 7h20 = 440 min efetivos
  let log3 = [];

  // Incrementa minuto a minuto sem ultrapassar a meta
  while (true) {
    const mod = saidaMin % 1440;
    const isNight = (mod >= 1320 || mod < 300);
    const valor = isNight ? (60 / 52.5) : 1;
    if (acumulado + valor > metaEfetiva) break;
    acumulado += valor;
    if (debug) log3.push(`${String(Math.floor(mod / 60)).padStart(2,'0')}:${String(mod%60).padStart(2,'0')} = ${valor.toFixed(3)}`);
    saidaMin++;
  }

  // Cálculo do limite de horas extras (120 min efetivos)
  let limiteMin = saidaMin;
  let acumuladoExtras = 0;
  const metaExtras = 120;
  let log4 = [];
  while (true) {
    const mod = limiteMin % 1440;
    const isNight = (mod >= 1320 || mod < 300);
    const valor = isNight ? (60 / 52.5) : 1;
    if (acumuladoExtras + valor > metaExtras) break;
    acumuladoExtras += valor;
    if (debug) log4.push(`${String(Math.floor(mod / 60)).padStart(2,'0')}:${String(mod%60).padStart(2,'0')} = ${valor.toFixed(3)}`);
    limiteMin++;
  }

  function format(hm) {
    if (hm < 0) hm = 0;
    const minutosTot = hm % 1440;
    return `${String(Math.floor(minutosTot / 60)).padStart(2,'0')}:${String(minutosTot%60).padStart(2,'0')}`;
  }

  return {
    saidaSugerida: format(saidaMin),
    horarioLimite: format(limiteMin),
    minutosSaida: saidaMin,
    debugInfo: debug ? { periodo1: parte1.log, periodo2: log2, jornadaFinal: log3, extras: log4 } : undefined
  };
}
