let balance = 0;
let currentBet = 0;
let multiplier = 1;
let gameActive = false;
let cashOutButton = document.getElementById('cashOutButton');
let multiplierElement = document.getElementById('multiplier');
let rocket = document.getElementById('rocket');
let gameStatus = document.getElementById('gameStatus');
let balanceElement = document.getElementById('balance');

// Логика для контроля выигрышей и проигрышей
let crashPoint = Math.random() * 10 + 1; // Точка "краша" (от 1x до 11x)

function toggleBalancePopup() {
    const balancePopup = document.getElementById('balancePopup');
    balancePopup.style.display = balancePopup.style.display === 'block' ? 'none' : 'block';
}

function addBalance(amount) {
    balance += amount;
    balanceElement.textContent = Math.floor(balance);
    toggleBalancePopup();
}

function goBackToMainMenu() {
    window.location.href = 'index.html';
}

function placeBet() {
    const betAmount = parseInt(document.getElementById('betAmount').value);
    if (isNaN(betAmount) || betAmount < 1) {
        alert('Введите корректную ставку');
        return;
    }
    if (betAmount > balance) {
        alert('Недостаточно средств на балансе');
        return;
    }
    balance -= betAmount;
    balanceElement.textContent = Math.floor(balance);
    currentBet = betAmount;
    gameActive = true;
    cashOutButton.disabled = false;
    startGame();
}

function startGame() {
    multiplier = 1;
    crashPoint = Math.random() * 10 + 1; // Новая точка "краша"
    rocket.style.bottom = '-100px'; // Ракета начинается за пределами экрана
    rocket.style.transition = 'bottom 5s linear';
    rocket.style.bottom = '100%'; // Ракета летит вверх
    updateMultiplier();
}

function updateMultiplier() {
    if (gameActive && multiplier < crashPoint) {
        multiplier += 0.01;
        multiplierElement.textContent = `${multiplier.toFixed(2)}x`;
        cashOutButton.textContent = `Забрать: ${Math.floor(currentBet * multiplier)} ₽`;
        setTimeout(updateMultiplier, 50); // Обновляем множитель каждые 50 мс
    } else if (gameActive) {
        // Игрок не успел забрать ставку
        gameActive = false;
        gameStatus.textContent = 'Вы не успели забрать ставку!';
        setTimeout(() => {
            gameStatus.textContent = '';
            resetGame();
        }, 3000);
    }
}

function cashOut() {
    if (gameActive) {
        const winAmount = currentBet * multiplier;
        balance += winAmount;
        balanceElement.textContent = Math.floor(balance);
        gameActive = false;
        gameStatus.textContent = `Вы забрали ставку! Ваш выигрыш: ${Math.floor(winAmount)} ₽`;
        cashOutButton.disabled = true;
        setTimeout(() => {
            gameStatus.textContent = '';
            resetGame();
        }, 3000);
    }
}

function resetGame() {
    multiplier = 1;
    multiplierElement.textContent = '1.00x';
    cashOutButton.textContent = 'Забрать: 0 ₽';
    currentBet = 0;
    rocket.style.transition = 'none';
    rocket.style.bottom = '-100px'; // Ракета возвращается в исходное положение
}
