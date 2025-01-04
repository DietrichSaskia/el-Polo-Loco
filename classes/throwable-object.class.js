class ThrowableObject extends MovableObject {
  splashedBottle = false;
  acceleration = 1.5;
  bottle = true;
  animationInterval;
  splashBottleSound = 'audio/spalsh.wav';

  imagesBottle = [
    'assets/imgs/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    'assets/imgs/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    'assets/imgs/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    'assets/imgs/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
  ];

  imagesSplashBottle = [
    'assets/imgs/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    'assets/imgs/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    'assets/imgs/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    'assets/imgs/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    'assets/imgs/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    'assets/imgs/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
  ];

  constructor(x, y, splash, world) {
    super().loadImage('assets/imgs/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
    this.loadImageCache(this.imagesBottle);
    this.loadImageCache(this.imagesSplashBottle);
    this.world = world;
    this.x = x;
    this.y = y;
    this.height = 70;
    this.width = 70;
    this.chooseBottle(x, y, splash);
  }

  /**
   * Determines whether to throw the bottle or display a splash effect based on the splash parameter.
   *
   * @param {number} x - The x-coordinate position for the bottle.
   * @param {number} y - The y-coordinate position for the bottle.
   * @param {boolean} splash - Indicates whether to splash or throw the bottle.
   */
  chooseBottle(x, y, splash) {
    if (splash === true) {
      this.splashBottle(x, y);
    } else {
      this.throwBottle(x, y);
    }
  }

  /**
   * Throws the bottle by setting its initial speed and applying gravity.
   * Animates the bottle's rotation while it moves horizontally.
   *
   * @param {number} x - The initial x-coordinate position for the bottle.
   * @param {number} y - The initial y-coordinate position for the bottle.
   */
  throwBottle(x, y) {
    this.splashedBottle = false;
    this.x = x;
    this.y = y;
    this.speedY = 22;
    this.applyGravity(this.bottle);
    setInterval(() => {
      this.playAnimation(this.imagesBottle);
      this.x += 10;
    }, 50);
  }

  /**
   * Creates a splash effect at the bottle's position and plays the splash sound.
   * Animates the splash frames and removes the splash after a short duration.
   *
   * @param {number} x - The x-coordinate position where the splash occurs.
   * @param {number} y - The y-coordinate position where the splash occurs.
   */
  splashBottle(x, y) {
    this.splashedBottle = true;
    this.x = x;
    this.y = y;
    this.speedY = 0;
    this.currentImageIndex = 0;
    this.animationInterval = setInterval(() => {
      this.playAnimation(this.imagesSplashBottle);
    }, 50);
    if (!this.world.gameIsMuted) {
      this.world.soundManager.playSound(this.splashBottleSound);
    }
    setTimeout(() => {
      clearInterval(this.animationInterval);
    }, 200);
  }

  /**
   * Removes the bottle from the game world by creating a splash effect and deleting the bottle after a short delay.
   */
  removeFromWorld() {
    const finalX = this.x;
    const finalY = this.y;
    this.splashBottle(finalX, finalY);
    setTimeout(() => {
      clearInterval(this.animationInterval);
      const index = this.world.throwableObjects.indexOf(this);
      if (index > -1) {
        this.world.throwableObjects.splice(index, 1);
      }
    }, 200);
  }
}