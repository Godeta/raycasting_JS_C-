// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/146-rendering-ray-casting.html
// https://youtu.be/vYgIKn7iDH8

// Rendering Ray Casting

class Particle {
  constructor() {
    this.fov = 45;
    this.pos = createVector(sceneW / 2, sceneH / 2);
    this.rays = [];
    this.heading = 0;
    for (let a = -this.fov / 2; a < this.fov / 2; a += 1) {
      this.rays.push(new Ray(this.pos, radians(a)));
    }
  }

  updateFOV(fov) {
    this.fov = fov;
    this.rays = [];
    for (let a = -this.fov / 2; a < this.fov / 2; a += 1) {
      this.rays.push(new Ray(this.pos, radians(a) + this.heading));
    }
  }

  rotate(angle) {
    this.heading += angle;
    let index = 0;
    for (let a = -this.fov / 2; a < this.fov / 2; a += 1) {
      this.rays[index].setAngle(radians(a) + this.heading);
      index++;
    }
  }

  move(amt) {
    const vel = p5.Vector.fromAngle(this.heading);
    vel.setMag(amt);
    this.pos.add(vel);
  }

  update(x, y) {
    this.pos.set(x, y);
  }

  look(walls, mobs) {
    const scene = [];
    for (let i = 0; i < this.rays.length; i++) {
      const ray = this.rays[i];
      let closest = null;
      let record = Infinity;
      for (let wall of walls) {
        const pt = ray.cast(wall);
        if (pt) {
          let d = p5.Vector.dist(this.pos, pt);
          const a = ray.dir.heading() - this.heading;
          d *= cos(a);
          if (d < record) {
            record = d;
            closest = pt;
          }
        }
      }
      // Check for mobs
      for (let mob of mobs) {
        const pt = ray.cast({a: createVector(mob.pos.x - mob.size/2, mob.pos.y - mob.size/2), 
                             b: createVector(mob.pos.x + mob.size/2, mob.pos.y - mob.size/2)});
        if (pt) {
          let d = p5.Vector.dist(this.pos, pt);
          const a = ray.dir.heading() - this.heading;
          d *= cos(a);
          if (d < record) {
            record = d;
            closest = pt;
            // Mark this as a mob hit
            scene[i] = {distance: record, isMob: true};
          }
        }
      }
      if (closest) {
        stroke(255, 100);
        line(this.pos.x, this.pos.y, closest.x, closest.y);
      }
      if (!scene[i]) {
        scene[i] = {distance: record, isMob: false};
      }
    }
    return scene;
  }

  show() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, 4);
    for (let ray of this.rays) {
      ray.show();
    }
  }
}
