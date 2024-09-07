// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/146-rendering-ray-casting.html
// https://youtu.be/vYgIKn7iDH8

// Rendering Ray Casting

let walls = [];
let ray;
let particle;
let xoff = 0;
let yoff = 10000;

const sceneW = 400;
const sceneH = 400;
let sliderFOV;

let arrowKeys = {
  left: false,
  right: false,
  up: false,
  down: false
};

let mobs = [];
const mobCount = 3;

function setup() {
  createCanvas(800, 400);
  for (let i = 0; i < 4; i++) {
    let x1 = random(sceneW);
    let x2 = random(sceneW);
    let y1 = random(sceneH);
    let y2 = random(sceneH);
    walls[i] = new Boundary(x1, y1, x2, y2);
  }
  walls.push(new Boundary(0, 0, sceneW, 0));
  walls.push(new Boundary(sceneW, 0, sceneW, sceneH));
  walls.push(new Boundary(sceneW, sceneH, 0, sceneH));
  walls.push(new Boundary(0, sceneH, 0, 0));
  particle = new Particle();
  sliderFOV = createSlider(0, 360, 60);
  sliderFOV.position(10, height + 10);
  sliderFOV.input(changeFOV);

  // Create mobs
  for (let i = 0; i < mobCount; i++) {
    mobs.push(new Mob(random(sceneW), random(sceneH)));
  }
}

function changeFOV() {
  const fov = sliderFOV.value();
  particle.updateFOV(fov);
}

function draw() {
  if (keyIsDown(LEFT_ARROW)) {
    particle.rotate(-0.01);
  } else if (keyIsDown(RIGHT_ARROW)) {
    particle.rotate(0.01);
  } else if (keyIsDown(UP_ARROW)) {
    particle.move(1);
  } else if (keyIsDown(DOWN_ARROW)) {
    particle.move(-1);
  }

  background(0);
  for (let wall of walls) {
    wall.show();
  }
  particle.show();

  // Update and show mobs
  for (let mob of mobs) {
    mob.update();
    mob.show();
  }

  // Modify the particle.look() function call to include mobs
  const scene = particle.look(walls, mobs);
  const w = sceneW / scene.length;
  push();
  translate(sceneW, 0);
  for (let i = 0; i < scene.length; i++) {
    noStroke();
    const sq = scene[i].distance * scene[i].distance;
    const wSq = sceneW * sceneW;
    const b = map(sq, 0, wSq, 255, 0);
    const h = map(scene[i].distance, 0, sceneW, sceneH, 0);
    if (scene[i].isMob) {
      fill(255, 0, 0, b); // Red for mobs
    } else {
      fill(b);
    }
    rectMode(CENTER);
    rect(i * w + w / 2, sceneH / 2, w + 1, h);
  }
  pop();

  // ray.show();
  // ray.lookAt(mouseX, mouseY);

  // let pt = ray.cast(wall);
  // if (pt) {
  //   fill(255);
  //   ellipse(pt.x, pt.y, 8, 8);
  // }

  // Draw arrow indicators
  drawArrowIndicators();
}

function drawArrowIndicators() {
  push();
  translate(width - 80, height - 100);
  
  // Up arrow
  fill(arrowKeys.up ? color(255, 0, 0) : color(150));
  rect(-15, -50, 30, 40);
  triangle(-15, -50, 15, -50, 0, -70);

  // Left arrow
  fill(arrowKeys.left ? color(255, 0, 0) : color(150));
  rect(-60, -15, 40, 30);
  triangle(-60, -15, -60, 15, -80, 0);

  // Down arrow
  fill(arrowKeys.down ? color(255, 0, 0) : color(150));
  rect(-15, 10, 30, 40);
  triangle(-15, 50, 15, 50, 0, 70);

  // Right arrow
  fill(arrowKeys.right ? color(255, 0, 0) : color(150));
  rect(20, -15, 40, 30);
  triangle(60, -15, 60, 15, 80, 0);

  pop();
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) arrowKeys.left = true;
  if (keyCode === RIGHT_ARROW) arrowKeys.right = true;
  if (keyCode === UP_ARROW) arrowKeys.up = true;
  if (keyCode === DOWN_ARROW) arrowKeys.down = true;
}

function keyReleased() {
  if (keyCode === LEFT_ARROW) arrowKeys.left = false;
  if (keyCode === RIGHT_ARROW) arrowKeys.right = false;
  if (keyCode === UP_ARROW) arrowKeys.up = false;
  if (keyCode === DOWN_ARROW) arrowKeys.down = false;
}
