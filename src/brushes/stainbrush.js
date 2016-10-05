import Brush from './brush'

let noise2D = require('../../ext/webgl-noise/src/noise2D.glsl');

let vsSource = require('../shaders/brushes/stain/brush.vs');
let waterFsSource = require('../shaders/brushes/stain/water.fs');
let wetFsSource = require('../shaders/brushes/stain/wet.fs');
let dryFsSource = require('../shaders/brushes/stain/dry.fs');
let splat = require('../shaders/brushes/stain/splat.glsl');

import glslPre from '../glslpreprocessor';

class RandomStainBrush {
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
  }
  apply(position) {
    let intensity = Math.random();
    let size = this._simulator.size();
    this._brush.apply({
      splatPosition: position,
      splatWater: Math.random(),
      splatSize: Math.random() * 10,
      splatColor: [0, 0, 0],
      concentration: 1.0
    });
  }
}

module.exports = RandomStainBrush;