import WebglContext from './webglcontext'
import Simulator from './simulator';
import DebugRenderer from './debugrenderer'
import {vec2} from 'gl-matrix';
import Stats from 'stats-js'

import RandomSplatterBrush from './randomsplatterbrush';




class HeaderAnimation {
  constructor(gl, w, h) {
    let context = this._context = new WebglContext(gl);
    this._simulator = new Simulator({
      context: context,
      size: vec2.fromValues(1024, 1024)
    });

    this._simulator.setTextureCoordinatesAndForces(
      [ 0.5, 1.0, 
           0,  0,
           1.0, 0
        ],
        [ 0, -1, 
            0, -1, 
            0, -1,
        ]
      /*[ 0, -1, 
            Math.sqrt(2), Math.sqrt(2),
            -Math.sqrt(2), Math.sqrt(2)
        ]*/
    );

    this._simulator.init();

    this._debugRenderer = new DebugRenderer({
      context: context,
      size: vec2.fromValues(w, h)
    });
    
    this._stats = new Stats();
    //this._stats.setMode( 1 );
    document.body.appendChild(this._stats.domElement );
    this._stats.domElement.style.position = 'absolute';
    this._stats.domElement.style.top = '0'


    this._randomBrush = new RandomSplatterBrush({
        simulator: this._simulator
    });

    this._splatTimer = 0;
  }

  start() {
    if (this._status !== 'on') {
      this._status = 'on';
      requestAnimationFrame(this.step.bind(this));
    }
  }

  stop() {
    this._status = 'stop';
  }

  step() {
    if (this._status === 'on') {
      this._stats.begin();

      if (this._splatTimer < 0) {
        this._randomBrush.apply();
        this._splatTimer = 1 + Math.random() * 2;
      }
      this._splatTimer--;

      this._simulator.step();
      this._debugRenderer.render(this._simulator);
      //console.log('sim step!');
      requestAnimationFrame(this.step.bind(this));
      this._stats.end();
    } else {
      this._status = 'off';
    }
  }

  setSize(w, h) {
    this._debugRenderer.setSize(vec2.fromValues(w, h));
  }
}

module.exports = HeaderAnimation;