import Brush from './brush';
import EventEmitter from './eventemitter';
import Texture from './texture';
import {vec2} from 'gl-matrix';

import noise2D from './../ext/webgl-noise/src/noise2D.glsl';
import vsSource from './shaders/brushes/imagestain/brush.vs';
import waterFsSource from './shaders/brushes/imagestain/water.fs';
import wetFsSource from './shaders/brushes/imagestain/wet.fs';
import dryFsSource from './shaders/brushes/imagestain/dry.fs';
import splat = './shaders/brushes/imagestain/splat.glsl';



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
   let stainPositions = [];

   let inputX = 0.01 + Math.random() * 0.98;
   let inputY = 0.1 + Math.random() * 0.8;

   let nStains = 10;
   for (let i = 0; i < nStains; i++) {
    
    let x = inputX + 0.1 * (Math.random() - 0.5);
    let y = inputY + 0.1 * (Math.random() - 0.5);
    //let x = inputX + 0.01 * (Math.random() - 0.5);
    //let y = inputY + 0.01 * (Math.random() - 0.5);


    stainPositions.push(x * size[0]);
    stainPositions.push(y * size[1]);
   }

   let typedStainPositions = new Float32Array(stainPositions);

    this._brush.apply({
      //splatPosition: [size[0] * x, size[1] * y],
      splatWater: Math.random() * amount,
      splatSize: brushSize,
      inputPosition: [inputX, inputY],
      stainPositions: typedStainPositions,
      //splatColor: color,
      concentration: Math.random() * amount * 5.0,
      inputTexture: this._inputTexture
    });
  }
}

module.exports = ImageStainBrush;