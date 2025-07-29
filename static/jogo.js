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
    const saqueBtn = document.getElementById('saqueBtn');
    const inserirBtn = document.getElementById('inserirBtn');
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
        } else {
            spinBtn.disabled = false;
            spinBtn.textContent = '🎰 GIRAR 🎰';
        }
    }

    function showResult(message, tipo) {
        resultadoElement.innerHTML = message;
        resultadoElement.className = `resultado ${tipo}`;
        
        setTimeout(() => {
            resultadoElement.className = 'resultado';
        }, 3000);
    }

    function gerarResultado() {
        const chance = Math.random();
        
        if (chance < 0.05) return ['🐯', '🐯', '🐯'];
        else if (chance < 0.08) return ['💎', '💎', '💎'];
        else if (chance < 0.12) return ['🍀', '🍀', '🍀'];
        else if (chance < 0.18) return ['⭐', '⭐', '⭐'];
        else if (chance < 0.25) return ['🔥', '🔥', '🔥'];
        else if (chance < 0.27) return ['🎰', '🎰', '🎰'];
        else if (chance < 0.29) return ['💰', '💰', '💰'];
        else {
            return [
                simbolos[Math.floor(Math.random() * simbolos.length)],
                simbolos[Math.floor(Math.random() * simbolos.length)],
                simbolos[Math.floor(Math.random() * simbolos.length)]
            ];
        }
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

        reels.forEach(reel => {
            reel.classList.add('spinning');
        });

        setTimeout(() => {
            const resultado = gerarResultado();

            reels.forEach(reel => {
                reel.classList.remove('spinning');
            });

            reels.forEach((reel, index) => {
                const symbol = reel.querySelector('.symbol');
                symbol.textContent = resultado[index];
            });

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
            updateSaldo();

        }, 2000);
    }

    function inserirDinheiro() {
        const valores = ['50', '100', '200', '500'];
        let opcoes = 'Escolha o valor para inserir:\n\n';

        valores.forEach((valor, index) => {
            opcoes += `${index + 1} - R$ ${valor}.00\n`;
        });

        const escolha = prompt(opcoes + '\nDigite o número da opção (1-4):');

        if (escolha && escolha >= 1 && escolha <= 4) {
            const valorInserido = parseFloat(valores[escolha - 1]);
            saldo += valorInserido;
            updateSaldo();
            showResult(`💳 Dinheiro inserido com sucesso!<br>💰 Valor adicionado: R$ ${valorInserido.toFixed(2)}<br>💵 Novo saldo: R$ ${saldo.toFixed(2)}`, 'ganhou');

            inserirBtn.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';
            inserirBtn.textContent = '✅ INSERIDO';
            inserirBtn.disabled = true;

            setTimeout(() => {
                inserirBtn.style.background = 'linear-gradient(45deg, #3498db, #2980b9)';
                inserirBtn.textContent = '💳 INSERIR';
                inserirBtn.disabled = false;
            }, 2000);
        } else if (escolha !== null) {
            showResult('❌ Opção inválida! Tente novamente.', 'perdeu');
        }
    }

    function sacarDinheiro() {
        if (saldo <= 0) {
            showResult('Não há saldo para sacar! 💸', 'perdeu');
            return;
        }

        const confirmacao = confirm(`Deseja sacar R$ ${saldo.toFixed(2)}?\n\n💡 Dica: Você pode continuar jogando com esse saldo!`);

        if (confirmacao) {
            const valorSacado = saldo;
            saldo = 0;
            updateSaldo();

            showResult(`🎉 Saque realizado com sucesso!<br>💰 Valor sacado: R$ ${valorSacado.toFixed(2)}<br>✅ Dinheiro enviado para sua conta!`, 'ganhou');

            saqueBtn.style.background = 'linear-gradient(45deg, #e74c3c, #c0392b)';
            saqueBtn.textContent = '✅ SACADO';
            saqueBtn.disabled = true;

            setTimeout(() => {
                saqueBtn.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';
                saqueBtn.textContent = '💸 SACAR';
                saqueBtn.disabled = false;
            }, 3000);
        }
    }

    spinBtn.addEventListener('click', spin);
    inserirBtn.addEventListener('click', inserirDinheiro);
    saqueBtn.addEventListener('click', sacarDinheiro);

    updateSaldo();
});
