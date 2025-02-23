let balance = 0;
let currentBet = 0;
let multiplier = 0.02;
let mines = [];
let revealedCells = [];
let gameActive = false;

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
    balanceElement.textContent = balance;
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
    currentBet = 0;
    multiplier = 0.02;
    gameStatus.textContent = '';
    minesField.innerHTML = '';
    betAmountInput.value = '';
    createMinesField();
}

function createMinesField() {
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
    balanceElement.textContent = balance;
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
        gameStatus.textContent = 'Вы нашли мину! Игра окончена.';
    } else {
        cell.textContent = '⭐';
        revealedCells.push(index);
        multiplier *= 2;
        gameStatus.textContent = `Множитель: ${multiplier}x`;
    }
}

function cashOut() {
    if (!gameActive) return;

    const winAmount = currentBet * multiplier;
    balance += winAmount;
    balanceElement.textContent = balance;
    gameActive = false;
    gameStatus.textContent = `Вы забрали ставку! Ваш выигрыш: ${winAmount} ₽`;
}
