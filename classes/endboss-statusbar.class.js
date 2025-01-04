class EndbossStatusbar extends DrawableObject {

  imagesEndbossStatusbar = [
    'assets/imgs/7_statusbars/2_statusbar_endboss/green/green0.png',
    'assets/imgs/7_statusbars/2_statusbar_endboss/green/green20.png',
    'assets/imgs/7_statusbars/2_statusbar_endboss/green/green40.png',
    'assets/imgs/7_statusbars/2_statusbar_endboss/green/green60.png',
    'assets/imgs/7_statusbars/2_statusbar_endboss/green/green80.png',
    'assets/imgs/7_statusbars/2_statusbar_endboss/green/green100.png'
  ];
  
  constructor() {
    super();
    this.loadImageCache(this.imagesEndbossStatusbar);
    this.x = 320;
    this.y = 10;
    this.width = 200;
    this.height = 50;
    this.setPercentage(100);
  }

  /**
   * Sets the current health percentage of the endboss and updates the status bar image accordingly.
   *
   * @param {number} percentage - The new health percentage value.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.imagesEndbossStatusbar[this.resolveImageIndex()];
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