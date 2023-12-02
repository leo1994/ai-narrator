// Create a canvas element
const canvas = document.getElementById("background");

// Set the canvas size to match the window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Get the 2D rendering context
const ctx = canvas.getContext("2d");

// Define the dot class
class Dot {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
      x: (Math.random() - 0.5) * 0.2, // Random x velocity between -1 and 1
      y: (Math.random() - 0.5) * 0.2, // Random y velocity between -1 and 1
    };
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Check if the dot is close to other dots
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      if (dot === this) continue;

      const distance = Math.sqrt(
        Math.pow(this.x - dot.x, 2) + Math.pow(this.y - dot.y, 2)
      );

      // If the dots are close, draw a white line between them
      if (distance < 70) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(dot.x, dot.y);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 0.04;
        ctx.stroke();
      }
    }

    // Check if the mouse is close to the dot
    const mouseDistance = Math.sqrt(
      Math.pow(this.x - mouseX, 2) + Math.pow(this.y - mouseY, 2)
    );

    // If the mouse is close, draw a white line between the dot and the mouse
    if (mouseDistance < 70) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouseX, mouseY);
      ctx.strokeStyle = "rgba(255, 255, 255, 1)";
      ctx.lineWidth = 0.1;
      ctx.stroke();
    }

    // Keep the dots within the canvas bounds
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.velocity.x *= -1;
    }
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.velocity.y *= -1;
    }

    this.draw();
  }
}

// Create an array to store the dots
const dots = [];

// Create dots and add them to the array
for (let i = 0; i < 500; i++) {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const radius = 2;
  const color = "rgba(255, 255, 255, 0.3)";
  dots.push(new Dot(x, y, radius, color));
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw the dots
  for (let i = 0; i < dots.length; i++) {
    dots[i].update();
  }
}

// Start the animation loop
// Track mouse position
let mouseX = 0;
let mouseY = 0;

// Update mouse position on mousemove event
canvas.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

animate();
