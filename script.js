let currentScore = 0;
let highScore = 0;
let gameSpeed = 2;
let gameInterval;

const mainMenu = document.getElementById('main-menu');
const gameContainer = document.getElementById('game-container');
const playButton = document.getElementById('play-button');
const menuButton = document.getElementById('menu-button');
const currentScoreDisplay = document.getElementById('current-score');
const highScoreDisplay = document.getElementById('high-score');
const runner = document.getElementById('runner');
const gameArea = document.getElementById('game-area');
const crashMessage = document.getElementById('crash-message');

// Обработчики событий
playButton.addEventListener('click', startGame);
menuButton.addEventListener('click', returnToMenu);

// Управление с клавиатуры
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') moveRunner(-40);
    if (event.key === 'ArrowRight') moveRunner(40);
});

// Запуск игры
function startGame() {
    mainMenu.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    currentScore = 0;
    gameSpeed = 2;
    updateScore();
    gameArea.innerHTML = '<div id="runner"></div>'; // Сброс игры
    crashMessage.classList.add('hidden'); // Скрыть сообщение о столкновении
    clearInterval(gameInterval); // Очистить предыдущий интервал
    gameInterval = setInterval(updateGame, 20);
    spawnObstacle();
}

// Возврат в меню
function returnToMenu() {
    clearInterval(gameInterval);
    gameContainer.classList.add('hidden');
    mainMenu.classList.remove('hidden');
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreDisplay.textContent = highScore;
    }
}

// Движение человечка
function moveRunner(offset) {
    const runnerLeft = runner.offsetLeft;
    const newPosition = runnerLeft + offset;
    if (newPosition >= 0 && newPosition <= 260) {
        runner.style.left = newPosition + 'px';
    }
}

// Создание препятствий
function spawnObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    const positions = [60, 130, 200]; // Лево, центр, право (ближе к центру)
    obstacle.style.left = positions[Math.floor(Math.random() * 3)] + 'px';
    obstacle.style.top = '0px'; // Начальная позиция сверху
    gameArea.appendChild(obstacle);
    setTimeout(spawnObstacle, 1000 - gameSpeed * 20); // Ускорение игры и больше препятствий
}

// Движение препятствий
function moveObstacles() {
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => {
        const obstacleTop = parseInt(obstacle.style.top);
        if (obstacleTop > 500) {
            obstacle.remove();
        } else {
            obstacle.style.top = obstacleTop + gameSpeed + 'px';
        }
    });
}

// Проверка столкновений
function checkCollision() {
    const obstacles = document.querySelectorAll('.obstacle');
    const runnerRect = runner.getBoundingClientRect();

    obstacles.forEach(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();
        if (runnerRect.left < obstacleRect.right &&
            runnerRect.right > obstacleRect.left &&
            runnerRect.bottom > obstacleRect.top) {
            endGame();
        }
    });
}

// Завершение игры
function endGame() {
    clearInterval(gameInterval);
    crashMessage.classList.remove('hidden');
    setTimeout(() => {
        crashMessage.classList.add('hidden');
        returnToMenu();
    }, 3000); // Через 3 секунды вернуться в меню
}

// Обновление очков и ускорение игры
function updateScore() {
    currentScore += 1;
    currentScoreDisplay.textContent = currentScore;
    if (currentScore % 50 === 0) {
        gameSpeed += 0.5; // Увеличение скорости каждые 50 очков
    }
}

// Основной игровой цикл
function updateGame() {
    moveObstacles();
    checkCollision();
    updateScore();
}
