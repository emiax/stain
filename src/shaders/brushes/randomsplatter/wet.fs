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
uniform vec3 splatColor;
uniform float concentration;

void main() {
  vec2 pos = pixelCoordinates;
  float d = step(distance(pos, splatPosition), splatSize);

  vec4 oldValue = texture2D(wet, textureCoordinates);
  gl_FragColor = oldValue + d * vec4(splatColor * concentration, concentration);
}