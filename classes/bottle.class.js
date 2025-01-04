class Bottle extends DrawableObject {
  width = 80;
  offset = {top: 5, right: 15, bottom: 5, left: 30};
  height = 60; 
  onCollisionCourse = true;

  constructor() {
    super().loadImage('assets/imgs/6_salsa_bottle/1_salsa_bottle_on_ground.png');
    this.x = 300 + Math.random() * (3000 - 300);
    this.y = 365;
  }
}