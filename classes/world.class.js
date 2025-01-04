class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  cameraX = 0;
  lifeStatusbar = new LifeStatusbar();
  endbossStatusbar = new EndbossStatusbar();
  throwableObjects = [];
  coins = [];
  totalCoins = 0;
  collectedCoins = 0;
  coinStatusbar = new CoinStatusbar(this);
  bottles = [];
  totalBottles = 0;
  collectedBottles = 0;
  bottleStatusbar = new BottleStatusbar(this);
  collisionManager = new CollisionManager(this);
  gameOver = false;
  onGameOverCallback;
  soundManager;
  endbossStatusVisible = false;

  constructor(canvas, keyboard, onGameOverCallback, soundManager) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.coins = this.level.coins;
    this.totalCoins = this.coins.length;
    this.collectedCoins = 0;
    this.bottles = this.level.bottles;
    this.totalBottles = this.bottles.length;
    this.collectedBottles = 0;
    this.soundManager = soundManager;
    this.onGameOverCallback = onGameOverCallback;
    this.draw();
    this.setWorld();
    this.collisionManager.startCollisionCheck();
    this.soundManager.playSound("audio/backgroundSound.wav");
  }

  /**
   * Sets the current world reference within the character.
   * Allows the character to access other world properties and methods.
   * @returns {void}
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * The main drawing loop that renders all game elements.
   * It clears the canvas, sets up the camera, draws background and game objects,
   * and checks for game over conditions.
   * @returns {void}
   */
  draw() {
    if (this.gameOver) {
      return;
    }
    this.clearCanvas();
    this.setupCameraAndDrawBackground();
    this.drawStatusAndGameObjects();
    this.requestNextFrame();
    this.checkGameOverConditions();
  }

  /**
   * Sets up the camera position, draws the background objects, and resets the camera.
   * @returns {void}
   */
  setupCameraAndDrawBackground() {
    this.setCamera();
    this.drawBackground();
    this.resetCamera();
  }

  /**
   * Draws the status bars and game objects, handling camera translations.
   * @returns {void}
   */
  drawStatusAndGameObjects() {
    this.drawStatusbars();
    this.setCamera();
    this.drawGameObjects();
    this.resetCamera();
  }

  /**
   * Checks the conditions to determine if the game is over.
   * If the character is dead, triggers a loss. If the endboss is dead, triggers a win.
   * @returns {void}
   */
  checkGameOverConditions() {
    if (this.character.isDead()) {
      this.soundManager.pauseAllSounds();
      this.endGame("lose");
      return;
    }
    let endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (endboss && endboss.isDeadEndboss()) {
      this.soundManager.pauseAllSounds();
      this.endGame("win");
      return;
    }
  }

  /**
   * Clears the entire canvas, removing all previously drawn elements.
   * @returns {void}
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Translates the canvas context based on the current camera position.
   * This creates the effect of camera movement within the game world.
   * @returns {void}
   */
  setCamera() {
    this.ctx.translate(this.cameraX, 0);
  }

  /**
   * Resets the canvas context translation to the original position.
   * Ensures that subsequent drawings are not affected by previous translations.
   * @returns {void}
   */
  resetCamera() {
    this.ctx.translate(-this.cameraX, 0);
  }

  /**
   * Draws all background objects and clouds to the canvas.
   * @returns {void}
   */
  drawBackground() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
  }

  /**
   * Draws all status bars to the canvas.
   * Also determines the visibility of the endboss status bar based on the character's position.
   * @returns {void}
   */
  drawStatusbars() {
    this.addToMap(this.lifeStatusbar);
    this.addToMap(this.bottleStatusbar);
    this.addToMap(this.coinStatusbar);
    if (this.character.x > 3200) {
      this.endbossStatusVisible = true;
    }
    if (this.endbossStatusVisible) {
      this.addToMap(this.endbossStatusbar);
    }
  }

  /**
   * Draws all game objects, including the character, enemies, throwable objects, coins, and bottles.
   * @returns {void}
   */
  drawGameObjects() {
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.coins);
    this.addObjectsToMap(this.bottles);
  }

  /**
   * Requests the next animation frame, ensuring the draw loop continues.
   * @returns {void}
   */
  requestNextFrame() {
    requestAnimationFrame(() => {
      this.draw();
    });
  }

  /**
   * Adds multiple objects to the canvas by iterating through the provided array.
   * @param {DrawableObject[]} objects - An array of drawable objects to be rendered.
   * @returns {void}
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Adds a single object to the canvas. If the object is facing the opposite direction,
   * it flips the image before drawing and flips it back afterward.
   * @param {DrawableObject} mo - The movable object to be rendered.
   * @returns {void}
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips the image of an object horizontally. Useful for rendering objects facing left.
   * @param {DrawableObject} mo - The object whose image is to be flipped.
   * @returns {void}
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Resets the image flip by restoring the canvas context and resetting the object's position.
   * @param {DrawableObject} mo - The object whose image flip is to be reset.
   * @returns {void}
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Ends the game by setting the game over state, executing end game procedures,
   * and clearing all active intervals related to the character and the endboss.
   *
   * @param {string} outcome - The result of the game (e.g., 'win', 'lose').
   * @returns {void}
   */
  endGame(outcome) {
    this.gameOver = true;
    endGame(outcome);
    this.character.clearAllInterval();
    let endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (endboss) {
      endboss.clearAllInterval();
    }
  }
}