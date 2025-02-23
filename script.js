let balance = 0;
const balanceElement = document.getElementById('balance');
const balancePopup = document.getElementById('balancePopup');
const plinkoBoard = document.getElementById('plinkoBoard');
const betAmountInput = document.getElementById('betAmount');

function toggleBalancePopup() {
    balancePopup.style.display = balancePopup.style.display === 'block' ? 'none' : 'block';
}

function addBalance(amount) {
    balance += amount;
    balanceElement.textContent = balance;
    toggleBalancePopup();
}

function startGame() {
    const betAmount = parseInt(betAmountInput.value);
    if (isNaN(betAmount) || betAmount < 1) {
        alert('Введите корректную ставку');
        return;
    }
    if (betAmount > balance) {
        alert('Недостаточно средств на балансе');
        return;
    }
    balance -= betAmount;
    balanceElement.textContent = balance;

    const ball = document.createElement('div');
    ball.className = 'plinko-ball';
    plinkoBoard.appendChild(ball);

    let positionX = plinkoBoard.offsetWidth / 2 - 10;
    let positionY = 0;
    ball.style.left = `${positionX}px`;
    ball.style.top = `${positionY}px`;

    const interval = setInterval(() => {
        positionY += 2;
        positionX += (Math.random() - 0.5) * 4;
        ball.style.left = `${positionX}px`;
        ball.style.top = `${positionY}px`;

        if (positionY >= plinkoBoard.offsetHeight - 20) {
            clearInterval(interval);
            const basketIndex = Math.floor((positionX + 10) / (plinkoBoard.offsetWidth / 13));
            const multipliers = [100, 50, 20, 10, 5, 2, 0.2, 2, 5, 10, 20, 50, 100];
            const multiplier = multipliers[basketIndex];
            const winAmount = betAmount * multiplier;
            balance += winAmount;
            balanceElement.textContent = balance;
            alert(`Шарик попал в корзину с множителем ${multiplier}x! Вы выиграли ${winAmount} ₽`);
            plinkoBoard.removeChild(ball);
        }
    }, 10);
}

// Создание корзинок
const basketWidth = plinkoBoard.offsetWidth / 13;
for (let i = 0; i < 13; i++) {
    const basket = document.createElement('div');
    basket.className = 'plinko-basket';
    basket.style.left = `${i * basketWidth}px`;
    basket.textContent = `${[100, 50, 20, 10, 5, 2, 0.2, 2, 5, 10, 20, 50, 100][i]}x`;
    plinkoBoard.appendChild(basket);
}
