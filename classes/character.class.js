class Character extends MovableObject {
  offset = { top: 100, right: 10, bottom: 15, left: 10 };
  x = 150;
  y = 168;
  height = 250;
  world;
  speed = 5;
  bottles = 0;
  jumpSound = 'audio/jump.wav';
  collectSound = 'audio/collect.wav';
  hurtSound = 'audio/hurt.ogg';
  snoreSound = 'audio/snore.wav';
  walkingSound = 'audio/running.mp3';
  bottle = false;
  isLongIdle = false;
  hurtSoundPlayed = false;
  lastKeyPressTime = 0;
  lastThrowTime = 0;
  throwCooldown = 1000;
  isInvulnerable = false;

  imagesWalking = [
    'assets/imgs/2_character_pepe/2_walk/W-21.png',
    'assets/imgs/2_character_pepe/2_walk/W-22.png',
    'assets/imgs/2_character_pepe/2_walk/W-23.png',
    'assets/imgs/2_character_pepe/2_walk/W-24.png',
    'assets/imgs/2_character_pepe/2_walk/W-25.png',
    'assets/imgs/2_character_pepe/2_walk/W-26.png',
  ];

imagesJumping = [
  'assets/imgs/2_character_pepe/3_jump/J-31.png',
  'assets/imgs/2_character_pepe/3_jump/J-32.png',
  'assets/imgs/2_character_pepe/3_jump/J-33.png',
  'assets/imgs/2_character_pepe/3_jump/J-34.png',
  'assets/imgs/2_character_pepe/3_jump/J-35.png',
  'assets/imgs/2_character_pepe/3_jump/J-36.png',
  'assets/imgs/2_character_pepe/3_jump/J-37.png',
  'assets/imgs/2_character_pepe/3_jump/J-38.png',
  'assets/imgs/2_character_pepe/3_jump/J-39.png',
  ];

  imagesHurt = [
    'assets/imgs/2_character_pepe/4_hurt/H-41.png',
    'assets/imgs/2_character_pepe/4_hurt/H-42.png',
    'assets/imgs/2_character_pepe/4_hurt/H-43.png',
  ];

  imagesDead = [
    'assets/imgs/2_character_pepe/5_dead/D-51.png',
    'assets/imgs/2_character_pepe/5_dead/D-52.png',
    'assets/imgs/2_character_pepe/5_dead/D-53.png',
    'assets/imgs/2_character_pepe/5_dead/D-54.png',
    'assets/imgs/2_character_pepe/5_dead/D-55.png',
    'assets/imgs/2_character_pepe/5_dead/D-56.png',
    'assets/imgs/2_character_pepe/5_dead/D-57.png',
  ];

  imagesIdle = [
    'assets/imgs/2_character_pepe/1_idle/idle/I-1.png',
    'assets/imgs/2_character_pepe/1_idle/idle/I-2.png',
    'assets/imgs/2_character_pepe/1_idle/idle/I-3.png',
    'assets/imgs/2_character_pepe/1_idle/idle/I-4.png',
    'assets/imgs/2_character_pepe/1_idle/idle/I-5.png',
    'assets/imgs/2_character_pepe/1_idle/idle/I-6.png',
    'assets/imgs/2_character_pepe/1_idle/idle/I-7.png',
    'assets/imgs/2_character_pepe/1_idle/idle/I-8.png',
    'assets/imgs/2_character_pepe/1_idle/idle/I-9.png',
    'assets/imgs/2_character_pepe/1_idle/idle/I-10.png',
  ];

  imagesLongIdle = [
    'assets/imgs/2_character_pepe/1_idle/long_idle/I-11.png',
    'assets/imgs/2_character_pepe/1_idle/long_idle/I-12.png',
    'assets/imgs/2_character_pepe/1_idle/long_idle/I-13.png',
    'assets/imgs/2_character_pepe/1_idle/long_idle/I-14.png',
    'assets/imgs/2_character_pepe/1_idle/long_idle/I-15.png',
    'assets/imgs/2_character_pepe/1_idle/long_idle/I-16.png',
    'assets/imgs/2_character_pepe/1_idle/long_idle/I-17.png',
    'assets/imgs/2_character_pepe/1_idle/long_idle/I-18.png',
    'assets/imgs/2_character_pepe/1_idle/long_idle/I-19.png',
    'assets/imgs/2_character_pepe/1_idle/long_idle/I-20.png',
  ];  
  
   constructor() {
    super().loadImage('assets/imgs/2_character_pepe/1_idle/idle/I-1.png');
    this.loadImageCache(this.imagesWalking);
    this.loadImageCache(this.imagesJumping);
    this.loadImageCache(this.imagesHurt);
    this.loadImageCache(this.imagesDead);
    this.loadImageCache(this.imagesIdle);
    this.loadImageCache(this.imagesLongIdle);
    this.applyGravity();
    this.animate();
    this.lastKeyPressTime = Date.now();
    this.isMovingLeft = false;
  }

  /**
   * Initializes animation loops for character movement and animation states.
   * Sets intervals for moving the character and updating animations.
   */
  animate() {
    this.setStoppableInterval(() => this.moveCharacter(), 1000 / 60);
    this.setStoppableInterval(() => {
      this.playAnimationCharacter();
      this.checkIdleState();
    }, 100);
  }

  /**
   * Handles the character's movement logic.
   * Determines if the character is moving and updates sounds and camera accordingly.
   */
  moveCharacter() {
    const currentTime = Date.now();
    const isMoving = this.executeMovement(currentTime);
    this.updateSounds(isMoving);
    this.updateCamera();
  }

  /**
   * Executes movement based on current input and updates the moving state.
   * @param {number} currentTime - The current timestamp in milliseconds.
   * @returns {boolean} - Indicates whether the character is moving.
   */
  executeMovement(currentTime) {
    let isMoving = this.handleHorizontalMovement(currentTime);
    isMoving = this.handleJumpMovement(currentTime) || isMoving;
    this.resetLongIdleIfMoving(isMoving);
    return isMoving;
  }

  /**
   * Handles horizontal movement based on keyboard input.
   * @param {number} currentTime - The current timestamp in milliseconds.
   * @returns {boolean} - True if the character is moving horizontally, otherwise false.
   */
  handleHorizontalMovement(currentTime) {
    if (this.shouldMoveRight()) {
      this.performRightMovement(currentTime);
      return true;
    } else if (this.shouldMoveLeft()) {
      this.performLeftMovement(currentTime);
      return true;
    }
    return false;
  }

  /**
   * Handles jump movement based on keyboard input.
   * @param {number} currentTime - The current timestamp in milliseconds.
   * @returns {boolean} - True if the character is jumping, otherwise false.
   */
  handleJumpMovement(currentTime) {
    if (this.shouldJump()) {
      this.performJump(currentTime);
      return true;
    }
    return false;
  }

  /**
   * Resets the long idle state if the character is moving.
   * Also pauses the snore sound if the character is no longer idle.
   * @param {boolean} isMoving - Indicates if the character is currently moving.
   */
  resetLongIdleIfMoving(isMoving) {
    if (isMoving && this.isLongIdle) {
      this.isLongIdle = false;
    }
    this.world.soundManager.pauseSound('audio/snore.wav');
  }

  /**
   * Determines if the character should move to the right based on keyboard input and world boundaries.
   * @returns {boolean} - True if the right movement key is pressed and within boundaries, otherwise false.
   */
  shouldMoveRight() {
    return this.world.keyboard.right && this.x < this.world.level.levelEndX;
  }

  /**
   * Determines if the character should move to the left based on keyboard input and world boundaries.
   * @returns {boolean} - True if the left movement key is pressed and within boundaries, otherwise false.
   */
  shouldMoveLeft() {
    return this.world.keyboard.left && this.x > 0;
  }

  /**
   * Determines if the character should jump based on keyboard input and current ground state.
   * @returns {boolean} - True if the jump key is pressed and the character is not already above ground, otherwise false.
   */
  shouldJump() {
    return this.world.keyboard.space && !this.isAboveGround();
  }

  /**
   * Initiates a jump by setting the vertical speed and making the character invulnerable.
   */
  jump() {
    this.setInvulnerable();
    this.speedY = 17;
  }

  /**
   * Sets the character to be invulnerable.
   * Ensures the energy level remains unchanged while invulnerable.
   */
  setInvulnerable() {
    if (this.isInvulnerable = true) {
      this.energy = this.energy;
    }
  }

  /**
   * Performs rightward movement and updates the direction and last key press time.
   * @param {number} currentTime - The current timestamp in milliseconds.
   */
  performRightMovement(currentTime) {
    this.moveRight();
    this.otherDirection = false;
    this.lastKeyPressTime = currentTime;
  }

  /**
   * Performs leftward movement and updates the direction and last key press time.
   * @param {number} currentTime - The current timestamp in milliseconds.
   */
  performLeftMovement(currentTime) {
    this.moveLeft();
    this.otherDirection = true;
    this.lastKeyPressTime = currentTime;
  }

  /**
   * Performs a jump action, plays the jump sound, and updates the last key press time.
   * @param {number} currentTime - The current timestamp in milliseconds.
   */
  performJump(currentTime) {
    this.jump();
    this.world.soundManager.playSound('audio/jump.wav');
    this.lastKeyPressTime = currentTime;
  }

  /**
   * Updates the sounds based on the character's movement state.
   * Plays running sound if moving and on the ground, otherwise pauses it.
   * @param {boolean} isMoving - Indicates if the character is currently moving.
   */
  updateSounds(isMoving) {
    if (isMoving && !this.isAboveGround()) {
      if (!this.world.soundManager.playSound('audio/running.mp3')) {
        this.world.soundManager.playSound('audio/running.mp3');
      }
    } else {
      this.world.soundManager.pauseSound('audio/running.mp3');
    }
  }

  /**
   * Checks if the character is hurt based on the time since the last hit.
   * Plays the hurt sound if the character is recently hurt.
   * @returns {boolean} - True if the character is hurt, otherwise false.
   */
  isHurt() {
    const timePassed = (Date.now() - this.lastHit) / 1000;
    if (timePassed < 1) {
      if (!this.hurtSoundPlayed) {
        this.world.soundManager.playSound('audio/hurt.ogg');
        this.hurtSoundPlayed = true;
      }
      return true;
    }
    this.hurtSoundPlayed = false;
    return false;
  }

  /**
   * Updates the camera position based on the character's x-coordinate.
   */
  updateCamera() {
    this.world.cameraX = -this.x + 100;
  }

  /**
   * Determines if the character is dead based on energy level.
   * @returns {boolean} - True if the character's energy is zero, otherwise false.
   */
  isDeadCharacter() {
    return this.energy === 0;
  }

  /**
   * Plays the appropriate animation based on the character's current state.
   * Chooses between hurt, dead, jumping, walking, long idle, or idle animations.
   */
  playAnimationCharacter() {
    if (this.isHurt()) {
      this.playAnimation(this.imagesHurt);
    } else if (this.isDeadCharacter()) {
      this.playAnimation(this.imagesDead);
    } else if (this.isAboveGround()) {
      this.playAnimation(this.imagesJumping);
    } else if (this.world.keyboard.right || this.world.keyboard.left) {
      this.playAnimation(this.imagesWalking);
    } else if (this.isLongIdle) {
      this.playAnimation(this.imagesLongIdle);
    } else {
      this.playAnimation(this.imagesIdle);
    }
  }

  /**
   * Checks if the character has been idle for a specified duration and updates the idle state.
   * Plays the snore sound if the character enters a long idle state.
   */
  checkIdleState() {
    const currentTime = Date.now();
    const idleDuration = currentTime - this.lastKeyPressTime;
    if (idleDuration >= 10000 && !this.isLongIdle) {
      this.isLongIdle = true;
      this.world.soundManager.playSound('audio/snore.wav');
    }
  }

  /**
   * Throws a bottle if the character has collected bottles and the cooldown has passed.
   * Updates the bottle count and the bottle status bar accordingly.
   */
  throwBottle() {
    const currentTime = Date.now();
    if (!this.otherDirection && this.world.collectedBottles > 0 && (currentTime - this.lastThrowTime) > this.throwCooldown) {
      const bottle = new ThrowableObject(this.x + 50, this.y + 25, this.otherDirection, this.world);
      this.world.throwableObjects.push(bottle);
      this.world.collectedBottles -= 1;
      this.world.bottleStatusbar.updateBottleStatusbar();
      this.lastThrowTime = currentTime;
    } else {
      if (this.world.collectedBottles <= 0) {
      } 
      if ((currentTime - this.lastThrowTime) <= this.throwCooldown) {
      }
    }
  }


  /**
   * Collects a bottle from the game world.
   * Removes the bottle from the world, updates the collected bottles count, and plays a collection sound.
   * @param {number} index - The index of the bottle to collect in the bottles array.
   */
  collectBottle(index) {
    this.world.bottles.splice(index, 1);
    this.world.collectedBottles += 1;
    this.world.bottleStatusbar.updateBottleStatusbar();
    this.world.soundManager.playSound('audio/collect.wav');
  }

  /**
   * Collects a coin from the game world.
   * Removes the coin from the world, updates the collected coins count, updates the coin status bar, and plays a collection sound.
   * @param {number} index - The index of the coin to collect in the coins array.
   */
  collectCoin(index) {
    this.world.coins.splice(index, 1);
    this.world.collectedCoins += 1;
    this.world.coinStatusbar.updateCoinStatusbar(); // Update the status bar
    this.world.soundManager.playSound('audio/collect.wav');
  }
}