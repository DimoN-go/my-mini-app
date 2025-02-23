document.getElementById('celebrateBtn').addEventListener('click', function () {
    const mainText = document.getElementById('mainText');
    const hiddenText = document.getElementById('hiddenText');
    const button = document.getElementById('celebrateBtn');

    // Анимация исчезновения кнопки и текста
    gsap.to(button, { duration: 0.5, opacity: 0, y: -50, ease: "power2.out" });
    gsap.to(mainText, { duration: 0.5, opacity: 0, y: -50, ease: "power2.out" });

    // Анимация взрыва
    const explosion = document.createElement('div');
    explosion.className = 'explode';
    explosion.style.position = 'absolute';
    explosion.style.width = '20px';
    explosion.style.height = '20px';
    explosion.style.backgroundColor = '#e74c3c';
    explosion.style.borderRadius = '50%';
    explosion.style.top = '50%';
    explosion.style.left = '50%';
    explosion.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(explosion);

    setTimeout(() => {
        explosion.remove();
    }, 1000);

    // Появление праздничного текста
    setTimeout(() => {
        hiddenText.classList.remove('hidden');
        gsap.from(hiddenText, {
            duration: 1,
            opacity: 0,
            y: 50,
            scale: 0.5,
            ease: "elastic.out(1, 0.3)",
        });

        // Добавляем конфетти
        createConfetti();
    }, 1000);
});

// Функция для создания конфетти
function createConfetti() {
    const colors = ['#e74c3c', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.position = 'absolute';
        confetti.style.top = '0';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.borderRadius = '50%';
        document.body.appendChild(confetti);

        gsap.to(confetti, {
            duration: Math.random() * 3 + 2,
            y: window.innerHeight,
            rotation: Math.random() * 360,
            ease: "power1.out",
            onComplete: () => confetti.remove(),
        });
    }
}
