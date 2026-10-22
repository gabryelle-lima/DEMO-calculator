export function duration(minutes) {
  const rounded = Math.floor(minutes);
  return `${Math.floor(rounded / 60)}h${String(rounded % 60).padStart(2, '0')}`;
}
export function displayResult(result, config) {
  document.getElementById('empty-result').hidden = true;
  const target = document.getElementById('resultado');
  target.hidden = false;
  const day = value => value ? `Dia seguinte (+${value})` : 'Mesmo dia';
  const remaining = Math.max(0, config.jornada - result.minutosSaida);
  const warnings = [];
  if (result.limiteJaUltrapassado) warnings.push('O limite com extras já foi ultrapassado antes do último retorno. Não é possível recuperar a margem. Confira seu ponto.');
  else if (!result.margemLimiteCompleta) warnings.push('O último retorno já está dentro da margem do limite. Não é possível aplicar toda a antecedência configurada. Confira seu ponto.');
  if (result.jornadaJaCumprida) warnings.push('A jornada já foi cumprida antes do último retorno. A saída exibida é o horário desse retorno.');
  target.innerHTML = `
    <div class="result-label">Saída sugerida · ${config.margem} min de margem</div>
    <div class="result-time">${result.saidaSugerida}</div>
    <div class="day-label">${day(result.diaSaida)}</div>
    <div class="limit"><div><span class="result-label">${result.limiteJaUltrapassado ? 'Limite já ultrapassado' : 'Limite com extras · com margem'}</span><small>${day(result.diaLimite)}</small></div><strong>${result.limiteJaUltrapassado ? '—' : result.horarioLimite}</strong></div>
    <p class="result-meta">Pausas: ${duration(result.minutosIntervalo)} · Tempo noturno real até a saída: ${duration(result.minutosNoturnos)}<br>Referência sem margem, arredondada para baixo: ${result.saidaSemMargem}<br>Saldo estimado na saída: ${remaining > 0 ? `faltam ${remaining.toFixed(2).replace('.', ',')} min` : `+${(result.minutosSaida - config.jornada).toFixed(2).replace('.', ',')} min`}</p>
    ${warnings.map(text => `<p class="warning">${text}</p>`).join('')}`;
}
export function hideResult() {
  document.getElementById('resultado').hidden = true;
  document.getElementById('resultado').replaceChildren();
  document.getElementById('empty-result').hidden = false;
}
export function mostrarErro(message) {
  const element = document.getElementById('mensagemErro');
  element.textContent = message;
  element.hidden = false;
}
export function ocultarErro() {
  document.getElementById('mensagemErro').hidden = true;
  document.getElementById('mensagemErro').textContent = '';
}
export function toggleCampoExtra() {
  const extra = document.getElementById('campoExtra');
  extra.hidden = !document.getElementById('seis-marcacoes').checked;
  extra.disabled = extra.hidden;
}
