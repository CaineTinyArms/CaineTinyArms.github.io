// shootingGame.js

window.addEventListener("load", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
  
    let targetX = 0;
    let targetY = 0;
    let targetRadius = 20;
  
    // Score starts at 0
    let score = 0;
    const scoreDisplay = document.getElementById("scoreDisplay");
  
    // Randomly place the target
    function placeTarget() {
      targetX = Math.random() * (canvas.width  - 2 * targetRadius) + targetRadius;
      targetY = Math.random() * (canvas.height - 2 * targetRadius) + targetRadius;
    }
  
    // Draw the target on the canvas
    function drawTarget() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Outer circle
      ctx.beginPath();
      ctx.arc(targetX, targetY, targetRadius, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
  
      // Inner circle
      ctx.beginPath();
      ctx.arc(targetX, targetY, targetRadius / 2, 0, 2 * Math.PI);
      ctx.fillStyle = "white";
      ctx.fill();
    }
  
    // Listen for clicks on the entire document
    document.addEventListener("click", (e) => {
      // Convert click to canvas coords
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
  
      // Check distance from target center
      const dist = Math.sqrt((clickX - targetX)**2 + (clickY - targetY)**2);
      if (dist <= targetRadius) {
        // If the user clicked the target, increment score, move the target
        e.preventDefault();    // stop link from activating
        e.stopPropagation();   // don't bubble further
  
        score++;
        scoreDisplay.textContent = "Score: " + score;
  
        placeTarget();
        drawTarget();
      }
      // else, click passes through to any underlying link or element
    });
  
    // Initialize
    placeTarget();
    drawTarget();
  });
  