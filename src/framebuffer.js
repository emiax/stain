let activeFramebuffers = {}
let nextId = 1;

class Framebuffer {
  constructor(opt) {
    this._context = opt.context;
    let gl = this._context.gl();
    this._framebuffer = gl.createFramebuffer();
    this._id = nextId++;
  }

  attachTexture(attachment, texture) {
    let gl = this._context.gl();

    let previousBinding = Framebuffer.currentBinding(this._context);
    this.bind();

    let glAttachment = gl.COLOR_ATTACHMENT0;

    if (attachment === 'color') {
      glAttachment = gl.COLOR_ATTACHMENT0;
    } else if (attachment === 'depth') {
      glAttachment = gl.DEPTH_ATTACHMENT;
    } else if (attachment === 'stencil') {
      glAttachment = gl.STENCIL_ATTACHMENT;
    } else {
      throw 'unsupported attachment "' + attachment + '"';
    }

    gl.framebufferTexture2D(gl.FRAMEBUFFER, glAttachment, gl.TEXTURE_2D, texture.texture(), 0);
    Framebuffer.bind(this._context, previousBinding);

  }

  destroy() {
    gl.deleteFramebuffer(this._framebuffer);
  }

  bind() {
    Framebuffer.bind(this._context, this);
  }

  isComplete() {
    let previousBinding = Framebuffer.currentBinding(this._context);
    this.bind();
    let gl = this._context.gl();
    let status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    Framebuffer.bind(this._context, previousBinding);
    return status;
  }

}


Framebuffer.currentBinding = function (context) {
  let contextId = context.id();
  return activeFramebuffers[contextId];
}


Framebuffer.bind = function (context, framebuffer) {
  let gl = context.gl();
  if (!framebuffer) {
    Framebuffer.bindDefault(context);
  }
  let contextId = context.id();
    if (activeFramebuffers[contextId] !== framebuffer) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer._framebuffer);
    }
    activeFramebuffers[contextId] = framebuffer;
}

Framebuffer.bindDefault = function(context) {
  let contextId = context.id();
  let gl = context.gl();
  if (activeFramebuffers[contextId] !== undefined) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    delete activeFramebuffers[contextId];
  }
}

module.exports = Framebuffer;