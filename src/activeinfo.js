class ActiveInfo {
  constructor(opt) {
    this._name = opt.name;
    this._location = opt.location;
    this._type = opt.type;
    this._size = opt.size;
  }
  location() {
    return this._location;
  }
  type() {
    return this._type;
  }
  size() {
    return this._size;
  }
}

module.exports = ActiveInfo;