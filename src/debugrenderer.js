import Buffer from './buffer';
import Shader from './shader';
import ShaderProgram from './shaderprogram';
import ShaderPass from './shaderpass';
import {vec2} from 'gl-matrix';
import glslPre from './glslpreprocessor';

let vertexShaderSource = require('./shaders/debug.vs')
let fragmentShaderSource = require('./shaders/debug.fs')
let noise2D = require('./../ext/webgl-noise/src/noise2D.glsl');



class DebugRenderer {
  constructor(opt) {
    let context = this._context = opt.context;
    this._size = opt.size;

    let gl = context.gl();
    let texCoords =
      [
         1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
        -1.0, -1.0
      ];

    this._textureCoordinates = new Buffer({
        context: context,
        data: new Float32Array(texCoords),
        usage: 'static draw',
        itemSize: 2
    });

    let debugVertexShader = new Shader({
      context: context,
      type: 'vertex', 
      source: glslPre(noise2D, vertexShaderSource)
    });
    debugVertexShader.compile();

    let debugFragmentShader = new Shader({
      context: context,
      type: 'fragment', 
      source: glslPre(noise2D, fragmentShaderSource)
    });
    debugFragmentShader.compile();

    let debugProgram = new ShaderProgram({
      context: context,
      vertexShader: debugVertexShader,
      fragmentShader: debugFragmentShader,
    });
    debugProgram.link();

    this._shaderPass = new ShaderPass({
      context: context,
      drawFunction: () => {
        gl.viewport(0, 0, this._size[0], this._size[1]);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, this._textureCoordinates.nItems());
      },
      program: debugProgram,
      attributes: {
        texCoord: this._textureCoordinates
      }
    });

  }

  render(simulator) {
    let textures = simulator.currentOutputTextures();
    Object.keys(textures).forEach((key) => {
      this._shaderPass.setUniform(key, textures[key]);
    });
    this._shaderPass.setUniform('pixelSize', [1/this._size[0], 1/this._size[1]]);
    this._shaderPass.apply();
  }

  setSize(size) {
    this._size = vec2.clone(size);
  }

}

module.exports = DebugRenderer;