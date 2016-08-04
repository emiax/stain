import WebglContext from './webglcontext'
import Simulator from './simulator';
import HeaderRenderer from './headerrenderer'
import {vec2} from 'gl-matrix';
import Stats from 'stats-js'

import RandomStainBrush from './randomstainbrush';
import ImageStainBrush from './imagestainbrush';
import StainBrush from './stainbrush';



class HeaderAnimation {
  constructor(gl, w, h) {
    let textureSize = vec2.fromValues(1920, 1080);

    let context = this._context = new WebglContext(gl);
    this._simulator = new Simulator({
      context: context,
      size: textureSize
    });

    this._simulator.setTextureCoordinatesAndForces(
      [ 0.0, 1.0, 
        0,  0,
        1.0, 0,
        0,  1.0,
        1.0, 0,
        1.0, 1.0
        ],
        [ 0, -1, 
          0, -1, 
          0, -1,
          0, -1, 
          0, -1, 
          0, -1,
        ]
    );


    this._simulator.init();

    this._headerRenderer = new HeaderRenderer({
      context: context,
      textureSize: textureSize,
      headerSize: vec2.fromValues(w, h)
    });
    
    this._stats = new Stats();
    //this._stats.setMode( 1 );
    document.body.appendChild(this._stats.domElement );
    this._stats.domElement.style.position = 'fixed';
    this._stats.domElement.style.bottom = '0'


    this._randomBrush = new RandomStainBrush({
        simulator: this._simulator
    });

    this._imageStainBrush = new ImageStainBrush({
        context: this._context,
        simulator: this._simulator,
        imageSource: 'input.png'
    });

    this._stainTimer = 0;
    this._nStains = 0;
    this._stainPosition = vec2.fromValues(200, 1);
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

      let size = Math.random() * 20;
      let amount = 0.8;
      let timerCoefficient = 1;
      if (this._nStains < 500) {
        size *= 2;
        amount *= 0.5;
        timerCoefficient * 2.0;
      }
      if (this._nStains < 100 && this._nStains % 3 === 0) {
        size *= 2;
        amount *= 0.5;
        timerCoefficient * 2.0;
      }


      if (this._stainTimer < 0) {
        if (this._imageStainBrush.isReady()) {
          this._imageStainBrush.apply(size, amount);
          this._nStains++;
        }
        this._stainTimer = Math.random() * 8 * timerCoefficient;
      }



      let stainPosition = vec2.clone(this._stainPosition);
      stainPosition[0] += Math.random() * 200 - 100;
      stainPosition[1] += Math.random() * 200 - 100;
      //this._stainBrush.apply(stainPosition);
      this._stainPosition[0] *= 1.02;
      this._stainPosition[1] += 3;

      if (this._stainPosition[0] > 1920) {
        this._stainPosition[0] = 2;
      }

      if (this._stainPosition[1] > 1080) {
        this._stainPosition[1] = 2;
      }

      this._stainTimer--;

      this._simulator.step();
      this._headerRenderer.render(this._simulator);
      //console.log('sim step!');
      requestAnimationFrame(this.step.bind(this));
      this._stats.end();
    } else {
      this._status = 'off';
    }
  }

  setSize(w, h) {
    this._headerRenderer.setHeaderSize(vec2.fromValues(w, h));
  }

  setScroll(scroll) {
    let distance = window.innerHeight/8;
    let start = window.innerHeight/8;
    let splashScreenRatio = Math.min(Math.max(0, (distance - scroll + start) / distance), 1);
    this._headerRenderer.setSplashScreenRatio(splashScreenRatio);
  }
}

module.exports = HeaderAnimation;