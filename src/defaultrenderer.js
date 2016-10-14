import Buffer from './buffer';
import Shader from './shader';
import ShaderProgram from './shaderprogram';
import ShaderPass from './shaderpass';
import {vec2} from 'gl-matrix';
import glslPre from './glslpreprocessor';
import Triangulator from './triangulator';

let vertexShaderSource = require('./shaders/default.vs')
let fragmentShaderSource = require('./shaders/default.fs')
let noise2D = require('../ext/webgl-noise/src/noise2D.glsl');

class DefaultRenderer {
  constructor(opt) {
    let context = this._context = opt.context;
    this._displaySize = opt.displaySize;
    this._textureSize = opt.textureSize;
    this._backgroundColor = [0.98, 0.98, 0.98];

    let gl = context.gl();

    this._triangulator = new Triangulator();

    let polygon = [-1,-1, 1,-1, 1,1, -1,1];
    let vertices = this._triangulator.triangulate(polygon);

    this._vertexCoordinates = new Buffer({
        context: context,
        data: new Float32Array(vertices),
        usage: 'static draw',
        itemSize: 2
    });

    let vertexShader = new Shader({
      context: context,
      type: 'vertex', 
      source: glslPre(noise2D, vertexShaderSource)
    });
    vertexShader.compile();

    let fragmentShader = new Shader({
      context: context,
      type: 'fragment', 
      source: glslPre(noise2D, fragmentShaderSource)
    });
    fragmentShader.compile();

    let program = new ShaderProgram({
      context: context,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    program.link();

    this._shaderPass = new ShaderPass({
      context: context,
      drawFunction: () => {
        gl.viewport(0, 0, this._displaySize[0], this._displaySize[1]);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, this._vertexCoordinates.nItems()); 
      },
      program: program,
      attributes: {
        vertexCoord: this._vertexCoordinates
      }
    });
  }

  render(simulator) {
    let textures = simulator.currentOutputTextures();
    this._shaderPass.setUniform('wet', textures['wet']);
    this._shaderPass.setUniform('dry', textures['dry']);
    this._shaderPass.setUniform('backgroundColor', this._backgroundColor);
    this._shaderPass.setUniform('texturePixelSize', [1/this._textureSize[0], 1/this._textureSize[1]]);
    this._shaderPass.apply();
  }

  setBackgroundColor(backgroundColor) {
    this._backgroundColor = backgroundColor;
  }

  setDisplaySize(size) {
    this._displaySize = vec2.clone(size);
  }

  setTextureSize(size) {
    this._textureSize = vec2.clone(size);
  }
}

module.exports = DefaultRenderer;