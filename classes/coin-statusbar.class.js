class CoinStatusbar extends DrawableObject {
    imageCoinStatusbar = 'assets/imgs/7_statusbars/3_icons/icon_coin.png';
    collectedCoins = 0;
  
    constructor(world) {
      super();
      this.world = world;
      this.loadImage(this.imageCoinStatusbar);
      this.x = 20;
      this.y = 50;
      this.width = 50;
      this.height = 50;
      this.collectedCoins = this.world.collectedCoins;
    }
  
    /**
     * Draws the coin status bar along with the current number of collected coins.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on.
     */
    draw(ctx) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      ctx.font = '40px Sancreek';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const textX = this.x + this.width + 10;
      const textY = this.y + this.height / 2;
      ctx.fillText(this.collectedCoins, textX, textY);
    }
  
    /**
     * Updates the number of collected coins and redraws the status bar.
     */
    updateCoinStatusbar() {
      this.collectedCoins = this.world.collectedCoins;
      this.world.draw();
    }
  }  