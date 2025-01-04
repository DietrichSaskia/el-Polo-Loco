let canvas;
let world;
let keyboard = new Keyboard();
let soundManager = new SoundManager();

/**
 * Initializes the game world and updates the UI to show the game canvas.
 * Loads the level, hides the start screen, and sets up the world instance.
 */
function init() {
  initLevel();
  document.getElementById("startscreen").classList.add("d-none");
  document.getElementById("canvasContainer").classList.remove("d-none");
  document.getElementById('infobtn').classList.add('d-none');
  document.getElementById("startGameContainer").classList.add("d-none");
  document.getElementById('canvas').classList.remove('d-none');
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard, endGame, soundManager);
}

/**
 * Toggles the mute state for all game sounds.
 * Calls the soundManager to switch between muted and unmuted.
 */
function toggleMute() {
  soundManager.toggleMute();
}

/**
 * Displays the impressum section and hides the main screen elements.
 */
function impressum() {
  document.getElementById("impressum").classList.remove("d-none");
  document.getElementById("startscreen").classList.add("d-none");
  document.getElementById("startGameContainer").classList.add("d-none");
  document.getElementById("toggleSound").classList.add("d-none");
  document.getElementById("infobtn").classList.add("d-none");
}

/**
 * Closes the impressum section and returns to the start screen layout.
 */
function closeImpressum() {
  document.getElementById("impressum").classList.add("d-none");
  document.getElementById("startscreen").classList.remove("d-none");
  document.getElementById("startGameContainer").classList.remove("d-none");
  document.getElementById("toggleSound").classList.remove("d-none");
  document.getElementById("infobtn").classList.remove("d-none");
}

/**
 * Shows the "How To Play" screen and hides other UI elements.
 */
function howToPlayBtn() {
  document.getElementById("startscreen").classList.add("d-none");
  document.getElementById("howToPlayContainer").classList.remove("d-none");
  document.getElementById("startGameContainer").classList.add("d-none");
  document.getElementById("toggleSound").classList.add("d-none");
  document.getElementById("infobtn").classList.add("d-none");
}

/**
 * Closes the "How To Play" screen and returns to the start screen layout.
 */
function closeHowToPlay() {
  document.getElementById("howToPlayContainer").classList.add("d-none");
  document.getElementById("startscreen").classList.remove("d-none");
  document.getElementById("startGameContainer").classList.remove("d-none");
  document.getElementById("toggleSound").classList.remove("d-none");
  document.getElementById("infobtn").classList.remove("d-none");
}

/**
 * Ends the game and shows the appropriate end screen depending on outcome.
 * @param {string} outcome - The outcome of the game: "win" or "lose".
 */
function endGame(outcome) {
  if (outcome === "lose") {
    document.getElementById("endscreenLoose").classList.remove("d-none");
    document.getElementById("canvas").classList.add("d-none");
    document.getElementById("toggleSound").classList.add("d-none");
    document.getElementById("infobtn").classList.add("d-none");
    document.getElementById("mobileButtonContainer").classList.add("d-none");
  } else if (outcome === "win") {
    document.getElementById("endscreenWin").classList.remove("d-none");
    document.getElementById("canvas").classList.add("d-none");
    document.getElementById("toggleSound").classList.add("d-none");
    document.getElementById("infobtn").classList.add("d-none");
    document.getElementById("mobileButtonContainer").classList.add("d-none");
  }
}

/**
 * Returns to the main menu by resetting the UI states to the initial start screen.
 */
function menu() {
  document.getElementById("startscreen").classList.remove("d-none");
  document.getElementById("toggleSound").classList.remove("d-none");
  document.getElementById("infobtn").classList.remove("d-none");
  document.getElementById("startGameContainer").classList.remove("d-none");
  document.getElementById("endscreenLoose").classList.add("d-none");
  document.getElementById("endscreenWin").classList.add("d-none");
}

/**
 * Restarts the game by resetting the end screens and reinitializing the world.
 */
function restartGame() {
  document.getElementById("endscreenLoose").classList.add("d-none");
  document.getElementById("endscreenWin").classList.add("d-none");
  init();
  let canvas = document.getElementById("canvas");
  canvas.classList.remove("d-none");
}

/**
 * Adds touch event listeners for a given button to simulate keyboard input on mobile devices.
 * @param {string} buttonId - The ID of the button element.
 * @param {string} key - The property name in the keyboard object to toggle.
 * @param {Keyboard} keyboard - The keyboard instance controlling inputs.
 */
function addTouchListeners(buttonId, key, keyboard) {
  const button = document.getElementById(buttonId);
  if (!button) {
    return;
  }
  button.addEventListener('touchstart', (event) => {
    event.preventDefault();
    keyboard[key] = true;
  });
  button.addEventListener('touchend', (event) => {
    event.preventDefault();
    keyboard[key] = false;
  });
}

/**
 * Sets up touch controls for mobile buttons once the DOM is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  addTouchListeners('btnLeft', 'left', keyboard);
  addTouchListeners('btnRight', 'right', keyboard);
  addTouchListeners('btnJump', 'space', keyboard);
  addTouchListeners('btnThrow', 'strg', keyboard);
});

/**
 * Handles keydown events to set the corresponding keys in the keyboard object to true.
 */
document.addEventListener("keydown", (event) => {
  if (event.keyCode == 17) {
    keyboard.strg = true;
  }
  if (event.keyCode == 32) {
    keyboard.space = true;
  }
  if (event.keyCode == 37) {
    keyboard.left = true;
  }
  if (event.keyCode == 39) {
    keyboard.right = true;
  }
});

/**
 * Handles keyup events to set the corresponding keys in the keyboard object to false.
 */
document.addEventListener("keyup", (event) => {
  if (event.keyCode == 17) {
    keyboard.strg = false;
  }
  if (event.keyCode == 32) {
    keyboard.space = false;
  }
  if (event.keyCode == 37) {
    keyboard.left = false;
  }
  if (event.keyCode == 39) {
    keyboard.right = false;
  }
});