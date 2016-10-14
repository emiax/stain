import Brush from './brush';
import EventEmitter from '../eventemitter';
import Texture from '../texture';
import {vec2, vec3} from 'gl-matrix';

import noise2D from '../../ext/webgl-noise/src/noise2D.glsl';
import vsSource from '../shaders/brushes/stain/brush.vs';
import waterFsSource from '../shaders/brushes/stain/water.fs';
import wetFsSource from '../shaders/brushes/stain/wet.fs';
import dryFsSource from '../shaders/brushes/stain/dry.fs';
import splat from '../shaders/brushes/imagestain/splat.glsl';

import glslPre from '../glslpreprocessor';

class StainBrush {
  constructor(opt) {
    this._brush = new Brush({
      simulator: opt.simulator,
      vsSource: glslPre(vsSource),
      fsSources: {
        water: glslPre(noise2D, splat, waterFsSource),
        wet: glslPre(noise2D, splat, wetFsSource),
        dry: glslPre(noise2D, splat, dryFsSource)
      } 
    });
    this._simulator = opt.simulator;
    this._context = opt.context;
    this._ready = false;
    this._emitter = new EventEmitter();
    this._color = vec3.fromValues(0.0, 0.0, 0.0);

    let self = this;
  }

  isReady() {
    return this._ready;
  }

  
  on() {
    this._emitter.on.apply(this._emitter, arguments);
  }

  off() {
    this._emitter.off.apply(this._emitter, arguments);
  }

  setColor(color) {
    this._color = color;
  }


  apply(position, brushSize, amount, color) {
    let intensity = Math.random();
    let canvasSize = this._simulator.size();

    let stainPositions = [];
    let stainSizes = [];

    let nStains = 10;
    for (let i = 0; i < nStains; i++) {

      let r = Math.random() * brushSize;
      let x = position[0] * canvasSize[0];
      let y = position[1] * canvasSize[1];

      if (r > brushSize * 0.5) {
        // bigger stains close to the center.
        x += 3 * brushSize * (Math.random() - 0.5);
        y += 3 * brushSize * (Math.random() - 0.5);
      } else {
        // smaller stains more scattered.
        x += 10 * brushSize * (Math.random() - 0.5);
        y += 10 * brushSize * (Math.random() - 0.5);
      }

      stainPositions.push(x);
      stainPositions.push(y);
      stainSizes.push(r);
    }

    let typedStainPositions = new Float32Array(stainPositions);
    let typedStainSizes = new Float32Array(stainSizes);

    this._brush.apply({
      splatWater: Math.random() * amount * 0.5,
      splatSize: brushSize,
      stainSizes: typedStainSizes,
      inputPosition: [position[0], position[1]],
      stainPositions: typedStainPositions,
      concentration: Math.random() * amount * 5.0,
      color: this._color
    });
  }
}

module.exports = StainBrush;