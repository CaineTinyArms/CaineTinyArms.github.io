// index.JS - Animates a plane image on the canvas

// Get the canvas element and its 2D drawing context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Create a new Image object for the plane graphic
const planeImage = new Image();
planeImage.src = "Images/plane.png";

// Time variable for animation calculations
let t = 0;

// Animation loop function
function animate() {
  // Clear the entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate x and y positions using sine functions for smooth oscillation
  const x = 300 + 250 * Math.sin(t);
  const y = 300 + 200 * Math.sin(2 * t);

  // Calculate the rotation angle based on derivative of sine functions
  const angle = Math.atan2(2 * Math.cos(2 * t), Math.cos(t));

  // Save the context state, apply translation and rotation, then draw the image
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  // Draw the plane image centered at (x, y)
  ctx.drawImage(planeImage, -75, -75, 150, 150);
  ctx.restore();

  // Increment time variable for next frame
  t += 0.01;
  // Request next animation frame
  requestAnimationFrame(animate);
}

// Start the animation when the plane image has fully loaded
planeImage.onload = () => {
  animate();
};
