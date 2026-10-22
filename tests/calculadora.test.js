import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateExitTime as calc, formatTime } from '../docs/js/calculadora.js';
const noMargin = { margem: 0 };
test('jornada diurna: intervalo excluído e margem de dois minutos', () => {
  const r = calc('08:00', '12:00', '13:00');
  assert.equal(r.saidaSugerida, '16:18');
  assert.equal(r.horarioLimite, '18:08');
  assert.equal(r.minutosIntervalo, 60);
  assert.equal(r.minutosSaida, 438);
});
test('jornada noturna exata não perde minuto por ponto flutuante', () => {
  const r = calc('22:00', '01:00', '02:00', null, null, noMargin);
  assert.equal(r.saidaSugerida, '05:28');
  assert.equal(r.horarioLimite, '07:18');
  assert.equal(r.minutosSaida, 3076 / 7);
  assert.equal(r.diaSaida, 1);
});
test('seis marcações depois da meia-noite, intervalos excluídos', () => {
  const r = calc('22:00', '00:00', '00:15', '03:00', '04:00', noMargin);
  assert.equal(r.saidaSugerida, '05:45');
  assert.equal(r.minutosIntervalo, 75);
  assert.ok(r.minutosSaida <= 440);
});
test('arredonda para baixo e calcula limite a partir do total', () => {
  const r = calc('22:00', '23:00', '23:30', null, null, { jornada: 100, extras: 1, margem: 0 });
  assert.equal(r.saidaSugerida, '23:57');
  assert.equal(r.horarioLimite, '23:58');
});
test('margem noturna subtrai minutos reais', () => {
  const r = calc('22:00', '01:00', '02:00');
  assert.equal(r.saidaSugerida, '05:26');
  assert.equal(r.horarioLimite, '07:16');
});
test('noturno pode ser desativado e jornada personalizada', () => {
  assert.equal(calc('22:00', '01:00', '02:00', null, null, { noturno: false, margem: 0 }).saidaSugerida, '06:20');
  assert.equal(calc('08:00', '12:00', '13:00', null, null, { jornada: 480, margem: 0 }).saidaSugerida, '17:00');
});
test('limite já ultrapassado não fabrica nova tolerância', () => {
  const r = calc('08:00', '18:00', '19:00');
  assert.equal(r.limiteJaUltrapassado, true);
  assert.equal(r.saidaSugerida, '19:00');
  assert.equal(r.margemLimiteCompleta, false);
});
test('margem nunca sugere sair antes de um retorno registrado', () => {
  const r = calc('08:00', '15:19', '15:20');
  assert.equal(r.saidaSugerida, '15:20');
});
test('rejeita campos inválidos, intervalo incompleto e múltiplos dias', () => {
  for (const args of [ ['', '12:00', '13:00'], ['25:00', '12:00', '13:00'], ['08:00', '08:00', '09:00'], ['22:00', '01:00', '02:00', '01:00', '02:00'], ['08:00', '12:00', '13:00', '14:00'] ]) assert.throws(() => calc(...args));
  assert.throws(() => calc('08:00', '12:00', '13:00', null, null, { margem: -1 }));
});
// Oráculo independente: contagem por sobreposição com as faixas noturnas.
function effective(start, end) {
  let night = 0;
  for (let d = -1; d <= 3; d++) {
    night += Math.max(0, Math.min(end, d * 1440 + 1740) - Math.max(start, d * 1440 + 1320));
  }
  return (end - start) * 7 + night;
}
test('varredura de 288 entradas: saída e limite nunca excedem os alvos', () => {
  for (let entry = 0; entry < 1440; entry += 5) {
    const out = entry + 120, back = out + 45;
    const args = [formatTime(entry), formatTime(out), formatTime(back), null, null];
    const raw = calc(...args, noMargin), safe = calc(...args);
    const already = effective(entry, out);
    for (const [end, target] of [[raw.saidaAbs, 440], [raw.limiteAbs, 550]]) {
      assert.ok(already + effective(back, end) <= target * 7);
      assert.ok(already + effective(back, end + 1) > target * 7);
    }
    assert.equal(safe.saidaAbs, raw.saidaAbs - 2);
    assert.equal(safe.limiteAbs, raw.limiteAbs - 2);
  }
});


test('alvo exato dentro da faixa noturna preserva o último minuto', () => {
  const r = calc('22:00', '01:00', '02:00', null, null, { jornada: 400, extras: 0, margem: 0 });
  assert.equal(r.saidaSugerida, '04:50');
  assert.equal(r.minutosSaida, 400);
  assert.equal(r.horarioLimite, '04:50');
});
