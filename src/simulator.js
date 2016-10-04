import Texture from './texture';
import {vec2} from 'gl-matrix';
import Framebuffer from './framebuffer';
import Shader from './shader';
import ShaderProgram from './shaderprogram';
import ShaderPass from './shaderPass';
import Buffer from './buffer';
import glslPre from './glslpreprocessor';

import noise2D from '../ext/webgl-noise/src/noise2D.glsl';
import vsSource from './shaders/simulation/simulation.vs';
import waterFsSource from './shaders/simulation/water.fs';
import wetFsSource from './shaders/simulation/wet.fs';
import dryFsSource from './shaders/simulation/dry.fs';

let vsSourceWithDeps = glslPre(vsSource);

let fsSources = {
  water: glslPre(noise2D, waterFsSource),
  wet: glslPre(noise2D, wetFsSource),
  dry: glslPre(noise2D, dryFsSource)
};

class Simulator {
  constructor(opt) {
    this._context = opt.context;
    this._size = vec2.clone(opt.size);
    this._pingPong = false; // start off in ping state.
    this._time = 0;
  }

  init() {
    this.setupTexturesAndFramebuffers();
    this.setupShaders();
    this.setupShaderPasses();
  }

  setupShaders() {
    let context = this._context;

    // create vertex shader object, and compile it
    let vertexShader = new Shader({
      context: context,
      type: 'vertex',
      source: vsSourceWithDeps,
    });
    vertexShader.compile();

    this._programs = {};

    // create shader programs with different
    // fragment shaders but same vertex shader.
    Object.keys(fsSources).forEach((component) => {
      let src = fsSources[component];
      let fragmentShader = new Shader({
        context: context,
        type: 'fragment',
        source: src,
      });
      fragmentShader.compile();

      let program = this._programs[component] = new ShaderProgram({
        context: context,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
      });
      program.setSuppressWarnings(true);
      program.link();

    });
  }

  /**
   * Sets up the _textureSets and _framebuffer members.
   */
  setupTexturesAndFramebuffers() {
    let textures = this._textureSets = {};
    let framebuffers = this._framebufferSets = {};
    // One texture set per ping pong state
    [false, true].forEach((pingPong) => {
      textures[pingPong] = {};
      framebuffers[pingPong] = {};
      // One texture & fbo per simulation component
      ['water', 'wet', 'dry'].forEach((component) => {
        let texture = textures[pingPong][component] = new Texture({
          context: this._context,
          size: this._size,
          format: 'rgba',
          precision: 'float'
        });
        let fbo = this._framebufferSets[pingPong][component] = new Framebuffer({
          context: this._context
        });
        fbo.attachTexture('color', texture);
      });
    });
  }

  setupShaderPasses() {
    this._shaderPasses = {};
    [false, true].forEach((pingPong) => {
      this._shaderPasses[pingPong] = [
        this.createShaderPass(pingPong, 'water'),
        this.createShaderPass(pingPong, 'wet'),
        this.createShaderPass(pingPong, 'dry')
      ];
    });
  }

  createShaderPass(pingPong, component) {
    let textures = this._textureSets;
    let framebuffers = this._framebufferSets;
    let programs = this._programs;
    let textureCoordinates = this._textureCoordinates;
    let forces = this._forces;
    let gl = this._context.gl();

    return new ShaderPass({
      context: this._context,
      drawFunction: () => {
        gl.viewport(0, 0, this._size[0], this._size[1]);
        gl.drawArrays(gl.TRIANGLES, 0, textureCoordinates.nItems());
      },
      uniforms: {
        water: textures[pingPong].water,
        wet: textures[pingPong].wet,
        dry: textures[pingPong].dry,
        pixelSize: [1/this._size[0], 1/this._size[1]],
        dryingSpeed: 0.001,
        evaporationSpeed: 0.001,
        diffusionFactor: 0.2,
        time: 0
      },
      program: programs[component],
      attributes: {
        texCoord: textureCoordinates,
        force: forces
      },
      framebuffer: framebuffers[!pingPong][component]
    });
  }

  setTextureCoordinatesAndForces(textureCoordinates, forces) {
    let context = this._context;
    this._textureCoordinates = new Buffer({
        context: context,
        data: new Float32Array(textureCoordinates),
        usage: 'static draw',
        itemSize: 2
    });
    this._forces = new Buffer({
        context: context,
        data: new Float32Array(forces),
        usage: 'static draw',
        itemSize: 2
    });
  }

  step() {
    
    let pingPong = this._pingPong;
    Object.keys(this._shaderPasses[pingPong]).forEach((component) => {
      let shaderPass = this._shaderPasses[pingPong][component];
      shaderPass.setUniform('time', this._time++);
      shaderPass.apply();
    });
    this.pingPong();
  }

  currentOutputTextures() {
    return this._textureSets[this._pingPong];
  }

  currentInputTextures() {
    return this._textureSets[!this._pingPong];  
  }

  currentOutputFramebuffers() {
    return this._framebufferSets[this._pingPong];
  }

  currentInputFramebuffers() {
    return this._framebufferSets[!this._pingPong];
  }

  size() {
    return this._size;
  }

  pingPong() {
    this._pingPong = !this._pingPong;
  }

  context() {
    return this._context;
  }

  textureCoordinates() {
    return this._textureCoordinates;
  }
}


module.exports = Simulator;