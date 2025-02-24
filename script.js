let balance = 0;
let currentBet = 0;
let multiplier = 1;
let mines = [];
let revealedCells = [];
let gameActive = false;
let isFirstClick = true; // Флаг для первого нажатия

const balanceElement = document.getElementById('balance');
const balancePopup = document.getElementById('balancePopup');
const mainMenu = document.getElementById('mainMenu');
const gameContainer = document.getElementById('gameContainer');
const minesField = document.getElementById('minesField');
const betAmountInput = document.getElementById('betAmount');
const gameStatus = document.getElementById('gameStatus');

function toggleBalancePopup() {
    balancePopup.style.display = balancePopup.style.display === 'block' ? 'none' : 'block';
}

function addBalance(amount) {
    balance += amount;
    balanceElement.textContent = Math.floor(balance); // Отображаем баланс без дробной части
    toggleBalancePopup();
}

function startMinesGame() {
    mainMenu.style.display = 'none';
    gameContainer.style.display = 'block';
    resetGame();
}

function goBackToMenu() {
    mainMenu.style.display = 'block';
    gameContainer.style.display = 'none';
    resetGame();
}

function resetGame() {
    mines = [];
    revealedCells = [];
    gameActive = false;
    multiplier = 1;
    isFirstClick = true; // Сбрасываем флаг первого нажатия
    gameStatus.textContent = '';
    minesField.innerHTML = '';
    createMinesField();
}

function createMinesField() {
    minesField.innerHTML = ''; // Очищаем поле
    for (let i = 0; i < 36; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => revealCell(i));
        minesField.appendChild(cell);
    }
}

function placeBet() {
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
    balanceElement.textContent = Math.floor(balance); // Отображаем баланс без дробной части
    currentBet = betAmount;
    gameActive = true;
    placeMines();
    gameStatus.textContent = `Ставка принята: ${currentBet} ₽. Множитель: ${multiplier}x`;
}

function placeMines() {
    mines = [];
    while (mines.length < 3) {
        const randomIndex = Math.floor(Math.random() * 36);
        if (!mines.includes(randomIndex)) {
            mines.push(randomIndex);
        }
    }
}

function revealCell(index) {
    if (!gameActive || revealedCells.includes(index)) return;

    const cell = minesField.children[index];
    cell.classList.add('revealed');

    if (mines.includes(index)) {
        cell.textContent = '💣';
        gameActive = false;
        gameStatus.textContent = `Вы нашли мину! Множитель: ${multiplier.toFixed(2)}x. Игра перезапустится через 3 секунды.`;
        setTimeout(resetGame, 3000); // Перезапуск игры через 3 секунды
    } else {
        cell.textContent = '⭐';
        revealedCells.push(index);
        if (isFirstClick) {
            // Если это первое нажатие, умножаем на 0.04
            multiplier *= 0.04;
            isFirstClick = false; // Сбрасываем флаг первого нажатия
        } else {
            multiplier *= 1.6; // Увеличиваем множитель на 1.6
        }
        gameStatus.textContent = `Множитель: ${multiplier.toFixed(2)}x`;
    }
}

function cashOut() {
    if (!gameActive) return;

    const winAmount = currentBet * multiplier;
    balance += winAmount;
    balanceElement.textContent = Math.floor(balance); // Отображаем баланс без дробной части
    gameActive = false;
    showWinMessage(`Вы выиграли: ${Math.floor(winAmount)} ₽`); // Показываем сообщение о выигрыше
    resetGame(); // Сбрасываем игру после завершения
}

function showWinMessage(message) {
    const winMessage = document.createElement('div');
    winMessage.className = 'win-message';
    winMessage.textContent = message;
    document.body.appendChild(winMessage);

    // Анимация появления
    setTimeout(() => {
        winMessage.style.opacity = '1';
    }, 10);

    // Удаление сообщения через 3 секунды
    setTimeout(() => {
        winMessage.style.opacity = '0';
        setTimeout(() => {
            winMessage.remove();
        }, 300);
    }, 3000);
}
