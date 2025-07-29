let saldo = 1000;
let spinning = false;

const simbolos = ['🐯', '💎', '🍀', '⭐', '🔥', '🎰', '💰'];
const premios = {
    '🐯🐯🐯': 10,
    '💎💎💎': 8,
    '🍀🍀🍀': 5,
    '⭐⭐⭐': 3,
    '🔥🔥🔥': 2,
    '🎰🎰🎰': 15,
    '💰💰💰': 20
};

document.addEventListener('DOMContentLoaded', function() {
    const spinBtn = document.getElementById('spinBtn');
    const saldoElement = document.getElementById('saldo');
    const apostaSelect = document.getElementById('apostaValor');
    const resultadoElement = document.getElementById('resultado');
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];

    function updateSaldo() {
        saldoElement.textContent = saldo.toFixed(2);
        
        if (saldo < 10) {
            spinBtn.disabled = true;
            spinBtn.textContent = '💸 SEM SALDO 💸';
        }
    }

    function gerarResultado() {
        const chance = Math.random();
        
        if (chance < 0.05) {
            return ['🐯', '🐯', '🐯'];
        } else if (chance < 0.08) {
            return ['💎', '💎', '💎'];
        } else if (chance < 0.12) {
            return ['🍀', '🍀', '🍀'];
        } else if (chance < 0.18) {
            return ['⭐', '⭐', '⭐'];
        } else if (chance < 0.25) {
            return ['🔥', '🔥', '🔥'];
        } else if (chance < 0.27) {
            return ['🎰', '🎰', '🎰'];
        } else if (chance < 0.29) {
            return ['💰', '💰', '💰'];
        } else {
            return [
                simbolos[Math.floor(Math.random() * simbolos.length)],
                simbolos[Math.floor(Math.random() * simbolos.length)],
                simbolos[Math.floor(Math.random() * simbolos.length)]
            ];
        }
    }

    function showResult(message, tipo) {
        resultadoElement.innerHTML = message;
        resultadoElement.className = `resultado ${tipo}`;
        
        setTimeout(() => {
            resultadoElement.className = 'resultado';
        }, 3000);
    }

    function spin() {
        if (spinning) return;
        
        const aposta = parseFloat(apostaSelect.value);
        
        if (saldo < aposta) {
            showResult('Saldo insuficiente! 💸', 'perdeu');
            return;
        }
        
        spinning = true;
        saldo -= aposta;
        updateSaldo();
        
        spinBtn.disabled = true;
        spinBtn.textContent = '🎰 GIRANDO... 🎰';
        
        // Animação
        reels.forEach(reel => {
            reel.classList.add('spinning');
        });
        
        setTimeout(() => {
            const resultado = gerarResultado();
            
            // Para animação
            reels.forEach(reel => {
                reel.classList.remove('spinning');
            });
            
            // Atualiza símbolos
            reels.forEach((reel, index) => {
                const symbol = reel.querySelector('.symbol');
                symbol.textContent = resultado[index];
            });
            
            // Verifica prêmio
            const combinacao = resultado.join('');
            
            if (premios[combinacao]) {
                const multiplicador = premios[combinacao];
                const premio = aposta * multiplicador;
                saldo += premio;
                
                updateSaldo();
                showResult(`🎉 PARABÉNS! 🎉<br>Você ganhou R$ ${premio.toFixed(2)}!<br>Multiplicador: ${multiplicador}x`, 'ganhou');
            } else {
                showResult(`😢 Que pena!<br>Você perdeu R$ ${aposta.toFixed(2)}<br>Tente novamente!`, 'perdeu');
            }
            
            spinning = false;
            spinBtn.disabled = false;
            spinBtn.textContent = '🎰 GIRAR 🎰';
            
        }, 2000);
    }

    spinBtn.addEventListener('click', spin);
    updateSaldo();
});