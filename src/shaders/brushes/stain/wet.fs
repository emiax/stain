uniform sampler2D water;
uniform sampler2D wet;
uniform sampler2D dry;

uniform vec2 splatPosition;
uniform float splatWater;

uniform vec2 pixelSize;
varying vec2 textureCoordinates;

uniform vec3 color;
uniform float concentration;

uniform sampler2D inputTexture;
uniform vec2 inputPosition;


vec4 addWet(vec4 a, vec4 b) {
  return a + b;
}

void main() {
  float dryCoefficient = 1.0;

  float d = splat();

  vec4 oldValue = texture2D(wet, textureCoordinates);
  gl_FragColor = addWet(oldValue, d * splatWater * concentration * dryCoefficient * vec4(color, 1.0));
}