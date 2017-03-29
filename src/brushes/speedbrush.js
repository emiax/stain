import Brush from './brush';
import EventEmitter from '../eventemitter';

import vsSource from '../shaders/brushes/speed/brush.vs';
import waterFsSource from '../shaders/brushes/speed/water.fs';
import wetFsSource from '../shaders/brushes/speed/wet.fs';
import dryFsSource from '../shaders/brushes/speed/dry.fs';

import glslPre from '../glslpreprocessor';

export default class SpeedBrush {
  constructor(opt) {
    let waterFs = glslPre(waterFsSource);
    let wetFs = glslPre(wetFsSource);
    let dryFs = glslPre(dryFsSource);
    this._brush = new Brush({
      simulator: opt.simulator,
      vsSource: glslPre(vsSource),
      fsSources: {
        water: waterFs,
        wet: wetFs,
        dry: dryFs
      }
    });
    this._simulator = opt.simulator;
    this._context = opt.context;
  }
  
  apply(opt) {
    this._brush.apply(opt);
  }
};