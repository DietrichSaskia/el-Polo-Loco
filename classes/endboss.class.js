class Endboss extends MovableObject {
  offset = {top: 70, right: 10, bottom: 10, left: 10};
  y = 90;
  height = 350;
  width = 350;
  energy = 100;
  isAggressive = false;
  lastHurtTime = 0;
  attackCooldown = 2000;
  lastAttackTime = 0;
  bossSound = 'audio/boss.wav';

  imagesWalking = [
    'assets/imgs/4_enemie_boss_chicken/2_alert/G5.png',
    'assets/imgs/4_enemie_boss_chicken/2_alert/G6.png',
    'assets/imgs/4_enemie_boss_chicken/2_alert/G7.png',
    'assets/imgs/4_enemie_boss_chicken/2_alert/G8.png',
    'assets/imgs/4_enemie_boss_chicken/2_alert/G9.png',
    'assets/imgs/4_enemie_boss_chicken/2_alert/G10.png',
    'assets/imgs/4_enemie_boss_chicken/2_alert/G11.png',
    'assets/imgs/4_enemie_boss_chicken/2_alert/G12.png',
  ];

  imagesAttack = [
    'assets/imgs/4_enemie_boss_chicken/3_attack/G13.png',
    'assets/imgs/4_enemie_boss_chicken/3_attack/G14.png',
    'assets/imgs/4_enemie_boss_chicken/3_attack/G15.png',
    'assets/imgs/4_enemie_boss_chicken/3_attack/G16.png',
    'assets/imgs/4_enemie_boss_chicken/3_attack/G17.png',
    'assets/imgs/4_enemie_boss_chicken/3_attack/G18.png',
    'assets/imgs/4_enemie_boss_chicken/3_attack/G19.png',
    'assets/imgs/4_enemie_boss_chicken/3_attack/G20.png',
  ];

  imagesHurt = [
    'assets/imgs/4_enemie_boss_chicken/4_hurt/G21.png',
    'assets/imgs/4_enemie_boss_chicken/4_hurt/G22.png',
    'assets/imgs/4_enemie_boss_chicken/4_hurt/G23.png'
  ];

  imagesDead = [
    'assets/imgs/4_enemie_boss_chicken/5_dead/G24.png',
    'assets/imgs/4_enemie_boss_chicken/5_dead/G25.png',
    'assets/imgs/4_enemie_boss_chicken/5_dead/G26.png',
  ];

  constructor() {
    super();
    this.loadImage('assets/imgs/4_enemie_boss_chicken/2_alert/G5.png');
    this.loadImageCache(this.imagesWalking);
    this.loadImageCache(this.imagesHurt);
    this.loadImageCache(this.imagesDead);
    this.loadImageCache(this.imagesAttack);
    this.x = 3900;
    this.animate();
    this.onCollisionCourse = true;
  }

  /**
   * Registers that the end boss has been hurt by updating the lastHurtTime.
   */
  registerHurt() {
    this.lastHurtTime = new Date().getTime();
  }

  /**
   * Activates aggressive mode for the end boss and sets the target character.
   * @param {Character} character - The character to target.
   */
  activateAggressiveMode(character) {
    if (!this.isAggressive) {
      this.isAggressive = true;
      this.character = character;
    }
  }

  /**
   * Determines if the end boss is currently hurt based on energy and time since last hurt.
   * @returns {boolean} True if the end boss is hurt, otherwise false.
   */
  isHurtEndboss() {
    const currentTime = new Date().getTime();
    const timeSinceLastHurt = currentTime - this.lastHurtTime;
    const isEnergyLow = this.energy < 100 && this.energy > 0;
    const isRecentlyHurt = timeSinceLastHurt < 1000;
    return isEnergyLow && isRecentlyHurt;
  }

  /**
   * Moves the end boss towards the targeted character.
   */
  moveTowardsCharacter() {
    if (this.character) {
      const speed = 50; 
      if (this.x > this.character.x) {
        this.x -= speed;
      } else if (this.x < this.character.x) {
        this.x += speed;
      }
    }
  }

  /**
   * Attacks the targeted character if within range and cooldown has passed.
   * Plays the boss sound effect upon attacking.
   */
  attackCharacter() {
    const currentTime = new Date().getTime();
    if (currentTime - this.lastAttackTime >= this.attackCooldown) {
      if (this.isColliding(this.character)) {
        this.character.hit();
        this.lastAttackTime = currentTime;
      }
    }
    world.soundManager.playSound(this.bossSound);
  }

  /**
   * Stops the end boss from attacking by clearing the attack interval.
   */
  stopAttacking() {
    if (this.attackInterval) {
      clearInterval(this.attackInterval);
      this.attackInterval = null;
    }
  }

  /**
   * Checks if the end boss is dead based on its energy level.
   * @returns {boolean} True if the end boss's energy is zero, otherwise false.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Determines if the end boss is dead and handles sound playback.
   * @returns {boolean} True if the end boss is dead, otherwise false.
   */
  isDeadEndboss() {
    if (this.world) {
      world.soundManager.pauseSound('audio/boss.wav');
      return this.isDead();
    }
    return this.isDead();
  }

  /**
   * Starts the animation loop for the end boss.
   */
  animate() {
    this.setStoppableInterval(() => this.animateEndboss(), 250);
  }

  /**
   * Animates the end boss based on its current state (dead, hurt, aggressive, or walking).
   */
  animateEndboss() {
    if (this.isDeadEndboss()) {
      this.playAnimation(this.imagesDead);
      this.stopAttacking();
    } else if (this.isHurtEndboss()) {
      this.playAnimation(this.imagesHurt);
    } else if (this.isAggressive) {
      this.playAnimation(this.imagesAttack);
      this.moveTowardsCharacter();
      this.attackCharacter();
    } else {
      this.playAnimation(this.imagesWalking);
    }
  }
}