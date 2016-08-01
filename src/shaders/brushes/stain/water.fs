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
  float d = splat(pixelCoordinates, splatPosition, splatSize);

  vec4 oldValue = texture2D(water, textureCoordinates);
  gl_FragColor = oldValue + vec4(d * splatWater, 0.0, 0.0, 1.0);
}