import Brush from './brush';
import EventEmitter from '../eventemitter';

import vsSource from '../shaders/brushes/clear/brush.vs';
import waterFsSource from '../shaders/brushes/clear/water.fs';
import colorFsSource from '../shaders/brushes/clear/color.fs';

import glslPre from '../glslpreprocessor';

export default class ClearBrush {
  constructor(opt) {
    let waterFs = glslPre(waterFsSource);
    let colorFs = glslPre(colorFsSource);
    this._brush = new Brush({
      simulator: opt.simulator,
      vsSource: glslPre(vsSource),
      fsSources: {
        water: waterFs,
        wet: colorFs,
        dry: colorFs
      }
    });
    this._simulator = opt.simulator;
    this._context = opt.context;
  }
  
  apply(opt) {
    this._brush.apply(opt);
  }
};