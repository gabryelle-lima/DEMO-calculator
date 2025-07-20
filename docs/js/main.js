// js/main.js — Código completo com verificação de campos e menu móvel
import { calculateExitTime } from './calculadora.js';
import { displayResult, resetFields, toggleCampoExtra, mostrarErro, ocultarErro } from './ui.js';

// Toggle do menu em dispositivos móveis
const menuToggle = document.getElementById('menu-toggle');
const navList    = document.getElementById('nav-list');
if (menuToggle && navList) {
  menuToggle.addEventListener('click', () => {
    navList.classList.toggle('show');
  });
}

// Alterna campos extras para 4 ou 6 marcações
const quatroMarc = document.getElementById('quatro-marcacoes');
const seisMarc   = document.getElementById('seis-marcacoes');
if (quatroMarc && seisMarc) {
  quatroMarc.addEventListener('change', toggleCampoExtra);
  seisMarc.addEventListener('change', toggleCampoExtra);
}

// Botão Calcular
const btnCalcular = document.getElementById('calcular');
if (btnCalcular) {
  btnCalcular.addEventListener('click', () => {
    const entrada        = document.getElementById('entrada').value;
    const saidaCafe      = document.getElementById('saida-cafe').value;
    const entradaCafe    = document.getElementById('entrada-cafe').value;
    const segundaSaida   = document.getElementById('segunda-saida').value;
    const segundaEntrada = document.getElementById('segunda-entrada').value;
    const is4            = quatroMarc.checked;

    // Validação de campos obrigatórios
    if (!entrada || !saidaCafe || !entradaCafe || (!is4 && (!segundaSaida || !segundaEntrada))) {
      mostrarErro("Preencha todos os horários obrigatórios.");
      return;
    }
    ocultarErro();

    // Cálculo e exibição do resultado
    const resultado = calculateExitTime(
      entrada,
      saidaCafe,
      entradaCafe,
      is4 ? null : segundaSaida,
      is4 ? null : segundaEntrada
    );
    displayResult(
      resultado.saidaSugerida,
      resultado.horarioLimite,
      resultado.minutosSaida
    );
  });
}

// Botão Resetar
const btnReset = document.getElementById('resetar');
if (btnReset) {
  btnReset.addEventListener('click', resetFields);
}

// Disponibiliza função no console para testes manuais
window.calculateExitTime = calculateExitTime;
