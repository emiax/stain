import Buffer from './buffer';
import Shader from './shader';
import ShaderProgram from './shaderprogram';
import ShaderPass from './shaderpass';
import {vec2} from 'gl-matrix';
import glslPre from './glslpreprocessor';
import Triangulator from './triangulator';

import {lerp, smoothstep} from 'interpolation';

let vertexShaderSource = require('./shaders/header.vs')
let fragmentShaderSource = require('./shaders/header.fs')
let noise2D = require('./../ext/webgl-noise/src/noise2D.glsl');



class HeaderRenderer {
  constructor(opt) {
    let context = this._context = opt.context;
    this._headerSize = opt.headerSize;
    this._textureSize = opt.textureSize;
    this._splashScreenRatio = 1;

    let gl = context.gl();

     this._triangulator = new Triangulator();

    let polygon = [-1,-1, 1,-1, 1,1, -1,1, -0.5,-0.5, 0.5,-0.5, 0.5,0.5, -0.5,0.5];
    let vertices = this._triangulator.triangulate(polygon, [4]);

    console.log(vertices);

    this._vertexCoordinates = new Buffer({
        context: context,
        data: new Float32Array(vertices),
        usage: 'static draw',
        itemSize: 2
    });

    let headerVertexShader = new Shader({
      context: context,
      type: 'vertex', 
      source: glslPre(noise2D, vertexShaderSource)
    });
    headerVertexShader.compile();

    let headerFragmentShader = new Shader({
      context: context,
      type: 'fragment', 
      source: glslPre(noise2D, fragmentShaderSource)
    });
    headerFragmentShader.compile();

    let headerProgram = new ShaderProgram({
      context: context,
      vertexShader: headerVertexShader,
      fragmentShader: headerFragmentShader,
    });
    headerProgram.link();

    this._shaderPass = new ShaderPass({
      context: context,
      drawFunction: () => {
        gl.viewport(0, 0, this._headerSize[0], this._headerSize[1]);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, this._vertexCoordinates.nItems()); 
      },
      program: headerProgram,
      attributes: {
        vertexCoord: this._vertexCoordinates
      }
    });

  }

  render(simulator) {
    let textures = simulator.currentOutputTextures();
    Object.keys(textures).forEach((key) => {
      this._shaderPass.setUniform(key, textures[key]);
    });

    console.log(this._splashScreenRatio)
    let ratio = this._splashScreenRatio;
    ratio = smoothstep(0, 1, ratio);
    
    let boxSizeSplashScreen = [0, 0];
    let boxSizeHeader = [this._headerSize[0]/2, this._headerSize[1]/2];

    let boxSize = [lerp(boxSizeHeader[0], boxSizeSplashScreen[0], ratio),
                   lerp(boxSizeHeader[1], boxSizeSplashScreen[1], ratio)];

    let strokeWidthSplashScreen = Math.max(this._headerSize[0], this._headerSize[1]);
    let strokeWidthHeader = 100;
    let strokeWidth = lerp(strokeWidthHeader, strokeWidthSplashScreen, ratio);


    this._shaderPass.setUniform('texturePixelSize', [1/this._textureSize[0], 1/this._textureSize[1]]);
    this._shaderPass.setUniform('headerPixelSize', [1/this._headerSize[0], 1/this._headerSize[1]]);
    this._shaderPass.setUniform('center', [this._headerSize[0]/2, this._headerSize[1]/2]);
    this._shaderPass.setUniform('boxSize', boxSize);
    this._shaderPass.setUniform('strokeWidth', strokeWidth);
    this._shaderPass.apply();
  }

  setHeaderSize(size) {
    this._headerSize = vec2.clone(size);
  }

  setTextureSize(size) {
    this._textureSize = vec2.clone(size);
  }

  setSplashScreenRatio(ratio) {
    this._splashScreenRatio = ratio;
    console.log(this._splashScreenRatio);
  }

}

module.exports = HeaderRenderer;