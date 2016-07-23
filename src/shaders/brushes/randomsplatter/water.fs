precision mediump float;

uniform sampler2D water;
uniform sampler2D wet;
uniform sampler2D dry;

uniform vec2 splatPosition;
uniform float splatWater;
uniform float splatSize;

uniform vec2 pixelSize;

varying vec2 textureCoordinates;
varying vec2 pixelCoordinates;

void main() {
  vec2 pos = pixelCoordinates;
  float d = smoothstep(splatSize, splatSize * 0.5, distance(pos, splatPosition));

  vec4 oldValue = texture2D(water, textureCoordinates);
  gl_FragColor = oldValue + vec4(d * splatWater, 0.0, 0.0, 1.0);
}