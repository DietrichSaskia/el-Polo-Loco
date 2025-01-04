class YellowChicken extends MovableObject {
  offset = { top: -15, right: 10, bottom: 0, left: 10 };
  x = 200;
  y = 355;
  height = 60;
  width = 60;
  speedY = 0;
  gravity = 0.5;
  groundY = 355;
  chickenSound = "audio/chicken.wav";
  deadPlayed = false;

  imagesWalking = [
    "assets/imgs/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "assets/imgs/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "assets/imgs/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  imagesDead = ["assets/imgs/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  constructor(x) {
    super().loadImage('assets/imgs/3_enemies_chicken/chicken_small/1_walk/1_w.png');
    this.loadImageCache(this.imagesWalking);
    this.loadImageCache(this.imagesDead);
    this.x = x;
    this.speed = 0.15 + Math.random() * 0.25;
    this.animate();
    this.onCollisionCourse = true;
  }

  /**
   * Determines if the yellow chicken is dead.
   * If dead and the death sound hasn't been played, plays the sound and marks it as played.
   *
   * @returns {boolean} `true` if the chicken is dead, otherwise `false`.
   */
  isDead() {
    if (this.energy === 0 && !this.deadPlayed) {
      world.soundManager.playSound(this.chickenSound);
      this.deadPlayed = true;
      return true;
    }
    return false;
  }

  /**
   * Initiates the animation and behavior loops for the yellow chicken.
   * Sets up intervals for movement, animation, jumping, and applying gravity.
   */
  animate() {
    this.setStoppableInterval(() => this.isMoving(), 1000 / 60);
    this.setStoppableInterval(() => this.chickenAnimate(), 250);
    this.setStoppableInterval(() => this.chickenJump(), 2000);
    this.setStoppableInterval(() => this.applyGravity(), 1000 / 60);
  }

  /**
   * Moves the yellow chicken to the left if it is not dead.
   * This simulates the chicken walking towards the character.
   *
   * @returns {void}
   */
  isMoving() {
    if (!this.isDead()) {
      this.moveLeft();
    }
  }

  /**
   * Plays the walking animation frames for the yellow chicken if it is not dead.
   *
   * @returns {void}
   */
  chickenAnimate() {
    if (!this.isDead()) {
      this.playAnimation(this.imagesWalking);
    }
  }

  /**
   * Makes the yellow chicken jump by setting its vertical speed.
   * This method is called periodically to simulate jumping behavior.
   *
   * @returns {void}
   */
  chickenJump() {
    if (this.isOnGround()) {
      this.speedY = -10;
    }
  }

  /**
   * Applies gravity to the yellow chicken, affecting its vertical position and speed.
   * Ensures the chicken falls back to the ground after a jump.
   *
   * @returns {void}
   */
  applyGravity() {
    this.y += this.speedY;
    this.speedY += this.gravity;
    if (this.y >= this.groundY) {
      this.y = this.groundY;
      this.speedY = 0;
    }
  }

  /**
   * Checks if the yellow chicken is currently on the ground.
   *
   * @returns {boolean} `true` if the chicken is on the ground, otherwise `false`.
   */
  isOnGround() {
    return this.y >= this.groundY;
  }
}