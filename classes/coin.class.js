class Coin extends DrawableObject {
  width = 50;
  offset = {top: 5, right: 5, bottom: 5, left: 5};
  height = 50;
  onCollisionCourse = true;

  constructor() {
    super().loadImage('assets/imgs/8_coin/coin_1.png');
    this.x = 300 + Math.random() * (3000 - 300);
    this.y = 100 + Math.random() * (300 - 100);
    this.onCollisionCourse = true;
  }
}