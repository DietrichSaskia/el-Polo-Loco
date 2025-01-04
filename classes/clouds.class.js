class Cloud extends MovableObject {
  y = 0;
  width = 800;
  height = 300;
  speed;
  static instanceCount = 0;
  static spacing = 800;
  static initialX = 400;

  constructor() {
    super().loadImage('assets/imgs/5_background/layers/4_clouds/1.png');
    if (Cloud.instanceCount < 5) {
      this.x = Cloud.initialX + Cloud.spacing * Cloud.instanceCount;
    } else {
      this.x = Math.random() * 500 + 800;
    }
    this.speed = 0.1 + Math.random() * 0.2;
    Cloud.instanceCount += 1;
    this.animate();
  }

  /**
   * Initiates the animation loop for the cloud's movement.
   *
   * Uses setInterval to update the cloud's position at a rate of 60 frames per second.
   * Moves the cloud leftward based on its speed and resets its position if it moves off-screen.
   */
  animate() {
    setInterval(() => {
      this.x -= this.speed;
      if (this.x + this.width < 0) {
        this.resetPosition();
      }
    }, 1000 / 60);
  }

  /**
   * Resets the cloud's position to the right side of the screen after it moves off-screen.
   *
   * Sets the cloud's x-coordinate based on the initial position and spacing, and assigns a new random speed.
   */
  resetPosition() {
    this.x = Cloud.initialX + Cloud.spacing * (Cloud.instanceCount - 1);
    this.speed = 0.1 + Math.random() * 0.2;
  }
}