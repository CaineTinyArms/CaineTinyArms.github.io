// shootingGame.js - Implements the shooting mini-game for unlocking contact options

// Global game state variables
let score = 0;
let targetVisible = true;         // Flag if target is currently visible (unused here, but kept for potential future use)
let gameActive = true;            // Flag to control if game is running
let gameWonDisplayed = false;     // To prevent multiple win messages
let targetMoveTimer;              // Timer for moving the target periodically
let targetHitCooldown = false;    // Cooldown flag to prevent multiple hits in rapid succession

// Wait for the DOM to fully load before initializing game elements
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements used in the game
    const gameArea = document.getElementById('game-area');
    const target = document.getElementById('target');
    const gun = document.getElementById('gun');
    const scoreDisplay = document.getElementById('score-display');
    const contactOptions = document.querySelectorAll('.contact-option');
    const skipGameButton = document.getElementById('skip-game');
    
    // Initialize game: position target, update score, and set event listeners
    function initializeGame() {
        // Set initial position for the target
        target.style.left = '100px';
        target.style.top = '50px';
        
        // Initialize score display
        updateScore(0);
        
        // Set up event listeners for mouse movement (aiming) and key presses (shooting)
        document.addEventListener('mousemove', aimGun);
        document.addEventListener('keydown', handleKeyPress);
        skipGameButton.addEventListener('click', skipGame);
        
        // Set the target’s initial position and start the movement timer
        moveTarget();
        resetTargetMoveTimer();
    }

    // Resets the timer for moving the target
    function resetTargetMoveTimer() {
        clearTimeout(targetMoveTimer);
        targetMoveTimer = setTimeout(moveTarget, 3000);
    }

    // Listen for key press events; spacebar triggers shooting
    function handleKeyPress(event) {
        if (event.code === 'Space' && gameActive) {
            event.preventDefault(); // Prevent default scrolling behavior
            // Call shoot() with simulated coordinates from the center of the gun
            shoot({
                clientX: gun.getBoundingClientRect().left + (gun.offsetWidth / 2),
                clientY: gun.getBoundingClientRect().top - 10
            });
        }
    }

    // Move the target to a random position within the game area boundaries
    function moveTarget() {
        if (!gameActive) return;
        
        const maxX = gameArea.offsetWidth - target.offsetWidth - 20;
        const maxY = gameArea.offsetHeight - target.offsetHeight - 60;
        
        const randomX = Math.floor(Math.random() * maxX) + 10;
        const randomY = Math.floor(Math.random() * maxY) + 10;
        
        target.style.left = randomX + 'px';
        target.style.top = randomY + 'px';
    }

    // Aim the gun based on the current mouse position within the game area
    function aimGun(event) {
        const areaRect = gameArea.getBoundingClientRect();
        // Check if mouse is within the game area
        if (
            event.clientX < areaRect.left || 
            event.clientX > areaRect.right || 
            event.clientY < areaRect.top || 
            event.clientY > areaRect.bottom
        ) {
            return;
        }
        
        const mouseX = event.clientX - areaRect.left;
        let gunX = mouseX - (gun.offsetWidth / 2);
        // Constrain the gun position to within the game area
        gunX = Math.max(0, Math.min(gunX, gameArea.offsetWidth - gun.offsetWidth));
        
        gun.style.left = gunX + 'px';
    }

    // Shoot function: creates a bullet and animates it towards the target
    function shoot(event) {
        if (!gameActive) return;
        
        // Create bullet element
        const bullet = document.createElement('div');
        bullet.className = 'bullet';
        
        const areaRect = gameArea.getBoundingClientRect();
        const clickX = event.clientX - areaRect.left;
        const clickY = event.clientY - areaRect.top;
        
        // Calculate gun center position relative to game area
        const gunRect = gun.getBoundingClientRect();
        const gunCenterX = gunRect.left + (gun.offsetWidth / 2) - areaRect.left;
        const gunCenterY = gunRect.top + (gun.offsetHeight / 2) - areaRect.top;
        
        bullet.style.left = gunCenterX + 'px';
        bullet.style.top = gunCenterY + 'px';
        
        gameArea.appendChild(bullet);
        
        // Calculate direction and velocity for bullet movement
        const deltaX = clickX - gunCenterX;
        const deltaY = clickY - gunCenterY;
        const angle = Math.atan2(deltaY, deltaX);
        const speed = 10;
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;
        
        let bulletX = gunCenterX;
        let bulletY = gunCenterY;
        
        // Animate bullet movement at regular intervals
        const bulletInterval = setInterval(() => {
            bulletX += velocityX;
            bulletY += velocityY;
            bullet.style.left = bulletX + 'px';
            bullet.style.top = bulletY + 'px';
            
            // Get bounding rectangles for collision detection
            const bulletRect = bullet.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            
            // If bullet intersects target and not in cooldown state
            if (
                !targetHitCooldown &&
                bulletRect.left < targetRect.right &&
                bulletRect.right > targetRect.left &&
                bulletRect.top < targetRect.bottom &&
                bulletRect.bottom > targetRect.top
            ) {
                targetHitCooldown = true; // Set cooldown
                
                clearInterval(bulletInterval); // Stop bullet animation
                target.classList.add('hit');   // Add hit animation class
                setTimeout(() => target.classList.remove('hit'), 500);
                
                updateScore(5);  // Increase score by 5 points
                updateContactOptions(); // Check if new contact options should be unlocked
                
                // After a short delay, move the target and reset cooldown and timer
                setTimeout(() => {
                    moveTarget();
                    resetTargetMoveTimer();
                    targetHitCooldown = false;
                }, 500);
                
                bullet.remove(); // Remove bullet element from the DOM
            }
            
            // Remove bullet if it goes outside the game area boundaries
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

    // Update the score and display it on screen; check for win condition
    function updateScore(points) {
        score += points;
        scoreDisplay.textContent = 'Score: ' + score;
        
        if (score >= 100) {
            gameWon();
        }
    }

    // Unlock contact options based on score thresholds
    function updateContactOptions() {
        contactOptions.forEach(option => {
            const points = parseInt(option.getAttribute('data-points'), 10);
            if (score >= points && !option.classList.contains('activated')) {
                option.classList.add('activated');
                
                // Create a temporary popup indicating the option is unlocked
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
                
                // Animate and remove the popup
                setTimeout(() => {
                    pointsPopup.style.transition = 'all 1s ease-out';
                    pointsPopup.style.top = '0%';
                    pointsPopup.style.opacity = '0';
                    setTimeout(() => pointsPopup.remove(), 1000);
                }, 10);
            }
        });
    }

    // When the game is won, unlock all contacts and display a win message
    function gameWon() {
      if (gameWonDisplayed) return;

      gameWonDisplayed = true;
      unlockAllContacts();
        
      const winMessage = document.createElement('div');
      winMessage.className = 'win-message';
      winMessage.textContent = 'All contact methods unlocked!';
      gameArea.appendChild(winMessage);
        
      // Fade out the win message after a delay
      setTimeout(() => {
          winMessage.classList.add('fade-out');
          setTimeout(() => {
              winMessage.remove();
          }, 1000);
      }, 3000);
    }
    
    // Skip game functionality: immediately unlock all contact options
    function skipGame() {
        unlockAllContacts();
        skipGameButton.style.display = 'none';
        const skipMessage = document.createElement('div');
        skipMessage.className = 'win-message';
        skipMessage.textContent = 'Game skipped! All contact methods unlocked!';
        gameArea.appendChild(skipMessage);
        setTimeout(() => {
            skipMessage.classList.add('fade-out');
            setTimeout(() => {
                skipMessage.remove();
            }, 1000);
        }, 3000);
    }
    
    // Unlock all contact options and add a pulse effect
    function unlockAllContacts() {
        contactOptions.forEach(option => {
            option.classList.add('activated');
            option.classList.add('pulse');
        });
    }

    // Start game initialization
    initializeGame();
});
