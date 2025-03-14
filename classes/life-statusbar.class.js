class LifeStatusbar extends DrawableObject {

  imagesLifeStatusbar = [
    'assets/imgs/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
    'assets/imgs/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
    'assets/imgs/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
    'assets/imgs/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
    'assets/imgs/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
    'assets/imgs/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
  ];
  
  percentage = 100;

  constructor() {
    super();
    this.loadImageCache(this.imagesLifeStatusbar);
    this.x = 20;
    this.y = 0;
    this.width = 200;
    this.height = 50;
    this.setPercentage(100);
  }

  /**
   * Sets the current health percentage of the character and updates the status bar image accordingly.
   *
   * @param {number} percentage - The new health percentage value.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.imagesLifeStatusbar[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the appropriate image index based on the current health percentage.
   *
   * @returns {number} - The index of the image to display.
   */
  resolveImageIndex() {
    if (this.percentage === 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}