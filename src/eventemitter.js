class EventEmitter {
  constructor() {
    this._callbacks = {};
  }
  /**
   * Emit an event with the name 'name'.
   * Invoke listed callbacks with 'data' as parameter.
   */
  emit(name, data) {
    var callbacks = this._callbacks[name];
    if (callbacks === undefined) {
      return;
    }
    callbacks.forEach((callback) => {
      callback(data);
    })
  }
  /**
   * Add event listener
   */
  on(name, callback) {    
    if (this._callbacks[name] === undefined) {
      this._callbacks[name] = [];
    }
    this._callbacks[name].push(callback);
  }
  /**
   * Remove event listener
   */
  off(name, callback) {
    var callbacks = this._callbacks[name];
    if (callbacks === undefined) {
      return;
    }
    for (var i = callbacks.length - 1; i >= 0; i--) {
      if (callbacks[i] === callback) {
        callbacks.splice(i, 1);
      }
    }
  }
}

module.exports = EventEmitter;