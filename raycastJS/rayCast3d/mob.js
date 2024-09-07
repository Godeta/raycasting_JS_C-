class Mob {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(0.5);
    this.size = 20;
  }

  update() {
    // Random movement
    if (random(1) < 0.05) {
      this.vel = p5.Vector.random2D().mult(0.5);
    }
    this.pos.add(this.vel);

    // Bounce off walls
    if (this.pos.x < 0 || this.pos.x > sceneW) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > sceneH) this.vel.y *= -1;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    // Body
    fill(150, 0, 0);
    rect(-this.size/2, -this.size/2, this.size, this.size);
    // Eyes
    fill(255);
    rect(-this.size/4, -this.size/4, this.size/4, this.size/4);
    rect(0, -this.size/4, this.size/4, this.size/4);
    // Mouth
    fill(0);
    rect(-this.size/3, this.size/4, this.size*2/3, this.size/4);
    pop();
  }
}
