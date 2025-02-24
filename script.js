function toggleBalancePopup() {
    const balancePopup = document.getElementById('balancePopup');
    balancePopup.style.display = balancePopup.style.display === 'block' ? 'none' : 'block';
}

function addBalance(amount) {
    const balanceElement = document.getElementById('balance');
    let balance = parseInt(balanceElement.textContent);
    balance += amount;
    balanceElement.textContent = balance;
    toggleBalancePopup();
}

function startMinesGame() {
    window.location.href = 'mines.html'; // Переход к игре Мины
}

function startCrashGame() {
    window.location.href = 'crash.html'; // Переход к игре Crash
}
