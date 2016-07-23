let ActiveInfo = require('./activeInfo');
let TextureUnit = require('./textureunit');

class ShaderProgram {
  constructor(opt) {
    this._vertexShader = opt.vertexShader;
    this._fragmentShader = opt.fragmentShader;
    this._context = opt.context;
    this._suppressWarnings = false;
    
    let gl = opt.context.gl();
    this._shaderProgram = gl.createProgram();
    gl.attachShader(this._shaderProgram, this._vertexShader.shader());
    gl.attachShader(this._shaderProgram, this._fragmentShader.shader());

    this._vertexShader.on('compile', this.link);
    this._fragmentShader.on('compile', this.link);
  }

  link() {
    let gl = this._context.gl();
    gl.linkProgram(this._shaderProgram);
    if (!gl.getProgramParameter(this._shaderProgram, gl.LINK_STATUS)) {
        throw gl.getProgramInfoLog(this._shaderProgram);
        //throw "Linking error.";
    }
    this.updateUniforms();
    this.updateAttributes();
  }

  updateUniforms() {
    let gl = this._context.gl();
    var nUniforms = gl.getProgramParameter(this._shaderProgram, gl.ACTIVE_UNIFORMS);
    this._uniforms = {};

    for (var i = 0; i < nUniforms; i++) {
      var activeInfo = gl.getActiveUniform(this._shaderProgram, i);
      this._uniforms[activeInfo.name] = new ActiveInfo({
        location: gl.getUniformLocation(this._shaderProgram, activeInfo.name),
        name: activeInfo.name,
        size: activeInfo.size,
        type: activeInfo.type
      });
    }
  }

  updateAttributes() {
    let gl = this._context.gl();
    var nAttributes = gl.getProgramParameter(this._shaderProgram, gl.ACTIVE_ATTRIBUTES);
    this._attributes = {};
  
    for (var i = 0; i < nAttributes; i++) {
      var activeInfo = gl.getActiveAttrib(this._shaderProgram, i);
      this._attributes[activeInfo.name] = new ActiveInfo({
        location: gl.getAttribLocation(this._shaderProgram, activeInfo.name),
        name: activeInfo.name,
        size: activeInfo.size,
        type: activeInfo.type
      });
    }
  }

  setSuppressWarnings(suppress) {
    this._suppressWarnings = suppress;
  }

  setUniform(name, value) {
    let gl = this._context.gl();
    const activeInfo = this._uniforms[name];
    if (activeInfo === undefined) {
      if (!this._suppressWarnings) {
        console.warn("no uniform with name " + name);
      }
      return;
    }

    const location = activeInfo.location();
    const type = activeInfo.type();
    const size = activeInfo.size();

    if (value instanceof TextureUnit) {
      value = value.index();
    }
    switch (type) {
      case gl.FLOAT:
        gl.uniform1f(location, value);
        break;
      case gl.FLOAT_MAT2:
        gl.uniformMatrix2f(location, false, value);
        break;
      case gl.FLOAT_MAT3:
        gl.uniformMatrix3fv(location, false, value);
        break;
      case gl.FLOAT_MAT4:
      //console.log(value);
        gl.uniformMatrix4fv(location, false, value);
        break;
      case gl.FLOAT_VEC2:
        if (size === 1) {
          gl.uniform2f(location, value[0], value[1]);
        } else {
          gl.uniform2fv(location, size, value);
        }
        break;
      case gl.FLOAT_VEC3:
        if (size === 1) {
          gl.uniform3f(location, value[0], value[1], value[2]);
        } else {
          gl.uniform3fv(location, size, value);
        }
        break;
      case gl.FLOAT_VEC4:
        if (size === 1) {
          gl.uniform4f(location, value[0], value[1], value[2], value[3]);
        } else {
          gl.uniform4fv(location, size, value);
        }
        break;
      case gl.INT:
      case gl.SAMPLER_2D:
        gl.uniform1i(location, value);
        break;
      case gl.INT_VEC2:
        if (size === 1) {
          gl.uniform2i(location, value[0], value[1]);
        } else {
          gl.uniform2iv(location, size, value);
        }
        break;
      case gl.INT_VEC3:
        if (size === 1) {
          gl.uniform3i(location, value[0], value[1], value[2]);
        } else {
          gl.uniform3iv(location, size, value);
        }
        break;
      case gl.INT_VEC4:
        if (size === 1) {
          gl.uniform4i(location, value[0], value[1], value[2], value[3]);
        } else {
          gl.uniform4iv(location, size, value);
        }
        break;
      case gl.UNSIGNED_INT:
        throw 'not implemented yet';
      break;
      default:
        throw 'not implemented yet';
      break;
    }

    //console.log(activeInfo);
    //gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
  }


  setAttribute(name, buffer, normalized, itemSize, offset) {
    if (normalized === undefined) {
      normalized = false;
    }
    if (itemSize === undefined) {
      itemSize = buffer.itemSize();
    }
    if (offset === undefined) {
      offset = 0;
    }

    let gl = this._context.gl();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer());

    let attributeData = this._attributes[name];
    if (attributeData === undefined) {
      if (!this._suppressWarnings) {
        console.warn("no attribute with name " + name);
      }
      return;
    }


    let location = attributeData.location();

    gl.vertexAttribPointer(
      location,
      itemSize,
      buffer.type() === 'float' ? gl.FLOAT : gl.FIXED,
      normalized,
      buffer.itemSize() - itemSize,
      offset);
  }


  enableVertexAttributeArray(name) {
    // todo: assert this progam is in use.
    let gl = this._context.gl();
    const activeInfo = this._attributes[name];
    if (activeInfo !== undefined)  {
      const location = activeInfo.location();
      gl.enableVertexAttribArray(location);
    }
  }


  shaderProgram() {
    return this._shaderProgram;
  }

  activate() {
    let gl = this._context.gl();
    gl.useProgram(this._shaderProgram);
  }
}


module.exports = ShaderProgram;