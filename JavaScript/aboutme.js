// Wait for the DOM to be fully loaded before running the game code
document.addEventListener('DOMContentLoaded', function() {
  // Get the canvas element and its drawing context
  const canvas = document.getElementById('breakoutCanvas');
  const ctx = canvas.getContext('2d');

  // Get control buttons by their IDs
  const startButton = document.getElementById('startButton');
  const resetButton = document.getElementById('resetButton');
  const skipButton = document.getElementById('skipButton');

  // Game state variables
  let gameStarted = false;
  let gameOver = false;
  let score = 0;

  // Load the background image that will be revealed as bricks are broken
  const backgroundImage = new Image();
  backgroundImage.src = '../Images/test.png'; // Update to actual image path if needed

  // When the image is loaded, draw the initial state on the canvas
  backgroundImage.onload = function() {
    drawInitialState();
  };

  // Define ball properties (position, movement, and appearance)
  const ball = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    radius: 12,
    dx: 2.5, // Horizontal speed (slower than previous version)
    dy: -2.5, // Vertical speed
    color: '#ff3366'
  };

  // Define paddle properties (size, position, and color)
  const paddle = {
    width: 250, // Wider paddle
    height: 20, // Slightly taller paddle
    x: (canvas.width - 250) / 2,
    color: '#66ff66'
  };

  // Calculate playable area height (using 80% of canvas height)
  const canvasHeight = canvas.height;
  const playableHeight = canvasHeight * 0.8;

  // Brick properties: size, padding, offsets
  const brickHeight = 30;
  const brickWidth = 140;
  const brickPadding = 8;
  const brickOffsetTop = 40;
  const brickOffsetLeft = 30;

  // Calculate the number of brick columns that fit in the canvas
  const brickColumnCount = Math.floor((canvas.width - 2 * brickOffsetLeft) / (brickWidth + brickPadding));
  // Calculate number of brick rows that fit in the playable height
  const rowHeight = brickHeight + brickPadding;
  const brickRowCount = Math.floor((playableHeight - brickOffsetTop) / rowHeight);

  // Create a 2D array to store brick objects
  const bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { 
        x: 0, // Will be calculated when drawing
        y: 0,
        status: 1, // 1 means brick is intact; 0 means broken
        color: getRandomColor() // Random color for visual variety
      };
    }
  }

  // Function to randomly select a color for bricks
  function getRandomColor() {
    const colors = ['#ff3366', '#33ccff', '#ffcc00', '#66ff66', '#cc66ff', '#ff9933'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Event listeners for paddle movement using keyboard keys
  let rightPressed = false;
  let leftPressed = false;
  document.addEventListener('keydown', keyDownHandler);
  document.addEventListener('keyup', keyUpHandler);

  // Event listeners for control buttons
  startButton.addEventListener('click', startGame);
  resetButton.addEventListener('click', resetGame);
  skipButton.addEventListener('click', skipGame);

  // Handle keydown events for arrow keys and WASD
  function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      leftPressed = true;
    }
  }

  // Handle keyup events to stop paddle movement
  function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      leftPressed = false;
    }
  }

  // Function to draw the ball on the canvas
  function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
  }

  // Function to draw the paddle on the canvas
  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    ctx.fillStyle = paddle.color;
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  }

  // Function to loop through and draw all bricks
  function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) { // Only draw if brick is not broken
          const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = bricks[c][r].color;
          ctx.fill();
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
  }

  // Function to draw the current score on the canvas
  function drawScore() {
    ctx.font = '24px "Comic Sans MS"';
    ctx.fillStyle = '#000';
    ctx.fillText('Score: ' + score, 20, 40);
  }

  // Function to display a game over or win message
  function drawGameOver(win) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = '48px "Comic Sans MS"';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    
    if (win) {
      ctx.fillText('YOU WIN!', canvas.width / 2, canvas.height / 2);
    } else {
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    }
    
    ctx.font = '28px "Comic Sans MS"';
    ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 60);
    ctx.textAlign = 'start';
    
    // If win, show the full background image after a short delay
    if (win) {
      setTimeout(function() {
        showFullImage();
      }, 1000);
    }
  }

  // Function to draw the initial canvas state before the game starts
  function drawInitialState() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw a gray background
    ctx.fillStyle = '#ccc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Display introductory text
    ctx.font = '36px "Comic Sans MS"';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText('Break blocks to reveal my info!', canvas.width / 2, canvas.height / 2);
    ctx.font = '24px "Comic Sans MS"';
    ctx.fillText('Click "Start Game" to begin', canvas.width / 2, canvas.height / 2 + 50);
    ctx.textAlign = 'start';
  }

  // Collision detection between the ball and bricks
  function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const brick = bricks[c][r];
        
        if (brick.status === 1) {
          if (
            ball.x > brick.x &&
            ball.x < brick.x + brickWidth &&
            ball.y > brick.y &&
            ball.y < brick.y + brickHeight
          ) {
            // Reverse ball vertical direction on collision
            ball.dy = -ball.dy;
            brick.status = 0; // Mark brick as broken
            score++;
            
            // Check if all bricks have been broken
            let allBroken = true;
            for (let i = 0; i < brickColumnCount; i++) {
              for (let j = 0; j < brickRowCount; j++) {
                if (bricks[i][j].status === 1) {
                  allBroken = false;
                  break;
                }
              }
              if (!allBroken) break;
            }
            
            if (allBroken) {
              gameOver = true;
            }
          }
        }
      }
    }
  }

  // Draw the background image with “masked” bricks
  function drawRevealedImage() {
    // Draw the background image
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    
    // Cover the areas where bricks are still intact with gray rectangles
    ctx.fillStyle = '#ccc';
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          ctx.fillRect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
        }
      }
    }
  }

  // Function to display the full background image (when game is skipped or won)
  function showFullImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  }

  // Main game loop that updates and draws the game elements
  function draw() {
    // Clear the canvas for new frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the background image with covered bricks
    drawRevealedImage();
    
    // Draw bricks, ball, paddle, and score on top
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    
    // Check for collisions between the ball and bricks
    collisionDetection();
    
    // Bounce the ball off the left and right walls
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
      ball.dx = -ball.dx;
    }
    
    // Bounce the ball off the top wall
    if (ball.y + ball.dy < ball.radius) {
      ball.dy = -ball.dy;
    } 
    // Check for collision with paddle or bottom of canvas
    else if (ball.y + ball.dy > canvas.height - ball.radius - paddle.height) {
      if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        // Calculate hit angle based on where the ball hits the paddle
        let hitPosition = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
        let angle = hitPosition * (Math.PI / 4); // Maximum 45° angle
        
        let speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        ball.dx = speed * Math.sin(angle);
        ball.dy = -speed * Math.cos(angle);
      } else if (ball.y + ball.dy > canvas.height - ball.radius) {
        // Reset ball if missed by the paddle
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 50;
        ball.dx = (Math.random() > 0.5 ? 1 : -1) * 2.5;
        ball.dy = -2.5;
      }
    }
    
    // Move paddle based on user input
    if (rightPressed && paddle.x < canvas.width - paddle.width) {
      paddle.x += 9;
    } else if (leftPressed && paddle.x > 0) {
      paddle.x -= 9;
    }
    
    // Update ball position for the next frame
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // If the game is over (all bricks broken), display win message and stop animation
    if (gameOver) {
      drawGameOver(true);
      return;
    }
    
    // Continue the game loop if game has started
    if (gameStarted) {
      requestAnimationFrame(draw);
    }
  }

  // Start the game if not already started and not over
  function startGame() {
    if (!gameStarted && !gameOver) {
      gameStarted = true;
      draw();
    }
  }

  // Reset the game state to initial conditions
  function resetGame() {
    gameStarted = false;
    gameOver = false;
    score = 0;
    
    // Reset ball position and speed
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 50;
    ball.dx = 2.5;
    ball.dy = -2.5;
    
    // Reset paddle to center
    paddle.x = (canvas.width - paddle.width) / 2;
    
    // Reset all bricks to intact with new random colors
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r].status = 1;
        bricks[c][r].color = getRandomColor();
      }
    }
    
    drawInitialState();
  }

  // Skip the game and immediately show the full background image
  function skipGame() {
    gameStarted = false;
    gameOver = true;
    showFullImage();
  }

  // Initial draw to display the starting state
  drawInitialState();
});
