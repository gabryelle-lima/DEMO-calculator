# Calculadora de jornada

Site estático em `docs/`, compatível com GitHub Pages. Sem dependências de produção.

## Uso

Informe a entrada e os intervalos na ordem real. Um horário menor que o anterior é interpretado como o dia seguinte. Selecione quatro ou seis marcações. A última saída é calculada.

Em **Regras do cálculo**:

- Jornada: 440 minutos (7h20), padrão do projeto atual.
- Extras: 120 minutos (2h00).
- Margem: 2 minutos reais de antecedência, conforme preferência da autora.
- Hora noturna reduzida: ativada, somente entre 22h e 05h. Após 05h, usa hora comum. Não aplica automaticamente regras de prorrogação da hora noturna.

Esses parâmetros representam a configuração da calculadora, não uma validação de regras trabalhistas ou de acordos da empresa. Confira sua escala com o RH.

## Precisão e arredondamento

Um minuto diurno vale 7 unidades; um minuto noturno vale 8 unidades. Isso representa exatamente o fator 60/52,5 sem somas em ponto flutuante. Intervalos nunca são contados, inclusive os que cruzam meia-noite, 22h ou 05h.

Cada alvo é calculado independentemente: jornada e jornada + extras. A saída é o último minuto inteiro que não ultrapassa o respectivo alvo, menos a margem de segurança em minutos reais. Essa antecipação pode deixar saldo negativo; a interface informa o saldo estimado. A margem não garante concordância com um sistema de ponto que use outras regras.

Se as marcações já atingirem a jornada ou ultrapassarem o limite, a interface avisa. Nenhuma saída é sugerida antes do último retorno informado. Não é possível antecipar uma marcação já feita.

Exemplo: entrada 22:00, intervalo 01:00–02:00, jornada 7h20. O último minuto inteiro abaixo do alvo é 05:28 do dia seguinte. Com a margem de 2 minutos, a saída sugerida é 05:26. O limite com 2h00 de extras e a mesma margem é 07:26.

## Desenvolvimento

Use Node.js 20 ou posterior:

```sh
npm test
```

Sirva `docs/` com um servidor HTTP estático para testar os módulos JavaScript. Abrir `index.html` diretamente pelo sistema de arquivos pode bloquear os módulos no navegador.

Os testes cobrem jornadas diurnas e noturnas, quatro e seis marcações, horários inválidos, intervalos, limite já ultrapassado, margem e uma varredura de 288 entradas com comparação independente por sobreposição de faixas horárias.
