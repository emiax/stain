let Texture = require('./texture');
let TextureUnit = require('./textureunit');
let Framebuffer = require('./framebuffer');

class ShaderPass {
  constructor(opt) {
    this._uniforms = opt.uniforms || {};
    this._attributes = opt.attributes || {};
    this._framebuffer = opt.framebuffer;
    this._program = opt.program;
    this._drawFunction = opt.drawFunction;
    this._context = opt.context;
  }

  setUniform(key, value) {
    this._uniforms[key] = value;
  }

  setAttribute(key, value) {
    this._attributes[key] = value;
  }

  setProgram(value) {
    this._program = program;
  }

  setFramebuffer(value) {
    this._framebuffer = value;
  }

  setDrawFunction(value) {
    this._drawFunction = value;
  }

  apply() {
    if (this._framebuffer === undefined) {
      Framebuffer.bindDefault(this._context);
    } else {
      this._framebuffer.bind();
    }
    let program = this._program;
    this._program.activate();
    let textureUnits = [];

    Object.keys(this._uniforms).forEach((uniformName) => {
      let uniformValue = this._uniforms[uniformName];
      if (uniformValue instanceof Texture) {
        var unit = new TextureUnit(uniformValue);
        textureUnits.push(unit);
        program.setUniform(uniformName, unit);
      } else {
        program.setUniform(uniformName, uniformValue);
      }
    });

    Object.keys(this._attributes).forEach((attributeName) => {
      let attributeValue = this._attributes[attributeName];
      program.enableVertexAttributeArray(attributeName);
      program.setAttribute(attributeName, attributeValue);
    });

    this._drawFunction();

    textureUnits.forEach((unit) => {
      unit.release();
    });
  }
}

module.exports = ShaderPass;