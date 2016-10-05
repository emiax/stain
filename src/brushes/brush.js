import Shader from '../shader'
import ShaderProgram from '../shaderprogram'
import ShaderPass from '../shaderpass'


class Brush {
  constructor(opt) {
    this._simulator = opt.simulator;    
    this._context = this._simulator.context();
    this._fsSources = opt.fsSources;
    this._vsSource = opt.vsSource;

    this.setupShaders();
  }

  setupShaders() {
    let context = this._context;

    // create vertex shader object, and compile it
    let vertexShader = new Shader({
      context: context,
      type: 'vertex',
      source: this._vsSource,
    });
    vertexShader.compile();

    this._programs = {};

    // create shader programs with different
    // fragment shaders but same vertex shader.
    Object.keys(this._fsSources).forEach((component) => {
      let src = this._fsSources[component];
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

  createShaderPass(component, additionalUniforms) {
    let inputTextures = this._simulator.currentOutputTextures();
    let outputFramebuffers = this._simulator.currentInputFramebuffers();
    let textureCoordinates = this._simulator.textureCoordinates();
    let size = this._simulator.size();
    let programs = this._programs;
    let gl = this._context.gl();

    let uniforms = {
        water: inputTextures.water,
        wet: inputTextures.wet,
        dry: inputTextures.dry,
        pixelSize: [1/size[0], 1/size[1]]
    };

    Object.keys(additionalUniforms).forEach((key) => {
      uniforms[key] = additionalUniforms[key];
    });

    let pass = new ShaderPass({
      context: this._context,
      drawFunction: () => {
        gl.viewport(0, 0, size[0], size[1]);
        gl.drawArrays(gl.TRIANGLES, 0, textureCoordinates.nItems());
      },
      uniforms: uniforms,
      program: programs[component],
      attributes: {
        texCoord: textureCoordinates
      },
      framebuffer: outputFramebuffers[component]
    });

    return pass;
  }

  apply(uniforms) {
    uniforms = uniforms || {};
    Object.keys(this._fsSources).forEach((component) => {
      this.createShaderPass(component, uniforms).apply();
    });
    this._simulator.pingPong();
  }
}

module.exports = Brush;