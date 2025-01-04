class BottleStatusbar extends DrawableObject {
  imageBottleStatusbar = 'assets/imgs/7_statusbars/3_icons/icon_salsa_bottle.png';
  collectedBottles = 0;

   constructor(world) {
    super();
    this.world = world;
    this.loadImage(this.imageBottleStatusbar);
    this.x = 130;
    this.y = 50;
    this.width = 50;
    this.height = 50;
    this.collectedBottles = this.world.collectedBottles;
  }

  /**
   * Draws the bottle status bar on the provided canvas context.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    ctx.font = '40px Sancreek';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const textX = this.x + this.width;
    const textY = this.y + this.height / 2;
    ctx.fillText(this.collectedBottles, textX, textY);
  }

  /**
   * Updates the bottle count displayed on the status bar and redraws the world.
   */
  updateBottleStatusbar() {
    this.collectedBottles = this.world.collectedBottles;
    this.world.draw();
  }
}