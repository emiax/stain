/*
 * Start an animation in the page header.
 */

import HeaderAnimation from './headeranimation.js';

const headerId = 'main-header';
const canvasId = 'main-header-canvas';

/**
  * Update canvas size to the same as main-header.
  */
function updateCanvasSize(headerAnimation) {
    var header = document.getElementById(headerId);
    let canvas = document.getElementById(canvasId);
    var w = header.offsetWidth;
    var h = header.offsetHeight;
    canvas.width = w;
    canvas.height = h;
    return [w, h];
}

/**
  * Initialize webgl and start the animation.
  */
function initHeader() {
  let gl = null;
  let headerAnimation = null;
  let canvas = document.getElementById(canvasId);
  try {
    gl = canvas.getContext('webgl');
    
  } catch (e) {
      console.log('WebGL not supported.');
  }

  if (gl) {
    let size = updateCanvasSize(headerAnimation);
    headerAnimation = new HeaderAnimation(gl, size[0], size[1]);
    window.addEventListener('resize', function () {
      let size = updateCanvasSize(headerAnimation);
      headerAnimation.setSize(size[0], size[1]);
    });
    headerAnimation.start();
  }
}

/**
  * Lift off!
  */
window.onload = function () {
    initHeader();
}