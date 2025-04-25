document.getElementById('calcular').addEventListener('click', calculateExitTime);
document.getElementById('resetar').addEventListener('click', resetFields);

function toggleCampoExtra() {
  const mode = document.querySelector('input[name="modo-jornada"]:checked').value;
  console.log(mode);
  document.getElementById('campoExtra').style.display = mode === 'seis' ? 'block' : 'none';
}

function calculateExitTime() {
  const mode = document.querySelector('input[name="modo-jornada"]:checked').value;
  const jornadaBase = 7 + 20 / 60; // 7h20m = 7.333h
  const extraHours = 2;

  let suggestedExit, limitExit;

  // Verificar se todos os campos de horário foram preenchidos
  const entrada = document.getElementById('entrada').value;
  const saidaCafe = document.getElementById('saida-cafe').value;
  const entradaCafe = document.getElementById('entrada-cafe').value;
  const segundaSaida = document.getElementById('segunda-saida').value;
  const segundaEntrada = document.getElementById('segunda-entrada').value;

  if (!entrada || !saidaCafe || !entradaCafe || !segundaSaida || !segundaEntrada) {
    displayErrorMessage("Por favor, preencha todos os horários.");
    return; // Se algum horário estiver faltando, interrompe o cálculo
  }

  if (mode === 'quatro') {
    const e1 = convertToDecimal(entrada);
    const s1 = convertToDecimal(saidaCafe);
    const e2 = convertToDecimal(entradaCafe);

    // intervalo de café
    const intervalo = e2 - s1;
    // saída base (entrada + jornada + intervalo)
    const baseExit = e1 + jornadaBase + intervalo;

    // desconto de adicional noturno apenas no primeiro bloco
    const nightShiftMinutes = calculateNightShiftMinutes(e1, s1);
    const discountHours = nightShiftMinutes / 60;

    suggestedExit = baseExit - discountHours;
    limitExit = suggestedExit + extraHours;

  } else if (mode === 'seis') {
    const e1 = convertToDecimal(entrada);
    const s1 = convertToDecimal(saidaCafe);
    const e2 = convertToDecimal(entradaCafe);
    const s2 = convertToDecimal(segundaSaida);
    const e3 = convertToDecimal(segundaEntrada);

    // tempo trabalhado em cada sessão
    const work1 = s1 - e1;
    const work2 = s2 - e2;
    const totalWorked = work1 + work2;

    // quanto falta para completar 7h20m
    const remaining = jornadaBase - totalWorked;

    // desconto noturno sobre o primeiro bloco
    const nightShiftMinutes = calculateNightShiftMinutes(e1, s1);
    const discountHours = nightShiftMinutes / 60;

    // saída sugerida: após segunda entrada + remaining - desconto
    suggestedExit = e3 + remaining - discountHours;
    limitExit = suggestedExit + extraHours;
  }

  displayResult(suggestedExit, limitExit);
}

function convertToDecimal(time) {
  const [h, m] = time.split(':').map(Number);
  return h + m / 60;
}

function calculateNightShiftMinutes(start, end) {
  let totalMinutes = 0;
  for (let m = Math.floor(start * 60); m < end * 60; m++) {
    const hour = (m / 60) % 24;
    if (hour >= 22 || hour < 5) {
      totalMinutes += 1;
    }
  }
  // desconto de 8.5 minutos por hora noturna
  const hoursInNightShift = totalMinutes / 60;
  return hoursInNightShift * 8.5;
}

function displayResult(suggestedExit, limitExit) {
  const format = t => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  if (isNaN(suggestedExit) || isNaN(limitExit)) {
    displayErrorMessage("Por favor, preencha todos os horários corretamente.");
    return;
  }

  document.getElementById('resultado').innerHTML = `
    <span class="hora-sugerida">Saída sugerida: ${format(suggestedExit)}</span>
    <span class="hora-limite">Horário limite: ${format(limitExit)}</span>
  `;
  document.getElementById('resultado').style.display = 'block';
}

function displayErrorMessage(message) {
  document.getElementById('resultado').innerHTML = `<span class="erro">${message}</span>`;
  document.getElementById('resultado').style.display = 'block';
}

function resetFields() {
  ['entrada','saida-cafe','entrada-cafe','segunda-saida','segunda-entrada']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('resultado').innerHTML = '';
  document.getElementById('quatro-marcacoes').checked = true;
  document.getElementById('resultado').style.display = 'none';
  toggleCampoExtra();
}
