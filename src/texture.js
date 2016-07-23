import {vec2} from 'gl-matrix';
var nextId = 0;


class Texture {

  constructor(opt) {
    this._context = opt.context;
    this._id = nextId++;
    this._size = vec2.clone(opt.size);
    this._format = opt.format;
    this._precision = opt.precision;
    this._texture = null;
  }
  /**
   * Return the id of this texture.
   */
  id() {
    return this._id;
  }

  context() {
    return this._context; 
  }

  /**
   * Get size of texture (returns a vec2)
   */
  size() {
    return this._size;
  }

  texture() {
    if (!this.isAllocated()) {
      this.allocate();
    }
    return this._glTexture;
  }

  /**
   * Allocate texture on GPU.
   */
  allocate() {
    var gl = this._context.gl();
    var glTexture = gl.createTexture();

    var glInternalFormat = this.glInternalFormat();
    var glFormat = this.glFormat();
    var glPrecision = this.glPrecision();

    if (glPrecision === gl.FLOAT) {
      var floatTextures = gl.getExtension('OES_texture_float');
      if (!floatTextures) {
        console.warn('float textures are not supported');
      }
      if (!gl.getExtension("OES_texture_float_linear")) {
        console.warn("Float textures are not available.");
      }
      if (!gl.getExtension("OES_standard_derivatives")) {
        console.warn("Standard derivatives not available.");
      }
    }

    
    gl.bindTexture(gl.TEXTURE_2D, glTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, this._size[0], this._size[1], 0, glFormat, glPrecision, null);
    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);

    this._glTexture = glTexture;
  }

  /**
   * Deallocate the texture.
   */
  deallocate() {
    this.deleteFramebuffer();
    var gl = this._context.gl();
    gl.deleteTexture(this._glTexture);
  }

  /**
   * Return true if the texture is allocated on the GPU
   */
  isAllocated() {
    return !!this._glTexture;
  }

  /**
   * Return the gl enum corresponding to the texture's internal format.
   */
  glInternalFormat() {
    var gl = this._context.gl();
    return {
      'alpha': gl.ALPHA,
      'rgb': gl.RGB,
      'rgba': gl.RGBA
    }[this._format];
  }

  /**
   * Return the gl enum corresponding to the texture's format.
   */
  glFormat() {
    var gl = this._context.gl();
    return {
      'alpha': gl.ALPHA,
      'rgb': gl.RGB,
      'rgba': gl.RGBA
    }[this._format];
  }

  /**
   * Return the gl enum corresponding to the texture's precision.
   */
  glPrecision() {
    var gl = this._context.gl();
    return {
      'byte': gl.UNSIGNED_BYTE,
      'float': gl.FLOAT,
    }[this._precision];
  }


  bind() {
    var gl = this._context.gl();
    gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
  }
}




module.exports = Texture;
