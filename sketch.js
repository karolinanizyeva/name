let font;
let sentence = "this is just a very long sentence and it does not serve any purpose and it does not make any sense, this is literally just a long pointless sentence moving in a circle.";
let textPoints = [];
let textSwirling = true; // Track if text is swirling or has been clicked
let swirlCenter; // Center of swirl
let swirlRadius = 300; // Distance from center to start swirling

function preload() {
  font = loadFont("Trends.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);
  swirlCenter = createVector(width / 2, height / 2);

  // Create positions for each character in the sentence
  let xOffset = -swirlRadius; // Starting x position
  let yOffset = height / 2; // Starting y position
  for (let i = 0; i < sentence.length; i++) {
    let char = sentence[i];
    let angle = map(i, 0, sentence.length, 0, TWO_PI * 4); // Map to a swirl effect
    let distance = map(i, 0, sentence.length, swirlRadius, 0); // Spiral inward

    let targetX = swirlCenter.x + cos(angle) * distance;
    let targetY = swirlCenter.y + sin(angle) * distance;

    textPoints.push(new Interact(char, xOffset + i * 12, yOffset, targetX, targetY));
  }
}

function draw() {
  background(255, 200, 220); // light pink background

  for (let i = 0; i < textPoints.length; i++) {
    let pt = textPoints[i];
    pt.update();
    pt.show();
  }
}

// On mouse click, trigger text disappearance into particles
function mousePressed() {
  textSwirling = false;
  for (let pt of textPoints) {
    pt.explode(); // Trigger particle effect
  }
}

// Interact class handles each text point behavior
class Interact {
  constructor(char, startX, startY, targetX, targetY) {
    this.char = char; // Character to display
    this.start = createVector(startX, startY); // Starting position
    this.pos = createVector(startX, startY); // Current position
    this.target = createVector(targetX, targetY); // Target swirl position
    this.vel = createVector();
    this.acc = createVector();
    this.maxSpeed = 6;
    this.maxForce = 0.2;
    this.exploding = false; // Track if it's exploding
    this.explodeSpeed = p5.Vector.random2D().mult(random(3, 8)); // Random explosion
  }

  // Swirl toward center or explode on click
  update() {
    if (textSwirling) {
      // Move towards the target swirl position
      let desired = p5.Vector.sub(this.target, this.pos);
      let d = desired.mag();
      let speed = this.maxSpeed;
      if (d < 50) speed = map(d, 0, 50, 0, this.maxSpeed); // Slow down near center
      desired.setMag(speed);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce);
      this.applyForce(steer);
    } else if (this.exploding) {
      // Particle explosion
      this.pos.add(this.explodeSpeed);
    }

    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
  }

  // Apply force to the point
  applyForce(force) {
    this.acc.add(force);
  }

  // Trigger the explosion effect
  explode() {
    this.exploding = true;
  }

  // Display the character
  show() {
    noStroke();
    fill(0);
    textSize(16); // Size of each letter
    text(this.char, this.pos.x, this.pos.y); // Draw character at position
  }
}
function windowResized(){
  resizeCanvas (windowWidth,windowHeight)
}

