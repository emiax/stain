import Brush from './brush';
import EventEmitter from './eventemitter';
import Texture from './texture';
import {vec2} from 'gl-matrix';

let noise2D = require('./../ext/webgl-noise/src/noise2D.glsl');
let vsSource = require('./shaders/brushes/imagestain/brush.vs');
let waterFsSource = require('./shaders/brushes/imagestain/water.fs');
let wetFsSource = require('./shaders/brushes/imagestain/wet.fs');
let dryFsSource = require('./shaders/brushes/imagestain/dry.fs');
let splat = require('./shaders/brushes/imagestain/splat.glsl');



import glslPre from './glslpreprocessor';

class ImageStainBrush {
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
    let image = this._image = new Image(opt.imageWidth, opt.imageHeight);
    this._image.src = opt.imageSource;
    this._context = opt.context;
    this._ready = false;
    this._emitter = new EventEmitter();

    let self = this;
    image.onload = function(evt) { 
      self._inputTexture = new Texture({
          context: self._context,
          size: vec2.fromValues(this.width, this.height),
          format: 'rgba',
          precision: 'byte',
          image: self._image
        });
      self._ready = true;
      self._emitter.emit('load');
    }
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

  
  apply(brushSize, amount) {
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

   // console.log(this._inputTexture);
   let x = 0.01 + Math.random() * 0.98;
   let y = 0.1 + Math.random() * 0.8;

    this._brush.apply({
      splatPosition: [size[0] * x, size[1] * y],
      splatWater: Math.random() * amount,
      splatSize: brushSize,
      inputPosition: [x, y],
      //splatColor: color,
      concentration: Math.random() * amount * 5.0,
      inputTexture: this._inputTexture
    });
  }
}

module.exports = ImageStainBrush;