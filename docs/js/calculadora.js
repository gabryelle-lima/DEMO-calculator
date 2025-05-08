// calculadora.js
export function calculateExitTime(entry, breakOut, breakIn, breakOut2 = null, breakIn2 = null) {
    function parseHM(str) {
        const [h, m] = str.split(':').map(Number);
        return h * 60 + m;
    }

    let t0 = parseHM(entry);
    let t1 = parseHM(breakOut);
    if (t1 <= t0) t1 += 1440;

    let t2 = parseHM(breakIn);
    if (t2 <= t1) t2 += 1440;

    let t3 = breakOut2 ? parseHM(breakOut2) : null;
    if (t3 !== null && t3 <= t2) t3 += 1440;

    let t4 = breakIn2 ? parseHM(breakIn2) : null;
    if (t4 !== null && t4 <= (t3 ?? t2)) t4 += 1440;

    function efetivo(start, end) {
        let total = 0;
        for (let m = start; m < end; m++) {
            const mod = m % 1440;
            const isNight = (mod >= 1320 || mod < 300);
            total += isNight ? (60 / 53) : 1; // Ajuste de 53 minutos para hora noturna
        }
        return total;
    }

    let eff1 = efetivo(t0, t1);
    let eff2 = (t2 !== null && t3 !== null) ? efetivo(t2, t3) : 0;
    let eff3 = (t4 !== null) ? efetivo(t4, t4 + 1) : 0;
    const fimIntervalo = t4 !== null ? t4 : (t3 !== null ? t3 : t2);

    const necessario = 440 - (eff1 + eff2 + eff3);

    let effAcumulado = 0;
    let current = fimIntervalo;
    while (true) {
        const mod = current % 1440;
        const isNight = (mod >= 1320 || mod < 300);
        effAcumulado += isNight ? (60 / 53) : 1; // Ajuste de 53 minutos para hora noturna
        if (effAcumulado >= necessario) break;
        current++;
    }

    const saidaMin = Math.ceil(current); // Arredondamento para cima garantido

    let effLimite = 0;
    let limiteCurrent = saidaMin;
    while (true) {
        const mod = limiteCurrent % 1440;
        const isNight = (mod >= 1320 || mod < 300);
        effLimite += isNight ? (60 / 53) : 1; // Ajuste de 53 minutos para hora noturna
        if (effLimite >= 120) break;
        limiteCurrent++;
    }

    const limiteFinal = Math.min(limiteCurrent, saidaMin + 120); // Garantindo que o limite não ultrapasse 9h20

    function format(hm) {
        const minutosTot = hm % 1440;
        const hh = Math.floor(minutosTot / 60).toString().padStart(2, '0');
        const mm = (minutosTot % 60).toString().padStart(2, '0');
        return `${hh}:${mm}`;
    }

    return {
        saidaSugerida: format(saidaMin),
        horarioLimite: format(limiteFinal)
    };
}
