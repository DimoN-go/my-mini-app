let balance = 0;
let currentBet = 0;
let multiplier = 1;
let mines = [];
let revealedCells = [];
let gameActive = false;
let clickCount = 0;

// Система множителей (создает иллюзию выбора, но казино остается в плюсе)
const multipliers = [
    0.08, 0.16, 0.32, 0.64, 0.92, 1.21, 1.44, 1.67, 2.11, 3.21,
    4.56, 6.85, 9.21, 11.43, 14.56, 18.41, 22.11, 26.78, 32.87, 40.44
];

const balanceElement = document.getElementById('balance');
const balancePopup = document.getElementById('balancePopup');
const mainMenu = document.getElementById('mainMenu');
const gameContainer = document.getElementById('gameContainer');
const minesField = document.getElementById('minesField');
const betAmountInput = document.getElementById('betAmount');
const gameStatus = document.getElementById('gameStatus');
const nextMultiplierValue = document.getElementById('nextMultiplierValue');

function toggleBalancePopup() {
    balancePopup.style.display = balancePopup.style.display === 'block' ? 'none' : 'block';
}

function addBalance(amount) {
    balance += amount;
    balanceElement.textContent = Math.floor(balance);
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
    clickCount = 0;
    multiplier = 1;
    gameStatus.textContent = '';
    minesField.innerHTML = '';
    createMinesField();
    updateNextMultiplier();
}

function createMinesField() {
    minesField.innerHTML = '';
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
    balanceElement.textContent = Math.floor(balance);
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
        cell.classList.add('bomb');
        document.getElementById('bombSound').play();
        gameActive = false;
        gameStatus.textContent = `Вы нашли мину! Игра перезапустится через 3 секунды.`;
        showAllMines(); // Показываем все мины и звездочки
        setTimeout(resetGame, 3000);
    } else {
        cell.textContent = '⭐';
        cell.classList.add('star');
        document.getElementById('starSound').play();
        revealedCells.push(index);
        clickCount++;
        multiplier = multipliers[clickCount - 1];
        updateNextMultiplier();
        gameStatus.textContent = `Множитель: ${multiplier.toFixed(2)}x`;
    }
}

function showAllMines() {
    for (let i = 0; i < 36; i++) {
        const cell = minesField.children[i];
        if (mines.includes(i)) {
            cell.textContent = '💣';
            cell.classList.add('bomb');
        } else {
            cell.textContent = '⭐';
            cell.classList.add('star');
        }
    }
}

function cashOut() {
    if (!gameActive) return;

    const winAmount = currentBet * multiplier;
    balance += winAmount;
    balanceElement.textContent = Math.floor(balance);
    document.getElementById('coinSound').play();
    gameActive = false;
    gameStatus.textContent = `Вы забрали ставку! Ваш выигрыш: ${Math.floor(winAmount)} ₽`;
    resetGame();
}

function updateNextMultiplier() {
    if (clickCount < multipliers.length) {
        nextMultiplierValue.textContent = `${multipliers[clickCount].toFixed(2)}x`;
    } else {
        nextMultiplierValue.textContent = 'Максимальный множитель достигнут';
    }
}
