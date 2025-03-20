// Game variables
let score = 0;
let targetVisible = true;
let gameActive = true;
let gameWonDisplayed = false;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const gameArea = document.getElementById('game-area');
    const target = document.getElementById('target');
    const gun = document.getElementById('gun');
    const scoreDisplay = document.getElementById('score-display');
    const contactOptions = document.querySelectorAll('.contact-option');
    const skipGameButton = document.getElementById('skip-game');
    
    // Initialize game
    function initializeGame() {
        // Position target with initial values
        target.style.left = '100px';
        target.style.top = '50px';
        
        // Update score display
        updateScore(0);
        
        // Add event listeners
        document.addEventListener('mousemove', aimGun);
        document.addEventListener('keydown', handleKeyPress);
        skipGameButton.addEventListener('click', skipGame);
        
        // Start target movement
        setTimeout(moveTarget, 1000);
        setInterval(moveTarget, 2000);
    }

    // Handle key presses (space to shoot)
    function handleKeyPress(event) {
        if (event.code === 'Space' && gameActive) {
            event.preventDefault(); // Prevent page scrolling
            shoot({
                clientX: gun.getBoundingClientRect().left + (gun.offsetWidth / 2),
                clientY: gun.getBoundingClientRect().top - 10
            });
        }
    }

    // Move the target to a random position
    function moveTarget() {
        if (!gameActive) return;
        
        const maxX = gameArea.offsetWidth - target.offsetWidth - 20;
        const maxY = gameArea.offsetHeight - target.offsetHeight - 60;
        
        const randomX = Math.floor(Math.random() * maxX) + 10;
        const randomY = Math.floor(Math.random() * maxY) + 10;
        
        target.style.left = randomX + 'px';
        target.style.top = randomY + 'px';
    }

    // Aim the gun based on mouse position
    function aimGun(event) {
        // Only aim if mouse is inside game area
        const areaRect = gameArea.getBoundingClientRect();
        if (
            event.clientX < areaRect.left || 
            event.clientX > areaRect.right || 
            event.clientY < areaRect.top || 
            event.clientY > areaRect.bottom
        ) {
            return;
        }
        
        // Get horizontal mouse position relative to game area
        const mouseX = event.clientX - areaRect.left;
        
        // Limit gun movement to container width
        let gunX = mouseX - (gun.offsetWidth / 2);
        gunX = Math.max(0, Math.min(gunX, gameArea.offsetWidth - gun.offsetWidth));
        
        gun.style.left = gunX + 'px';
    }

    // Handle shooting
// Handle shooting
function shoot(event) {
    if (!gameActive) return;
    
    // Create bullet
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    
    // Get position of click in the game area
    const areaRect = gameArea.getBoundingClientRect();
    const clickX = event.clientX - areaRect.left;
    const clickY = event.clientY - areaRect.top;
    
    // Position bullet at gun position (center of the gun)
    const gunRect = gun.getBoundingClientRect();
    const gunCenterX = gunRect.left + (gun.offsetWidth / 2) - areaRect.left;
    const gunCenterY = gunRect.top + (gun.offsetHeight / 2) - areaRect.top;
    
    bullet.style.left = gunCenterX + 'px';
    bullet.style.top = gunCenterY + 'px';
    
    gameArea.appendChild(bullet);
    
    // Calculate angle to move bullet towards click point
    const deltaX = clickX - gunCenterX;
    const deltaY = clickY - gunCenterY;
    const angle = Math.atan2(deltaY, deltaX);
    const speed = 10;
    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed;
    
    // Current bullet position
    let bulletX = gunCenterX;
    let bulletY = gunCenterY;
    
    // Animate bullet
    const bulletInterval = setInterval(() => {
        // Update bullet position
        bulletX += velocityX;
        bulletY += velocityY;
        bullet.style.left = bulletX + 'px';
        bullet.style.top = bulletY + 'px';
        
        // Check if bullet hit target
        const bulletRect = bullet.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        
        if (
            bulletRect.left < targetRect.right &&
            bulletRect.right > targetRect.left &&
            bulletRect.top < targetRect.bottom &&
            bulletRect.bottom > targetRect.top
        ) {
            // Hit!
            clearInterval(bulletInterval);
            target.classList.add('hit');
            setTimeout(() => target.classList.remove('hit'), 500);
            
            // Add points
            updateScore(5);
            
            // Highlight contact options based on score
            updateContactOptions();
            
            // Move target
            setTimeout(moveTarget, 500);
            
            // Remove bullet
            bullet.remove();
        }
        
        // Remove bullet if it goes off screen
        if (
            bulletX < 0 || 
            bulletX > gameArea.offsetWidth || 
            bulletY < 0 || 
            bulletY > gameArea.offsetHeight
        ) {
            clearInterval(bulletInterval);
            bullet.remove();
        }
    }, 20);
}

    // Update score
    function updateScore(points) {
        score += points;
        scoreDisplay.textContent = 'Score: ' + score;
        
        // Check for game completion
        if (score >= 100) {
            gameWon();
        }
    }

    // Update contact options based on score
    function updateContactOptions() {
        contactOptions.forEach(option => {
            const points = parseInt(option.getAttribute('data-points'), 10);
            if (score >= points && !option.classList.contains('activated')) {
                // Activate this option
                option.classList.add('activated');
                
                // Create a floating 'Unlocked!' animation
                const pointsPopup = document.createElement('div');
                pointsPopup.textContent = 'Unlocked!';
                pointsPopup.style.position = 'absolute';
                pointsPopup.style.top = '50%';
                pointsPopup.style.left = '50%';
                pointsPopup.style.transform = 'translate(-50%, -50%)';
                pointsPopup.style.color = '#ff0000';
                pointsPopup.style.fontWeight = 'bold';
                pointsPopup.style.zIndex = '10';
                pointsPopup.style.fontSize = '1.2em';
                pointsPopup.style.textShadow = '1px 1px 2px #fff';
                
                option.appendChild(pointsPopup);
                
                // Animate and remove
                setTimeout(() => {
                    pointsPopup.style.transition = 'all 1s ease-out';
                    pointsPopup.style.top = '0%';
                    pointsPopup.style.opacity = '0';
                    setTimeout(() => pointsPopup.remove(), 1000);
                }, 10);
            }
        });
    }

    // Game won
    function gameWon() {
      if (gameWonDisplayed) return;

      gameWonDisplayed = true;

      unlockAllContacts();
        
        // Display winning message
        const winMessage = document.createElement('div');
        winMessage.className = 'win-message';
        winMessage.textContent = 'All contact methods unlocked!';
        
        gameArea.appendChild(winMessage);
        
        // Fade out after 3 seconds
        setTimeout(() => {
            winMessage.classList.add('fade-out');
            setTimeout(() => {
                winMessage.remove();
            }, 1000);
        }, 3000);
    }
    
    // Skip game and unlock all contacts
    function skipGame() {
        unlockAllContacts();

        skipGameButton.style.display = 'none';

        // Display skipped message
        const skipMessage = document.createElement('div');
        skipMessage.className = 'win-message';
        skipMessage.textContent = 'Game skipped! All contact methods unlocked!';
        
        gameArea.appendChild(skipMessage);
        
        // Fade out after 3 seconds
        setTimeout(() => {
            skipMessage.classList.add('fade-out');
            setTimeout(() => {
                skipMessage.remove();
            }, 1000);
        }, 3000);
    }
    
    // Unlock all contact options
    function unlockAllContacts() {
        contactOptions.forEach(option => {
            option.classList.add('activated');
            option.classList.add('pulse');
        });
    }

    // Initialize the game
    initializeGame();
});