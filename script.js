let balance = 0;
let currentBet = 0;
let multiplier = 1;
let mines = [];
let revealedCells = [];
let gameActive = false;
let clickCount = 0;
let crashPoint = Math.random() * 10 + 1;

const balanceElement = document.getElementById('balance');
const balancePopup = document.getElementById('balancePopup');
const mainMenu = document.getElementById('mainMenu');
const minesGame = document.getElementById('minesGame');
const crashGame = document.getElementById('crashGame');
const minesField = document.getElementById('minesField');
const minesBetAmount = document.getElementById('minesBetAmount');
const minesGameStatus = document.getElementById('minesGameStatus');
const crashBetAmount = document.getElementById('crashBetAmount');
const crashGameStatus = document.getElementById('crashGameStatus');
const rocket = document.getElementById('rocket');
const multiplierElement = document.getElementById('multiplier');
const cashOutButton = document.getElementById('cashOutButton');

// Общие функции
function toggleBalancePopup() {
    balancePopup.style.display = balancePopup.style.display === 'block' ? 'none' : 'block';
}

function addBalance(amount) {
    balance += amount;
    balanceElement.textContent = Math.floor(balance);
    toggleBalancePopup();
}

function goBackToMenu() {
    mainMenu.style.display = 'block';
    minesGame.style.display = 'none';
    crashGame.style.display = 'none';
    resetMinesGame();
    resetCrashGame();
}

// Игра Мины
function startMinesGame() {
    mainMenu.style.display = 'none';
    minesGame.style.display = 'block';
    resetMinesGame();
}

function resetMinesGame() {
    mines = [];
    revealedCells = [];
    gameActive = false;
    clickCount = 0;
    multiplier = 1;
    minesGameStatus.textContent = '';
    minesField.innerHTML = '';
    createMinesField();
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

function placeMinesBet() {
    const betAmount = parseInt(minesBetAmount.value);
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
    minesGameStatus.textContent = `Ставка принята: ${currentBet} ₽. Множитель: ${multiplier}x`;
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
        minesGameStatus.textContent = `Вы нашли мину! Игра перезапустится через 3 секунды.`;
        showAllMines();
        setTimeout(resetMinesGame, 3000);
    } else {
        cell.textContent = '⭐';
        cell.classList.add('star');
        document.getElementById('starSound').play();
        revealedCells.push(index);
        clickCount++;
        multiplier = [0.08, 0.16, 0.32, 0.48, 0.64, 0.82, 1.07, 1.28, 1.53, 1.81, 2.16, 2.33, 2.71, 3.14, 3.58, 4.01, 4.41, 5.11, 5.76, 6.78, 7.34, 8.11, 9.23, 10.44, 12.11, 13.21, 15.34, 17.1, 19.56, 21.78, 24.11, 26.27, 30.43, 36.58][clickCount - 1];
        minesGameStatus.textContent = `Множитель: ${multiplier.toFixed(2)}x`;
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

function cashOutMines() {
    if (!gameActive) return;

    const winAmount = currentBet * multiplier;
    balance += winAmount;
    balanceElement.textContent = Math.floor(balance);
    document.getElementById('coinSound').play();
    gameActive = false;
    minesGameStatus.textContent = `Вы забрали ставку! Ваш выигрыш: ${Math.floor(winAmount)} ₽`;
    resetMinesGame();
}

// Игра Crash
function startCrashGame() {
    mainMenu.style.display = 'none';
    crashGame.style.display = 'block';
    resetCrashGame();
}

function resetCrashGame() {
    multiplier = 1;
    multiplierElement.textContent = '1.00x';
    cashOutButton.textContent = 'Забрать: 0 ₽';
    currentBet = 0;
    rocket.style.transition = 'none';
    rocket.style.bottom = '-100px';
    crashGameStatus.textContent = '';
}

function placeCrashBet() {
    const betAmount = parseInt(crashBetAmount.value);
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
    startCrash();
}

function startCrash() {
    multiplier = 1;
    crashPoint = Math.random() * 10 + 1;
    rocket.style.transition = 'bottom 5s linear';
    rocket.style.bottom = '100%';
    updateCrashMultiplier();
}

function updateCrashMultiplier() {
    if (gameActive && multiplier < crashPoint) {
        multiplier += 0.01;
        multiplierElement.textContent = `${multiplier.toFixed(2)}x`;
        cashOutButton.textContent = `Забрать: ${Math.floor(currentBet * multiplier)} ₽`;
        setTimeout(updateCrashMultiplier, 50);
    } else if (gameActive) {
        gameActive = false;
        crashGameStatus.textContent = 'Вы не успели забрать ставку!';
        setTimeout(() => {
            crashGameStatus.textContent = '';
            resetCrashGame();
        }, 3000);
    }
}

function cashOutCrash() {
    if (gameActive) {
        const winAmount = currentBet * multiplier;
        balance += winAmount;
        balanceElement.textContent = Math.floor(balance);
        gameActive = false;
        crashGameStatus.textContent = `Вы забрали ставку! Ваш выигрыш: ${Math.floor(winAmount)} ₽`;
        cashOutButton.disabled = true;
        setTimeout(() => {
            crashGameStatus.textContent = '';
            resetCrashGame();
        }, 3000);
    }
}
