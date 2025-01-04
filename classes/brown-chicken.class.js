class BrownChicken extends MovableObject {
  offset = {top: -5, right: 10, bottom: 0, left: 10};
  x = 200;
  y = 340;
  height = 80;
  width = 80;
  onCollisionCourse = true;
  deadPlayed = false;
  speed;
  chickenSound = 'audio/chicken.wav';

  imagesWalking = [
    'assets/imgs/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'assets/imgs/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'assets/imgs/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
  ];

  imagesDead = [
    'assets/imgs/3_enemies_chicken/chicken_normal/2_dead/dead.png'
  ];
  
  constructor(x) {
    super().loadImage('assets/imgs/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
    this.loadImageCache(this.imagesWalking);
    this.loadImageCache(this.imagesDead);
    this.x = x;
    this.speed = 0.15 + Math.random() * 0.25;
    this.animate();
    this.onCollisionCourse = true;
    this.deadPlayed = false;
  }

  /**
   * Checks if the brown chicken is dead.
   *
   * If the chicken's energy reaches zero and the death sound hasn't been played yet,
   * it plays the death sound, marks the death sound as played, and returns true.
   * Otherwise, returns false.
   *
   * @returns {boolean} - Whether the brown chicken is dead.
   */
  isDead() {
    if (this.energy === 0 && !this.deadPlayed) {
      world.soundManager.playSound('audio/chicken.wav');
      this.deadPlayed = true;
      return true;
    }
    return false;
  }

  /**
   * Initiates the animation loops for movement and walking animation.
   *
   * Uses setStoppableInterval to repeatedly call isMoving and chickenAnimate
   * at specified intervals to handle movement and animation frames.
   */
  animate() {
    this.setStoppableInterval(() => this.isMoving(), 1000 / 60);
    this.setStoppableInterval(() => this.chickenAnimate(), 250);
  }

  /**
   * Handles the movement of the brown chicken.
   *
   * If the chicken is not dead, it moves leftward by calling moveLeft().
   */
  isMoving() {
    if (!this.isDead()) {
      this.moveLeft();
    }
  }

  /**
   * Handles the walking animation of the brown chicken.
   *
   * If the chicken is not dead, it cycles through the walking animation frames.
   */
  chickenAnimate() {
    if (!this.isDead()) {
      this.playAnimation(this.imagesWalking);
    }
  }
}