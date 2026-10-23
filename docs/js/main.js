import { calculateExitTime } from './calculadora.js';
import { displayResult, hideResult, toggleCampoExtra, mostrarErro, ocultarErro, duration } from './ui.js';
const form = document.getElementById('jornada-form');
const settingsPanel = document.getElementById('configuracoes');
const calculatorPanel = document.getElementById('calculadora-panel');
const settingsButton = document.getElementById('abrir-configuracoes');
function showSettings(open) {
  settingsPanel.hidden = !open;
  calculatorPanel.hidden = open;
  settingsButton.setAttribute('aria-expanded', String(open));
}
settingsButton.addEventListener('click', () => showSettings(settingsPanel.hidden));
document.getElementById('voltar-calculadora').addEventListener('click', () => {
  showSettings(false);
  settingsButton.focus();
});
const value = id => document.getElementById(id).value;
function getConfig() {
  return { jornada: Number(value('jornada')), extras: Number(value('extras')), margem: Number(value('margem')), noturno: document.getElementById('noturno').checked };
}
function updateRules() {
  const config = getConfig();
  document.getElementById('rule-jornada').textContent = `${duration(config.jornada)} de jornada`;
  document.getElementById('rule-extras').textContent = `Até ${duration(config.extras)} de extras`;
  document.getElementById('margin-note').textContent = `Saídas arredondadas para baixo, com ${config.margem} minutos de antecedência. A margem pode deixar saldo negativo; confira seu ponto.`;
}
form.addEventListener('submit', event => {
  event.preventDefault();
  ocultarErro();
  try {
    const six = document.getElementById('seis-marcacoes').checked;
    const config = getConfig();
    const result = calculateExitTime(value('entrada'), value('saida-cafe'), value('entrada-cafe'), six ? value('segunda-saida') : null, six ? value('segunda-entrada') : null, config);
    displayResult(result, config);
  } catch (error) {
    hideResult();
    mostrarErro(error.message);
  }
});
document.querySelector('main').addEventListener('input', () => { hideResult(); ocultarErro(); updateRules(); });
form.addEventListener('change', toggleCampoExtra);
// O evento reset acontece antes de o navegador restaurar os valores iniciais.
form.addEventListener('reset', () => queueMicrotask(() => {
  hideResult(); ocultarErro(); toggleCampoExtra(); updateRules();
}));
document.querySelector('main').addEventListener('invalid', event => {
  hideResult();
  showSettings(settingsPanel.contains(event.target));
}, true);
toggleCampoExtra();
updateRules();
