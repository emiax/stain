let occupiedUnits = {};

class TextureUnit {
  constructor(texture) {
    this._texture = texture;
    this._context = texture.context();
    if (occupiedUnits[this._context.id()] === undefined) {
      occupiedUnits[this._context.id()] = [];
    }
    this.occupyNext(occupiedUnits[this._context.id()]);

    let gl = this._context.gl();
    gl.activeTexture(gl.TEXTURE0 + this._index);
    gl.bindTexture(gl.TEXTURE_2D, texture.texture());
    this._active = true;
  }

  occupyNext() {
    let ou = occupiedUnits[this._context.id()];
    let i = 0;
    while (ou[i]) i++;
    ou[i] = true; // occupy the first free unit.
    this._index = i;
  }

  release() {
    if (this._active) {
      occupiedUnits[this._context.id()][this._index] = false; // relase the unit occupied by this.
    } else {
      throw "the unit is already released";
    } 
  }

  index() {
    return this._index;
  }
}

module.exports = TextureUnit;