// index.js

// Grab the canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Create a new image and set its source
const planeImage = new Image();
planeImage.src = "Images/plane.png";

let t = 0;
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const x = 300 + 250 * Math.sin(t);
  const y = 300 + 200 * Math.sin(2 * t);

  const angle = Math.atan2(2 * Math.cos(2 * t), Math.cos(t));

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.drawImage(planeImage, -75, -75, 150, 150);
  ctx.restore();

  t += 0.01;
  requestAnimationFrame(animate);
}

// Start animation once the image loads
planeImage.onload = () => {
  animate();
};
