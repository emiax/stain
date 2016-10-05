import Brush from './brush';

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
  
  apply() {
    let intensity = Math.random();
    let size = this._simulator.size();
    //let color = [intensity, Math.min(1.0, intensity * 1.2), Math.min(1.0, intensity * 2.0)];
    let color = [];
    let rand = Math.random();
    if (rand < 0.33) {
      color = [0, Math.random(), 0]//[Math.min(1.0, intensity * 1.2), Math.min(1.0, intensity * 1.2), Math.min(1.0, intensity * 0.0)];
    } else if (rand < 0.67) {
      color = [Math.random(), 0, 0];
    } else {
      color = [1, 1, 1];
    }


    this._brush.apply({
      splatPosition: [size[0] * Math.random(), size[1] * Math.random()],
      splatWater: Math.random() * 1.0,
      splatSize: Math.random() * 20,
      splatColor: color,
      concentration: Math.random() * 10.0
    });
  }
}

module.exports = RandomStainBrush;