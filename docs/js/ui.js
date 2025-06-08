export function mostrarErro(mensagem) {
  const erroDiv = document.getElementById('mensagemErro');
  erroDiv.textContent = mensagem;
  erroDiv.classList.add('erro');
}

export function ocultarErro() {
  const erroDiv = document.getElementById('mensagemErro');
  erroDiv.textContent = '';
  erroDiv.classList.remove('erro');
}

export function displayResult(saidaSugerida, horarioLimite, minutosSaida) {
  const resultadoDiv = document.getElementById('resultado');
resultadoDiv.classList.remove('hidden');
resultadoDiv.classList.add('resultado');


  // define classes para cor
  const minutosExtras = minutosSaida - 440;
  resultadoDiv.classList.remove('vermelho', 'amarelo', 'normal');
  if (minutosExtras > 120) {
    resultadoDiv.classList.add('vermelho');
  } else if (minutosExtras > 0) {
    resultadoDiv.classList.add('amarelo');
  } else {
    resultadoDiv.classList.add('normal');
  }

  resultadoDiv.innerHTML = `
    <span class="hora-sugerida">Saída Sugerida: ${saidaSugerida}</span>
    <span class="hora-limite">Horário Limite: ${horarioLimite}</span>
  `;
}

export function resetFields() {
  document.querySelectorAll('input[type="time"]').forEach(i => i.value = '');
  document.getElementById('quatro-marcacoes').checked = true;
  toggleCampoExtra();

  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = '';
  resultadoDiv.classList.remove('resultado', 'vermelho', 'amarelo', 'normal');

  ocultarErro();
}

export function toggleCampoExtra() {
  document.getElementById('campoExtra').style.display =
    document.getElementById('seis-marcacoes').checked ? 'block' : 'none';
}