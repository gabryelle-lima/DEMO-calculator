// ui.js
export function displayResult(suggestedExit, limitExit) {
  
    document.getElementById('resultado').innerHTML = `
      <span class="hora-sugerida">Saída sugerida: ${suggestedExit}</span>
      <span class="hora-limite">Horário limite: ${limitExit}</span>
    `;
    document.getElementById('resultado').style.display = 'block';
  }
  
  export function resetFields() {
    ['entrada', 'saida-cafe', 'entrada-cafe', 'segunda-saida', 'segunda-entrada']
      .forEach(id => document.getElementById(id).value = '');
    document.getElementById('resultado').innerHTML = '';
    document.getElementById('quatro-marcacoes').checked = true;
    document.getElementById('resultado').style.display = 'none';
    toggleCampoExtra();
  }
  
  
    export function toggleCampoExtra() {
    const modo = document.querySelector('input[name="modo-jornada"]:checked').value;
    document.getElementById('campoExtra').style.display = (modo === 'seis') ? 'block' : 'none';
  }
  