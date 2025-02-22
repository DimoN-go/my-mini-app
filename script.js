let currentScore = 0;
let totalScore = 0;
let gameSpeed = 2;
let gameInterval;

const mainMenu = document.getElementById('main-menu');
const gameContainer = document.getElementById('game-container');
const startButton = document.getElementById('start-button');
const menuButton = document.getElementById('menu-button');
const currentScoreDisplay = document.getElementById('current-score');
const totalScoreDisplay = document.getElementById('total-score');
const runner = document.getElementById('runner');
const obstacle = document.getElementById('obstacle');

startButton.addEventListener('click', startGame);
menuButton.addEventListener('click', returnToMenu);

function startGame() {
    mainMenu.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    currentScore = 0;
    gameSpeed = 2;
    updateScore();
    gameInterval = setInterval(updateGame, 20);
}

function returnToMenu() {
    clearInterval(gameInterval);
    gameContainer.classList.add('hidden');
    mainMenu.classList.remove('hidden');
    totalScore += currentScore;
    totalScoreDisplay.textContent = totalScore;
}

function updateGame() {
    moveObstacle();
    checkCollision();
    updateScore();
}

function moveObstacle() {
    let obstaclePosition = obstacle.offsetLeft;
    if (obstaclePosition < -40) {
        obstaclePosition = 600;
        gameSpeed += 0.1;
    }
    obstacle.style.left = obstaclePosition - gameSpeed + 'px';
}

function checkCollision() {
    const runnerBottom = parseInt(window.getComputedStyle(runner).getPropertyValue('bottom'));
    const obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));

    if (obstacleLeft < 90 && obstacleLeft > 50 && runnerBottom < 40) {
        returnToMenu();
    }
}

function updateScore() {
    currentScore += 1;
    currentScoreDisplay.textContent = currentScore;
}
