let currentScore = 0;
let totalScore = 0;
let gameSpeed = 2;
let gameInterval;
let isMobile = false;

const mainMenu = document.getElementById('main-menu');
const gameContainer = document.getElementById('game-container');
const playPcButton = document.getElementById('play-pc');
const playMobileButton = document.getElementById('play-mobile');
const menuButton = document.getElementById('menu-button');
const currentScoreDisplay = document.getElementById('current-score');
const totalScoreDisplay = document.getElementById('total-score');
const runner = document.getElementById('runner');
const gameArea = document.getElementById('game-area');
const mobileControls = document.getElementById('mobile-controls');
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');

// Обработчики событий
playPcButton.addEventListener('click', () => startGame(false));
playMobileButton.addEventListener('click', () => startGame(true));
menuButton.addEventListener('click', returnToMenu);
leftButton.addEventListener('click', () => moveRunner(-40));
rightButton.addEventListener('click', () => moveRunner(40));

// Управление с клавиатуры
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') moveRunner(-40);
    if (event.key === 'ArrowRight') moveRunner(40);
});

// Запуск игры
function startGame(mobile) {
    isMobile = mobile;
    mainMenu.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    mobileControls.classList.toggle('hidden', !isMobile);
    currentScore = 0;
    gameSpeed = 2;
    updateScore();
    gameInterval = setInterval(updateGame, 20);
    spawnObstacle();
}

// Возврат в меню
function returnToMenu() {
    clearInterval(gameInterval);
    gameContainer.classList.add('hidden');
    mainMenu.classList.remove('hidden');
    totalScore += currentScore;
    totalScoreDisplay.textContent = totalScore;
    gameArea.innerHTML = '<div id="runner"></div>'; // Сброс игры
}

// Движение препятствий и проверка столкновений
function updateGame() {
    moveObstacles();
    checkCollision();
    updateScore();
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
    const positions = [0, 130, 260]; // Лево, центр, право
    obstacle.style.left = positions[Math.floor(Math.random() * 3)] + 'px';
    gameArea.appendChild(obstacle);
    setTimeout(spawnObstacle, 2000); // Новое препятствие каждые 2 секунды
}

// Движение препятствий
function moveObstacles() {
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => {
        const obstacleTop = obstacle.offsetTop;
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
            returnToMenu();
        }
    });
}

// Обновление очков
function updateScore() {
    currentScore += 1;
    currentScoreDisplay.textContent = currentScore;
}
