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


vec4 addWet(vec4 a, vec4 b) {
  return a + b;
}

void main() {
  vec2 pos = pixelCoordinates;
    float d = splat(pixelCoordinates, splatPosition, splatSize);

  vec4 oldValue = texture2D(wet, textureCoordinates);
  gl_FragColor = addWet(oldValue, d * splatWater * concentration * vec4(splatColor, 1.0));
}