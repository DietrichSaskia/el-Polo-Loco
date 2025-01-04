class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  speedX = 0;
  acceleration = 1;
  energy = 300;
  lastHit = 0;
  offset = {top: 0, right: 0, bottom: 0, left: 0};

  /**
   * Plays an animation by cycling through a provided array of image paths.
   *
   * @param {string[]} images - An array of image file paths representing animation frames.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Applies gravity to the object, affecting its vertical position over time.
   *
   * @param {boolean} bottle - Indicates whether the object is a bottle, affecting gravity behavior.
   */
  applyGravity(bottle) {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        if (!bottle) {
          if (this.y >= 168) {
            this.y = 168;
            this.speedY = 0;
            this.onCollisionCourse = true;
          }
        }
      }
    }, 1000 / 25);
  }

  /**
   * Determines if the object is above the ground based on its y-coordinate.
   *
   * @returns {boolean} - `true` if the object is above ground, otherwise `false`.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 168;
    }
  }

  /**
   * Checks if this object is colliding with another movable object.
   *
   * @param {MovableObject} mo - The other movable object to check collision with.
   * @returns {boolean} - `true` if the objects are colliding, otherwise `false`.
   */
  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left && 
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top && 
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right && 
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom 
    );
  }

  /**
   * Handles the object being hit by reducing its energy and updating relevant status bars.
   *
   * Decreases energy by 3 points. If energy drops below zero, sets it to zero.
   * Updates the life status bar to reflect the new energy level.
   */
  hit() {
    this.energy -= 3;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
    this.world.lifeStatusbar.setPercentage(this.energy);
  }

  /**
   * Checks if the object is dead based on its energy level.
   *
   * @returns {boolean} - `true` if energy is zero, otherwise `false`.
   */
  isDead() {
    return this.energy === 0;
  }

  /**
   * Moves the object to the right by increasing its x-coordinate.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left by decreasing its x-coordinate.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Makes the object jump by setting its vertical speed.
   * Increases the y-coordinate to move the object upwards.
   */
  jump() {
    this.speedY = 17;
  }

  /**
   * Handles the death of enemy objects by playing the dead animation
   * and removing them from the level after a short delay.
   */
  enemiesDead() {
    if (this.isDead()) {
      return;
    }
    this.energy = 0;
    this.playAnimation(this.imagesDead);
    this.onCollisionCourse = false;
    setTimeout(() => {
      this.enemiesDelete();
    }, 500);
  }

  /**
   * Removes the enemy from the level's enemies array.
   */
  enemiesDelete() {
    const index = this.level.enemies.indexOf(this);
    if (index > -1) {
      this.level.enemies.splice(index, 1);
    }
  }
}