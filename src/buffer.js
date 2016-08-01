class Buffer {
  constructor(opt) {
    this._context = opt.context;
    let gl = this._context.gl();
    this._buffer = gl.createBuffer();

    if (opt.data !== undefined && opt.usage !== undefined) {
      this.setData(opt.data, opt.usage);
    }

    this.setItemSize(opt.itemSize);
  }
  setData(data, usage) {
    let gl = this._context.gl();

    let usageEnum = {
      'static draw': gl.STATIC_DRAW,
      'dynamic draw': gl.DYNAMIC_DRAW,
      'stream draw': gl.STREAM_DRAW
    }[usage];

    if (usageEnum === undefined) {
      throw "unsupported usage.";
    }

    if (data instanceof Float32Array || data instanceof Float64Array) {
      this._type = 'float';
    } else {
      // todo: verify that array is really an integer type. (Int8Array, Uint8Array and so on...)
      this._type = 'fixed';
    }

    let buffer = this._buffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, usageEnum);
    this._size = data.length;
  } 

  setItemSize(itemSize) {
    this._itemSize = itemSize;
  }

  nItems() {
    return this._size / this._itemSize;
  }

  itemSize() {
    if (this._itemSize === undefined) {
      throw "no itemSize is set";
    }
    return this._itemSize;
  }

  buffer() {
    return this._buffer;
  }

  type() {
    return this._type;
  }

  destroy() {
    this._context.gl().glDeleteBuffer(this._buffer);
  }

}

module.exports = Buffer;