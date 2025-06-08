import { calculateExitTime } from './calculadora.js';
import { displayResult, resetFields, toggleCampoExtra, mostrarErro, ocultarErro } from './ui.js';

const toggle = document.getElementById('menu-toggle');
const navList = document.getElementById('nav-list');

toggle.addEventListener('click', () => {
  navList.classList.toggle('show');
});


document.getElementById('quatro-marcacoes').addEventListener('change', toggleCampoExtra);
document.getElementById('seis-marcacoes').addEventListener('change', toggleCampoExtra);

document.getElementById('calcular').addEventListener('click', function() {
  const entrada = document.getElementById('entrada').value;
  const saidaCafe = document.getElementById('saida-cafe').value;
  const entradaCafe = document.getElementById('entrada-cafe').value;
  const segundaSaida = document.getElementById('segunda-saida').value;
  const segundaEntrada = document.getElementById('segunda-entrada').value;

  const modo = document.querySelector('input[name="modo-jornada"]:checked').value;
  const isQuatroMarcacoes = (modo === 'quatro');

  if (!entrada || !saidaCafe || !entradaCafe || (!isQuatroMarcacoes && (!segundaSaida || !segundaEntrada))) {
    mostrarErro("Preencha todos os horários obrigatórios.");
    return;
  }

  ocultarErro();

  const resultado = calculateExitTime(entrada, saidaCafe, entradaCafe, segundaSaida, segundaEntrada);
  displayResult(resultado.saidaSugerida, resultado.horarioLimite);
});

document.getElementById('resetar').addEventListener('click', resetFields);

// Torna a função disponível globalmente para testes no console
window.calculateExitTime = calculateExitTime;
