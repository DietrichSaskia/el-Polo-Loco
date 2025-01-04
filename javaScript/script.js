let PleaseRotate = {},
  currentOrientation = null,
  initialize = false;
let options = {
  startOnPageLoad: true,
  onHide: function () {},
  onShow: function () {},
  forcePortrait: false,
  message: "Please Rotate Your Device",
  subMessage: "",
  allowClickBypass: false, // Set to false to prevent dismissing the message
  onlyMobile: true,
  zIndex: 99,
  iconNode: null,
};

PleaseRotate.Showing = false;

/**
 * Displays the introduction screen for the game.
 */
function gameIntroductionScreen() {
  let introScreen = document.getElementById("introductionScreen");
  if (introScreen) {
    introScreen.style.display = "flex";
  }
}

/**
 * Checks the device's orientation and adjusts the canvas height accordingly.
 */
function checkOrientation() {
  let canvas = document.getElementById("canvas");
  if (!canvas) return;
  if (window.matchMedia("(orientation: landscape)").matches) {
    if (window.innerHeight < 480) {
      let newHeight = window.innerHeight;
      canvas.style.height = `${newHeight}px`;
    }
  } else {
    canvas.style.height = `100%`;
  }
}

/**
 * Checks if the current device is a mobile device.
 *
 * @returns {boolean} True if the device is mobile, otherwise false.
 */
function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Initializes the control elements for mobile devices on page load.
 */
window.addEventListener("load", function () {
  if (options.startOnPageLoad) PleaseRotate.start();
  let controls = document.getElementById("bottomWrapper");
  if (controls) {
    if (isMobileDevice()) {
      controls.style.display = "flex";
    } else {
      controls.style.display = "none";
    }
  }
});

/**
 * Overrides the default options with the provided updates.
 *
 * @param {Object} updates - The new options that override the default options.
 */
function overrideOptions(updates) {
  for (let prop in updates) {
    if (updates.hasOwnProperty(prop)) {
      options[prop] = updates[prop];
    }
  }
}

/**
 * Sets the CSS class of the <html> element based on the current state.
 *
 * @param {string} state - The state to set (e.g., "showing", "hiding").
 */
function setBodyClass(state) {
  let htmlElement = document.documentElement;
  let className = htmlElement.className.replace(
    /(?:^|\s)pleaserotate-\S*/g,
    ""
  );
  htmlElement.className = `${className} pleaserotate-${state}`.trim();
}

/**
 * Creates an HTML element with the specified attributes.
 *
 * @param {string} tag - The tag of the element to create (e.g., 'div', 'svg').
 * @param {Object} [attributes={}] - An object containing the attributes and their values.
 * @returns {HTMLElement} The created HTML element.
 */
function createElement(tag, attributes = {}) {
  let element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) =>
    element.setAttribute(key, value)
  );
  return element;
}

/**
 * Creates all necessary HTML elements for the PleaseRotate screen.
 */
function createElements() {
  let backdrop = createElement("div", {
    id: "pleaserotate-backdrop",
    style: `z-index: ${options.zIndex};`,
  });
  let container = createElement("div", { id: "pleaserotate-container" });
  let message = createElement("div", { id: "pleaserotate-message" });
  let subMessage = createElement("small");
  backdrop.appendChild(container);
  container.appendChild(options.iconNode || createPhoneSVG());
  container.appendChild(message);
  message.appendChild(document.createTextNode(options.message));
  subMessage.appendChild(document.createTextNode(options.subMessage));
  message.appendChild(subMessage);
  document.body.appendChild(backdrop);
}

/**
 * Creates the SVG element for the phone icon.
 *
 * @returns {SVGSVGElement} The created SVG element.
 */
function createPhoneSVG() {
  let svgNS = "http://www.w3.org/2000/svg";
  let svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("id", "pleaserotate-graphic");
  svg.setAttribute("viewBox", "0 0 250 250");
  svg.setAttribute("width", "100px");
  svg.setAttribute("height", "100px");
  let group = document.createElementNS(svgNS, "g");
  if (options.forcePortrait) {
    group.setAttribute("transform", "rotate(-90 125 125)");
  }
  let path = document.createElementNS(svgNS, "path");
  path.setAttribute(
    "d",
    "M190.5,221.3c0,8.3-6.8,15-15,15H80.2c-8.3,0-15-6.8-15-15V28.7" +
      "c0-8.3,6.8-15,15-15h95.3c8.3,0,15,6.8,15,15V221.3z" +
      "M74.4,33.5l-0.1,139.2c0,8.3,0,17.9,0,21.5c0,3.6,0,6.9," +
      "0,7.3c0,0.5,0.2,0.8,0.4,0.8s7.2,0,15.4,0h75.6c8.3,0,15.1,0,15.2,0"
  );
  group.appendChild(path);
  svg.appendChild(group);
  return svg;
}

/**
 * Sets the visibility of the PleaseRotate backdrop.
 *
 * @param {boolean} visible - True to show the backdrop, false to hide it.
 */
function setVisibility(visible) {
  let backdropElement = document.getElementById("pleaserotate-backdrop");
  if (backdropElement) {
    backdropElement.style.display = visible ? "block" : "none";
  }
}

/**
 * Called when the device's orientation changes.
 * Decides whether to show or hide the rotate prompt.
 */
function orientationChanged() {
  let shouldShow =
    (currentOrientation && !options.forcePortrait) ||
    (!currentOrientation && options.forcePortrait);
  let propagate = shouldShow ? options.onShow() : options.onHide();
  setBodyClass(shouldShow ? "showing" : "hiding");
  if (propagate === undefined || propagate) {
    PleaseRotate.Showing = shouldShow;
    setVisibility(shouldShow);
  }
}

/**
 * Checks if the device is in portrait mode.
 *
 * @returns {boolean} True if the device is in portrait mode, otherwise false.
 */
function isPortrait() {
  return window.innerWidth < window.innerHeight;
}

/**
 * Checks if the device's orientation has changed and responds accordingly.
 */
function checkOrientationChange() {
  if (!isMobileDevice() && options.onlyMobile) {
    if (!initialize) {
      initialize = true;
      setVisibility(false);
      setBodyClass("hiding");
      options.onHide();
    }
    return;
  }
  if (currentOrientation !== isPortrait()) {
    currentOrientation = isPortrait();
    orientationChanged();
  }
}

/**
 * Starts the PleaseRotate functionality.
 *
 * @param {PleaseRotateOptions} [opts] - Optional configuration options.
 */
PleaseRotate.start = function (opts) {
  if (!document.body) {
    return window.addEventListener("load", () => PleaseRotate.start(opts));
  }
  if (opts) {
    overrideOptions(opts);
  }
  createElements();
  checkOrientationChange();
  window.addEventListener("resize", checkOrientationChange, false);
  if (options.allowClickBypass) {
    let backdrop = document.getElementById("pleaserotate-backdrop");
    if (backdrop) {
      backdrop.onclick = handleBackdropClick;
    }
  }
};

/**
 * Stops the PleaseRotate functionality and removes event listeners.
 */
PleaseRotate.stop = function () {
  window.removeEventListener("resize", checkOrientationChange, false);
};

/**
 * Registers a callback function to be executed when the message is shown.
 *
 * @param {function} fn - The callback function.
 */
PleaseRotate.onShow = function (fn) {
  options.onShow = fn;
  if (initialize) {
    initialize = false;
    currentOrientation = null;
    checkOrientationChange();
  }
};

/**
 * Registers a callback function to be executed when the message is hidden.
 *
 * @param {function} fn - The callback function.
 */
PleaseRotate.onHide = function (fn) {
  options.onHide = fn;
  if (initialize) {
    currentOrientation = null;
    initialize = false;
    checkOrientationChange();
  }
};
