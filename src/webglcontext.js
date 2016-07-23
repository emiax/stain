let nextId = 1;

class WebglContext {
  constructor(gl) {
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