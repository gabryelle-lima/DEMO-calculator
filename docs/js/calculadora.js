// Um minuto diurno vale 7 unidades; um noturno vale 8 (60/52,5 = 8/7).
export const DEFAULTS = Object.freeze({ jornada: 440, extras: 110, margem: 2, noturno: true });
function parseTime(value) {
  if (typeof value !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) throw new Error('Preencha os horários no formato HH:MM.');
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
}
export function formatTime(absolute) {
  const minute = ((absolute % 1440) + 1440) % 1440;
  return `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
}
export function calculateExitTime(entry, breakOut, breakIn, breakOut2 = null, breakIn2 = null, options = {}) {
  const config = { ...DEFAULTS, ...options };
  for (const [key, min, max] of [['jornada', 1, 960], ['extras', 0, 360], ['margem', 0, 30]]) {
    if (!Number.isInteger(config[key]) || config[key] < min || config[key] > max) throw new Error(`Configuração inválida: ${key}.`);
  }
  const secondOut = breakOut2 !== null && breakOut2 !== '';
  const secondIn = breakIn2 !== null && breakIn2 !== '';
  if (secondOut !== secondIn) throw new Error('Preencha a saída e o retorno do segundo intervalo.');
  const values = [entry, breakOut, breakIn, ...(secondOut ? [breakOut2, breakIn2] : [])];
  const times = [];
  for (const value of values) {
    let time = parseTime(value);
    if (times.length) {
      const previous = times.at(-1);
      time += Math.floor(previous / 1440) * 1440;
      if (time < previous) time += 1440;
      if (time === previous) throw new Error('Marcações consecutivas precisam ter horários diferentes.');
    }
    times.push(time);
  }
  if (times.at(-1) - times[0] >= 1440) throw new Error('Confira a ordem: as marcações devem pertencer a uma jornada menor que 24 horas.');
  const weight = t => config.noturno && (t % 1440 >= 1320 || t % 1440 < 300) ? 8 : 7;
  function worked(start, end) {
    let units = 0, night = 0;
    for (let t = start; t < end; t++) { units += weight(t); if (weight(t) === 8) night++; }
    return { units, night };
  }
  const resume = times.at(-1);
  let recorded = 0, recordedNight = 0, breaks = 0;
  for (let i = 0; i < times.length - 1; i += 2) {
    const segment = worked(times[i], times[i + 1]);
    recorded += segment.units;
    recordedNight += segment.night;
    breaks += times[i + 2] - times[i + 1];
  }
  // Alvos independentes: as extras não partem de uma saída já arredondada.
  function departure(target) {
    let t = resume, units = recorded;
    while (units + weight(t) <= target * 7) {
      if (t - times[0] >= 1440) throw new Error('O resultado ultrapassa 24 horas. Revise a jornada e os horários.');
      units += weight(t++);
    }
    return t;
  }
  const nominal = departure(config.jornada);
  const cap = departure(config.jornada + config.extras);
  const exit = Math.max(resume, nominal - config.margem);
  const limit = Math.max(resume, cap - config.margem);
  const finalSegment = worked(resume, exit);
  return {
    saidaSugerida: formatTime(exit), horarioLimite: formatTime(limit),
    saidaSemMargem: formatTime(nominal), limiteSemMargem: formatTime(cap),
    saidaAbs: exit, limiteAbs: limit, entradaAbs: times[0], retornoAbs: resume,
    diaSaida: Math.floor(exit / 1440), diaLimite: Math.floor(limit / 1440),
    minutosSaida: (recorded + finalSegment.units) / 7,
    minutosRegistrados: recorded / 7, minutosNoturnos: recordedNight + finalSegment.night,
    minutosIntervalo: breaks, margem: config.margem,
    jornadaJaCumprida: recorded >= config.jornada * 7,
    limiteJaUltrapassado: recorded > (config.jornada + config.extras) * 7,
    margemLimiteCompleta: cap - resume >= config.margem
  };
}
