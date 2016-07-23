let EventEmitter = require('./eventemitter');

class Shader {
  constructor(opt) {
    this._context = opt.context;
    this.setType(opt.type);
    this.init();
    this.setSource(opt.source);
    
    this._needsCompilation = true;
    this._emitter = new EventEmitter();
    if (opt.context && opt.type && opt.source) {
      this.compile();
    }
  }

  setType(type) {
    switch (type) {
      case "vertex":
      case "fragment":
        this._type = type;
        break;
      default:
        throw "invalid shader type " + type;
        break;
    }
  }

  gl() {
    return this._context.gl();
  }

  setSource(source) {
    this._source = source;
    this._needsCompilation = true;
    this.gl().shaderSource(this._shader, source);
  }

  init() {
    const gl = this._context.gl();
    const type = this._type;
    if (type == 'fragment') {
      this._shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == 'vertex') {
      this._shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      throw "shader type not set properly.";
    }
  }

  compile() {
    var gl = this.gl();
    gl.compileShader(this._shader);
    if (gl.getShaderParameter(this._shader, gl.COMPILE_STATUS)) {
      this._needsCompilation = false;
      this._emitter.emit('compile');
    } else {
      console.error(this._source);
      throw gl.getShaderInfoLog(this._shader);
    }
  }

  shader() {
    return this._shader;
  }

  on() {
    this._emitter.on.apply(this._emitter, arguments);
  }

  off() {
    this._emitter.off.apply(this._emitter, arguments);
  }

}

module.exports = Shader;
