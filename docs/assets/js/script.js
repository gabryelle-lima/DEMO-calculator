document.getElementById('calcular').addEventListener('click', calculateExitTime);
document.getElementById('resetar').addEventListener('click', resetFields);

function toggleCampoExtra() {
  const mode = document.querySelector('input[name="modo-jornada"]:checked').value;
  document.getElementById('campoExtra').style.display = mode === 'seis' ? 'block' : 'none';
}

function validateFields() {
  const mode = document.querySelector('input[name="modo-jornada"]:checked').value;
  const requiredFields = ['entrada', 'saida-cafe', 'entrada-cafe'];

  if (mode === 'seis') {
    requiredFields.push('segunda-saida', 'segunda-entrada');
  }

  for (const id of requiredFields) {
    const campo = document.getElementById(id);
    if (!campo.value) {
      return false;
    }
  }
  return true;
}

function calculateExitTime() {
  if (!validateFields()) {
    document.getElementById('resultado').innerHTML = '<span class="erro">Preencha todos os horários!</span>';
    document.getElementById('resultado').style.display = 'block';
    return;
  }

  const mode = document.querySelector('input[name="modo-jornada"]:checked').value;
  const jornadaBase = 7 + 20 / 60;
  const extraHours = 2;

  let suggestedExit, limitExit;

  if (mode === 'quatro') {
    const e1 = convertToDecimal(document.getElementById('entrada').value);
    const s1 = convertToDecimal(document.getElementById('saida-cafe').value);
    const e2 = convertToDecimal(document.getElementById('entrada-cafe').value);

    const intervalo = e2 - s1;
    const baseExit = e1 + jornadaBase + intervalo;

    const nightShiftMinutes = calculateNightShiftMinutes(e1, s1);
    const discountHours = nightShiftMinutes / 60;

    suggestedExit = baseExit - discountHours;
    limitExit = suggestedExit + extraHours;

  } else if (mode === 'seis') {
    const e1 = convertToDecimal(document.getElementById('entrada').value);
    const s1 = convertToDecimal(document.getElementById('saida-cafe').value);
    const e2 = convertToDecimal(document.getElementById('entrada-cafe').value);
    const s2 = convertToDecimal(document.getElementById('segunda-saida').value);
    const e3 = convertToDecimal(document.getElementById('segunda-entrada').value);

    const work1 = s1 - e1;
    const work2 = s2 - e2;
    const totalWorked = work1 + work2;

    const remaining = jornadaBase - totalWorked;

    const nightShiftMinutes = calculateNightShiftMinutes(e1, s1);
    const discountHours = nightShiftMinutes / 60;

    suggestedExit = e3 + remaining;
    suggestedExit -= discountHours;

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

  if (start > end) {
    totalMinutes += calculateNightShiftMinutesBetween(start, 24, 22, 5);
    totalMinutes += calculateNightShiftMinutesBetween(0, end, 22, 5);
  } else {
    totalMinutes += calculateNightShiftMinutesBetween(start, end, 22, 5);
  }

  const hoursInNightShift = totalMinutes / 60;
  return hoursInNightShift * 8.5;
}

function calculateNightShiftMinutesBetween(start, end, nightStart, nightEnd) {
  let totalMinutes = 0;

  for (let m = Math.floor(start * 60); m < end * 60; m++) {
    const hour = (m / 60) % 24;
    if (hour >= nightStart || hour < nightEnd) {
      totalMinutes += 1;
    }
  }

  return totalMinutes;
}

function displayResult(suggestedExit, limitExit) {
  const format = t => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  if (suggestedExit >= 24) {
    suggestedExit -= 24;
  }

  if (limitExit >= 24) {
    limitExit -= 24;
  }

  document.getElementById('resultado').innerHTML = `
    <span class="hora-sugerida">Saída sugerida: ${format(suggestedExit)}</span>
    <span class="hora-limite">Horário limite: ${format(limitExit)}</span>
  `;
  document.getElementById('resultado').style.display = 'block';
}

function resetFields() {
  ['entrada', 'saida-cafe', 'entrada-cafe', 'segunda-saida', 'segunda-entrada']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('resultado').innerHTML = '';
  document.getElementById('quatro-marcacoes').checked = true;
  document.getElementById('resultado').style.display = 'none';
  toggleCampoExtra();
}

document.getElementById('menu-toggle').addEventListener('click', function () {
  const navList = document.getElementById('nav-list');
  navList.classList.toggle('show');
});



/*
* Copyright (c) 2025 Gabryelle de Lourdes Machado Lima
* Licenciado sob contrato proprietário.
* Todos os direitos reservados.
* Não é permitido redistribuir, modificar ou sublicenciar este código sem autorização.
*/