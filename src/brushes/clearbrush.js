import Brush from './brush';
import EventEmitter from '../eventemitter';
//import Texture from '../texture';
// import {vec2} from 'gl-matrix';

import vsSource from '../shaders/brushes/clear/brush.vs';
import fsSource from '../shaders/brushes/clear/brush.fs';

import glslPre from '../glslpreprocessor';

export default class ClearBrush {
  constructor(opt) {
    let fs = glslPre(fsSource);
    this._brush = new Brush({
      simulator: opt.simulator,
      vsSource: glslPre(vsSource),
      fsSources: {
        water: fs,
        wet: fs,
        dry: fs
      } 
    });
    this._simulator = opt.simulator;
    this._context = opt.context;
  }
  
  apply() {
    this._brush.apply();
  }
};