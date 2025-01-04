/**
 * Represents the first level of the game, containing various game objects such as enemies, clouds,
 * background elements, coins, and bottles.
 *
 * @type {Level}
 */
let level1;

/**
 * Initializes the first level of the game by creating and configuring a new Level instance.
 *
 * This function sets up the game environment by populating the level with enemies,
 * clouds, background objects, coins, and bottles. Each category is represented by
 * an array of corresponding objects, allowing for organized and scalable level design.
 *
 * @function
 */
function initLevel() {
  level1 = new Level (
    // Enemies Array
    [
      new Endboss(),
      new BrownChicken(680),
      new BrownChicken(1240),
      new BrownChicken(1800),
      new BrownChicken(2360),
      new BrownChicken(2920),
      new YellowChicken(400),
      new YellowChicken(960),
      new YellowChicken(1520),
      new YellowChicken(2080),
      new YellowChicken(2640),
    ],
    // Clouds Array
    [
      new Cloud(),
      new Cloud(),
      new Cloud(),
      new Cloud(),
      new Cloud(),
    ],

    // Background Objects Array
    [
      new BackgroundObject('assets/imgs/5_background/layers/air.png', -719),
      new BackgroundObject('assets/imgs/5_background/layers/3_third_layer/2.png', -719),
      new BackgroundObject('assets/imgs/5_background/layers/2_second_layer/2.png', -719),
      new BackgroundObject('assets/imgs/5_background/layers/1_first_layer/2.png', -719),

      new BackgroundObject('assets/imgs/5_background/layers/air.png', 0),
      new BackgroundObject('assets/imgs/5_background/layers/3_third_layer/1.png', 0),
      new BackgroundObject('assets/imgs/5_background/layers/2_second_layer/1.png', 0),
      new BackgroundObject('assets/imgs/5_background/layers/1_first_layer/1.png', 0),

      new BackgroundObject('assets/imgs/5_background/layers/air.png', 719),
      new BackgroundObject('assets/imgs/5_background/layers/3_third_layer/2.png', 719),
      new BackgroundObject('assets/imgs/5_background/layers/2_second_layer/2.png', 719),
      new BackgroundObject('assets/imgs/5_background/layers/1_first_layer/2.png', 719),

      new BackgroundObject('assets/imgs/5_background/layers/air.png', 719*2),
      new BackgroundObject('assets/imgs/5_background/layers/3_third_layer/1.png', 719*2),
      new BackgroundObject('assets/imgs/5_background/layers/2_second_layer/1.png', 719*2),
      new BackgroundObject('assets/imgs/5_background/layers/1_first_layer/1.png', 719*2),

      new BackgroundObject('assets/imgs/5_background/layers/air.png', 719*3),
      new BackgroundObject('assets/imgs/5_background/layers/3_third_layer/2.png', 719*3),
      new BackgroundObject('assets/imgs/5_background/layers/2_second_layer/2.png', 719*3),
      new BackgroundObject('assets/imgs/5_background/layers/1_first_layer/2.png', 719*3),

      new BackgroundObject('assets/imgs/5_background/layers/air.png', 719*4),
      new BackgroundObject('assets/imgs/5_background/layers/3_third_layer/1.png', 719*4),
      new BackgroundObject('assets/imgs/5_background/layers/2_second_layer/1.png', 719*4),
      new BackgroundObject('assets/imgs/5_background/layers/1_first_layer/1.png', 719*4),

      new BackgroundObject('assets/imgs/5_background/layers/air.png', 719*5),
      new BackgroundObject('assets/imgs/5_background/layers/3_third_layer/2.png', 719*5),
      new BackgroundObject('assets/imgs/5_background/layers/2_second_layer/2.png', 719*5),
      new BackgroundObject('assets/imgs/5_background/layers/1_first_layer/2.png', 719*5)
    ],

    // Coins Array
    [
      new Coin(),
      new Coin(),
      new Coin(),
      new Coin(),
      new Coin(),
      new Coin(),
      new Coin(),
      new Coin(),
      new Coin(),
      new Coin(),
      new Coin(),
      new Coin(),
      new Coin(),
      new Coin()
    ],

    // Bottles Array
    [
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
    ]
  );
}