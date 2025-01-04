class CollisionManager {

  constructor(world) {
    this.world = world;
    this.hasEndbossCollided = false;
  }

  /**
   * Starts the collision checking process by setting up intervals.
   * Continuously checks for collisions and throwable object interactions.
   */
  startCollisionCheck() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowableObjects();
    }, 30);
  }

  /**
   * Checks all types of collisions in the game world.
   * Includes collisions between enemies, coins, bottles, and interactions with the endboss.
   */
  checkCollisions() {
    this.checkEnemyCollisions();
    this.checkCoinCollisions();
    this.checkBottleCollisions();
    this.checkBottleEnemyCollisions();
    this.checkBottleEndbossCollision();
  }

  /**
   * Checks for interactions with throwable objects, such as bottles.
   * If the throw key is pressed and the character has bottles, initiates a bottle throw.
   */
  checkThrowableObjects() {
    if (this.isThrowKeyPressed() && this.hasBottles()) {
      this.world.character.throwBottle();
      return;
    }
  }

  /**
   * Determines if the throw key is currently pressed.
   * @returns {boolean} - True if the throw key (e.g., Ctrl) is pressed, otherwise false.
   */
  isThrowKeyPressed() {
    return this.world.keyboard.strg;
  }

  /**
   * Checks if the character has any bottles available to throw.
   * @returns {boolean} - True if there is at least one bottle collected, otherwise false.
   */
  hasBottles() {
    return this.world.collectedBottles > 0;
  }

  /**
   * Checks for collisions between the character and all enemies in the game world.
   */
  checkEnemyCollisions() {
    this.world.level.enemies.forEach((enemy) => {
      if (this.world.character.isColliding(enemy)) {
        this.handleEnemyCollision(enemy);
      }
    });
  }

  /**
   * Handles the collision logic between the character and a specific enemy.
   * @param {Enemy} enemy - The enemy object that has collided with the character.
   */
  handleEnemyCollision(enemy) {
    if (!this.hasEndbossCollided && enemy instanceof Endboss) {
      this.hasEndbossCollided = true;
      enemy.activateAggressiveMode();
    }
    if (this.checkCollisionWithEnemy(enemy)) {
      enemy.enemiesDead();
      this.world.character.jump();
    } else {
      if (enemy.energy > 0) {
        this.world.character.hit();
      }
    }
  }

  /**
   * Determines if the collision between the character and an enemy should result in damage or other effects.
   * @param {Enemy} enemy - The enemy involved in the collision.
   * @returns {boolean} - True if the character is falling onto the enemy, causing the enemy to be defeated, otherwise false.
   */
  checkCollisionWithEnemy(enemy) {
    const characterBottom =
      this.world.character.y +
      this.world.character.height -
      this.world.character.offset.bottom;
    const enemyTop = enemy.y + enemy.offset.top;
    const isFalling = this.world.character.speedY < 0;
    const collision = characterBottom >= enemyTop;
    return collision && isFalling;
  }

  /**
   * Checks for collisions between the character and all coins in the game world.
   */
  checkCoinCollisions() {
    this.world.coins.forEach((coin, index) => {
      if (this.isCoinColliding(coin)) {
        this.world.character.collectCoin(index, coin);
      }
    });
  }

  /**
   * Determines if the character is colliding with a specific coin.
   * @param {Coin} coin - The coin object to check collision with.
   * @returns {boolean} - True if the character is colliding with the coin, otherwise false.
   */
  isCoinColliding(coin) {
    return this.world.character.isColliding(coin);
  }

  /**
   * Checks for collisions between the character and all bottles in the game world.
   */
  checkBottleCollisions() {
    this.world.bottles.forEach((bottle, index) => {
      if (this.isBottleColliding(bottle)) {
        this.world.character.collectBottle(index);
      }
    });
  }

  /**
   * Determines if the character is colliding with a specific bottle.
   * @param {Bottle} bottle - The bottle object to check collision with.
   * @returns {boolean} - True if the character is colliding with the bottle, otherwise false.
   */
  isBottleColliding(bottle) {
    return this.world.character.isColliding(bottle);
  }

  /**
   * Checks for collisions between thrown bottles and enemies.
   * Specifically handles collisions with BrownChicken enemies.
   */
  checkBottleEnemyCollisions() {
    this.world.throwableObjects.forEach((bottle, bottleIndex) => {
      this.world.level.enemies.forEach((enemy) => {
        if (enemy instanceof BrownChicken) {
          if (this.isBottleCollidingWithEnemy(bottle, enemy)) {
            this.handleBottleEnemyCollision(bottleIndex, enemy);
          }
        }
      });
    });
  }

  /**
   * Determines if a thrown bottle is colliding with a specific enemy.
   * @param {ThrowableObject} bottle - The bottle object to check collision with.
   * @param {Enemy} enemy - The enemy object to check collision with.
   * @returns {boolean} - True if the bottle is colliding with the enemy, otherwise false.
   */
  isBottleCollidingWithEnemy(bottle, enemy) {
    return bottle.isColliding(enemy);
  }

  /**
   * Handles the collision between a thrown bottle and an enemy.
   * Triggers splash effects and enemy defeat.
   * @param {number} bottleIndex - The index of the bottle in the throwableObjects array.
   * @param {Enemy} enemy - The enemy object that was hit by the bottle.
   */
  handleBottleEnemyCollision(bottleIndex, enemy) {
    const bottle = this.world.throwableObjects[bottleIndex];
    bottle.splashBottle(bottle.x, bottle.y);
    setTimeout(() => {
      this.removeThrowableObject(bottleIndex);
    }, 500);
    enemy.enemiesDead();
  }

  /**
   * Creates an explosion effect at the location of a defeated enemy.
   * @param {Enemy} enemy - The enemy at which to create the explosion.
   */
  createExplosionAtEnemy(enemy) {
    const explosion = new ThrowableObject(enemy.x, enemy.y, true, this.world);
    this.world.throwableObjects.push(explosion);
  }

  /**
   * Removes a throwable object (e.g., bottle or explosion) from the game world.
   * @param {number} index - The index of the throwable object in the throwableObjects array.
   */
  removeThrowableObject(index) {
    this.world.throwableObjects.splice(index, 1);
  }

  /**
   * Checks for collisions between thrown bottles and the endboss.
   */
  checkBottleEndbossCollision() {
    this.world.throwableObjects.forEach((bottle, bottleIndex) => {
      this.world.level.enemies.forEach((enemy) => {
        if (enemy instanceof Endboss) {
          if (this.isBottleCollidingWithEndboss(bottle, enemy)) {
            this.handleBottleEndbossCollision(bottleIndex, enemy);
          }
        }
      });
    });
  }

  /**
   * Determines if a thrown bottle is colliding with the endboss.
   * Ensures that already splashed bottles do not cause repeated collisions.
   * @param {ThrowableObject} bottle - The bottle object to check collision with.
   * @param {Endboss} endboss - The endboss object to check collision with.
   * @returns {boolean} - True if the bottle is colliding with the endboss and hasn't already splashed, otherwise false.
   */
  isBottleCollidingWithEndboss(bottle, endboss) {
    if (!bottle.splashedBottle) {
      return bottle.isColliding(endboss);
    }
    return false;
  }

  /**
   * Creates an explosion effect at the location of the endboss.
   * @param {Endboss} endboss - The endboss at which to create the explosion.
   */
  createExplosionAtEndboss(endboss) {
    let explosion = new ThrowableObject(endboss.x, endboss.y, true, this.world);
    this.world.throwableObjects.push(explosion);
  }

  /**
   * Handles the collision between a thrown bottle and the endboss.
   * Triggers splash effects and processes the endboss hit.
   * @param {number} bottleIndex - The index of the bottle in the throwableObjects array.
   * @param {Endboss} endboss - The endboss object that was hit by the bottle.
   */
  handleBottleEndbossCollision(bottleIndex, endboss) {
    let bottle = this.getBottle(bottleIndex);
    let splash = this.createSplash(bottle);
    this.removeBottle(bottleIndex);
    this.handleSplash(splash);
    this.processEndbossHit(endboss);
  }

  /**
   * Retrieves a bottle object from the throwableObjects array based on its index.
   * @param {number} bottleIndex - The index of the bottle in the throwableObjects array.
   * @returns {ThrowableObject} - The bottle object at the specified index.
   */
  getBottle(bottleIndex) {
    return this.world.throwableObjects[bottleIndex];
  }

  /**
   * Creates a splash effect at the location of a bottle.
   * @param {ThrowableObject} bottle - The bottle object at which to create the splash.
   * @returns {ThrowableObject} - The newly created splash object.
   */
  createSplash(bottle) {
    let splashX = bottle.x;
    let splashY = bottle.y;
    return new ThrowableObject(splashX, splashY, true, this.world);
  }

  /**
   * Removes a bottle from the throwableObjects array based on its index.
   * @param {number} bottleIndex - The index of the bottle in the throwableObjects array.
   */
  removeBottle(bottleIndex) {
    this.removeThrowableObject(bottleIndex);
  }

  /**
   * Handles the splash effect by adding it to the throwableObjects array and scheduling its removal.
   * @param {ThrowableObject} splash - The splash object to handle.
   */
  handleSplash(splash) {
    this.world.throwableObjects.push(splash);
    setTimeout(() => {
      this.removeSplash(splash);
    }, 200);
  }

  /**
   * Removes a splash effect from the throwableObjects array.
   * @param {ThrowableObject} splash - The splash object to remove.
   */
  removeSplash(splash) {
    const splashIndex = this.world.throwableObjects.indexOf(splash);
    if (splashIndex > -1) {
      this.world.throwableObjects.splice(splashIndex, 1);
    }
  }

  /**
   * Processes the hit on the endboss by reducing its energy and updating its state.
   * @param {Endboss} endboss - The endboss object that was hit.
   */
  processEndbossHit(endboss) {
    this.hitEndboss(endboss);
    endboss.registerHurt();
    if (!endboss.isAggressive) {
      endboss.activateAggressiveMode(this.world.character);
    }
  }

  /**
   * Reduces the endboss's energy upon being hit and updates the endboss's status bar.
   * If the endboss's energy falls below zero, it is set to zero.
   * @param {Endboss} endboss - The endboss object that was hit.
   */
  hitEndboss(endboss) {
    endboss.energy -= 20;
    if (endboss.energy < 0) {
      endboss.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
    this.world.endbossStatusbar.setPercentage(endboss.energy);
  }
}