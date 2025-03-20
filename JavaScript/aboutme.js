// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Canvas setup - NEW DIMENSIONS: 1200x800 pixels (even wider)
    const canvas = document.getElementById('breakoutCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById('resetButton');
    const skipButton = document.getElementById('skipButton');
    
    // Game variables
    let gameStarted = false;
    let gameOver = false;
    let score = 0;
    
    // Load background image (this will be revealed as blocks are broken)
    const backgroundImage = new Image();
    backgroundImage.src = '../Images/test.png'; // Replace with your actual image path
    
    // Make sure the image is loaded before starting
    backgroundImage.onload = function() {
      drawInitialState();
    };
    
    // Ball properties - SLOWER BALL
    const ball = {
      x: canvas.width / 2,
      y: canvas.height - 50,
      radius: 12,
      dx: 2.5, // Reduced speed (was 4)
      dy: -2.5, // Reduced speed (was -4)
      color: '#ff3366'
    };
    
    // Paddle properties - BIGGER PADDLE
    const paddle = {
      width: 250, // Increased width for wider canvas
      height: 20, // Slightly taller
      x: (canvas.width - 250) / 2,
      color: '#66ff66'
    };
    
    // Calculate how many rows would fill about 4/5 of the canvas height
    const canvasHeight = canvas.height;
    const playableHeight = canvasHeight * 0.8; // 4/5 of the canvas height
    
    // Brick properties - LARGER BRICKS WITH FEWER COLUMNS AND ROWS
    const brickHeight = 30; // Increased from 14 to 30
    const brickWidth = 140; // Increased from 90 to 140
    const brickPadding = 8; // Increased from 4 to 8
    const brickOffsetTop = 40; // Same as before
    const brickOffsetLeft = 30; // Slightly increased from 25
    
    // Calculate how many columns will fit across the canvas width
    const brickColumnCount = Math.floor((canvas.width - 2 * brickOffsetLeft) / (brickWidth + brickPadding));
    
    // Calculate how many rows will fit in the playable height
    const rowHeight = brickHeight + brickPadding;
    const brickRowCount = Math.floor((playableHeight - brickOffsetTop) / rowHeight);
    
    // Create bricks array
    const bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { 
          x: 0, 
          y: 0, 
          status: 1,
          color: getRandomColor()
        };
      }
    }
    
    // Get random color for bricks
    function getRandomColor() {
      const colors = ['#ff3366', '#33ccff', '#ffcc00', '#66ff66', '#cc66ff', '#ff9933'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Event listeners for paddle movement
    let rightPressed = false;
    let leftPressed = false;
    
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    document.addEventListener('mousemove', mouseMoveHandler);
    
    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetGame);
    skipButton.addEventListener('click', skipGame);
    
    function keyDownHandler(e) {
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
      }
    }
    
    function keyUpHandler(e) {
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
      }
    }
    
    function mouseMoveHandler(e) {
      if (gameStarted) {
        const relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
          paddle.x = relativeX - paddle.width / 2;
          
          // Keep paddle within canvas boundaries
          if (paddle.x < 0) {
            paddle.x = 0;
          } else if (paddle.x + paddle.width > canvas.width) {
            paddle.x = canvas.width - paddle.width;
          }
        }
      }
    }
    
    // Draw functions
    function drawBall() {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();
      ctx.closePath();
    }
    
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
    
    function drawBricks() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
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
    
    function drawScore() {
      ctx.font = '24px "Comic Sans MS"';
      ctx.fillStyle = '#000';
      ctx.fillText('Score: ' + score, 20, 40);
    }
    
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
      
      // Fade out the win screen after 1 second and show just the image
      if (win) {
        setTimeout(function() {
          showFullImage();
        }, 1000);
      }
    }
    
    function drawInitialState() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the background (fully covered by gray before game starts)
      ctx.fillStyle = '#ccc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw title text
      ctx.font = '36px "Comic Sans MS"';
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.fillText('Break blocks to reveal my info!', canvas.width / 2, canvas.height / 2);
      ctx.font = '24px "Comic Sans MS"';
      ctx.fillText('Click "Start Game" to begin', canvas.width / 2, canvas.height / 2 + 50);
      ctx.textAlign = 'start';
    }
    
    // Collision detection
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
              ball.dy = -ball.dy;
              brick.status = 0;
              score++;
              
              // Check if all bricks are gone
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
    
    // Draw background image with masked regions for bricks
    function drawRevealedImage() {
      // First draw the image
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      
      // Then cover it with rectangles where bricks still exist
      ctx.fillStyle = '#ccc';
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            ctx.fillRect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
          }
        }
      }
    }
    
    // Function to show the full image without any game elements
    function showFullImage() {
      // Clear canvas and draw full image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }
    
    // Main game loop
    function draw() {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the partially revealed image
      drawRevealedImage();
      
      // Draw game elements
      drawBricks();
      drawBall();
      drawPaddle();
      drawScore();
      
      // Collision detection
      collisionDetection();
      
      // Ball movement and collision with walls
      if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
      }
      
      if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
      } else if (ball.y + ball.dy > canvas.height - ball.radius - paddle.height) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
          // Calculate angle based on where ball hits paddle
          let hitPosition = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
          let angle = hitPosition * (Math.PI / 4); // Max 45 degree angle
          
          let speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
          ball.dx = speed * Math.sin(angle);
          ball.dy = -speed * Math.cos(angle);
        } else if (ball.y + ball.dy > canvas.height - ball.radius) {
          // Reset ball position instead of losing a life
          ball.x = canvas.width / 2;
          ball.y = canvas.height - 50;
          ball.dx = (Math.random() > 0.5 ? 1 : -1) * 2.5;
          ball.dy = -2.5;
        }
      }
      
      // Paddle movement
      if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += 9; // Slightly faster paddle movement
      } else if (leftPressed && paddle.x > 0) {
        paddle.x -= 9; // Slightly faster paddle movement
      }
      
      // Move the ball
      ball.x += ball.dx;
      ball.y += ball.dy;
      
      // Check if game is over
      if (gameOver) {
        drawGameOver(true);
        return; // Stop the animation
      }
      
      // Continue the game loop
      if (gameStarted) {
        requestAnimationFrame(draw);
      }
    }
    
    // Start the game
    function startGame() {
      if (!gameStarted && !gameOver) {
        gameStarted = true;
        draw();
      }
    }
    
    // Reset the game
    function resetGame() {
      gameStarted = false;
      gameOver = false;
      score = 0;
      
      // Reset ball position
      ball.x = canvas.width / 2;
      ball.y = canvas.height - 50;
      ball.dx = 2.5;
      ball.dy = -2.5;
      
      // Reset paddle position
      paddle.x = (canvas.width - paddle.width) / 2;
      
      // Reset bricks
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          bricks[c][r].status = 1;
          bricks[c][r].color = getRandomColor();
        }
      }
      
      drawInitialState();
    }
    
    // Skip game and show full image
    function skipGame() {
      // Set gameStarted to false to stop the game loop
      gameStarted = false;
      gameOver = true;
      
      // Show just the image with no overlays
      showFullImage();
    }
    
    // Initial draw
    drawInitialState();
  });