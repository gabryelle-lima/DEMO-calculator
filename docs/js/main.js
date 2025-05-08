// main.js
import { calculateExitTime } from './calculadora.js';
import { displayResult, resetFields, toggleCampoExtra } from './ui.js';


document.getElementById('calcular').addEventListener('click', function() {
  const entrada = document.getElementById('entrada').value;
  const saidaCafe = document.getElementById('saida-cafe').value;
  const entradaCafe = document.getElementById('entrada-cafe').value;
  const segundaSaida = document.getElementById('segunda-saida').value;
  const segundaEntrada = document.getElementById('segunda-entrada').value;

  if (!entrada || !saidaCafe || !entradaCafe) {
    alert('Preencha todos os campos obrigatórios!');
    return;
  }

  const tipoJornada = document.querySelector('input[name="modo-jornada"]:checked').value;
  const camposExtras = tipoJornada === 'seis' ? [segundaSaida, segundaEntrada] : [];

  try {
    const { saidaSugerida, horarioLimite } = calculateExitTime(
      entrada, 
      saidaCafe, 
      entradaCafe, 
      ...camposExtras
    );
    displayResult(saidaSugerida, horarioLimite);
  } catch (error) {
    console.error(error.message);
    displayResult('Erro no cálculo', 'Erro no cálculo');
  }
});

document.getElementById('resetar').addEventListener('click', resetFields);

document.querySelectorAll('input[name="modo-jornada"]').forEach(radio => {
  radio.addEventListener('change', toggleCampoExtra);
});

