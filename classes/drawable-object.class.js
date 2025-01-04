class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 200;
  y = 150;
  height = 150;
  width = 100;
  intervalIds = [];

  /**
   * Loads an image from the specified path and assigns it to the img property.
   *
   * @param {string} path - The file path to the image to load.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Preloads a set of images and stores them in the imageCache.
   *
   * @param {string[]} array - An array of image file paths to preload.
   */
  loadImageCache(array) {
    array.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Draws the image onto the provided canvas context.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw the image on.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Sets up a stoppable interval by storing the interval ID.
   *
   * @param {Function} fn - The function to execute at each interval.
   * @param {number} time - The interval time in milliseconds.
   */
  setStoppableInterval(fn, time) {
    let id = setInterval(fn, time);
    this.intervalIds.push(id);
  }

  /**
   * Clears all active intervals stored in intevalIds.
   */
  clearAllInterval() {
    if (Array.isArray(this.intervalIds)) {
      this.intervalIds.forEach((id) => clearInterval(id));
      this.intervalIds = [];
    } else {
      console.warn("intervalIds ist nicht definiert oder kein Array");
    }
  }
}