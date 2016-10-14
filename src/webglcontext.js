let nextId = 1;

class WebglContext {
  constructor(gl) {
    gl.getExtension('OES_texture_float');
    gl.getExtension('OES_texture_float_linear');
    gl.getExtension('OES_texture_half_float');
    gl.getExtension('OES_texture_half_float_linear');

    this._gl = gl;
    this._id = nextId++;
  }
  gl() {
    return this._gl;
  }
  id() {
    return this._id;
  }
}

module.exports = WebglContext;