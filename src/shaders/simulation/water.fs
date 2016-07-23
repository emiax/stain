uniform sampler2D water;
uniform sampler2D wet;
uniform sampler2D dry;

uniform float dryingSpeed;

uniform vec2 pixelSize;
varying vec2 gravity;
varying vec2 textureCoordinates;



float evaporate(float waterIn) {
  float waterOut = max(0.0, waterIn - dryingSpeed);
  return waterOut;
}

float advectionFactor(float water) {
  return clamp(smoothstep(0.2, 1.2, water), 0.0, 1.0);
}


void main() {
  vec2 displacement = pixelSize * gravity;
  
  float waterSampleHere = texture2D(water, textureCoordinates).r;
  float waterSampleAbove = texture2D(water, textureCoordinates - displacement).r;

  float waterHere = evaporate(waterSampleHere);
  float waterAbove = evaporate(waterSampleAbove);

  float waterAmount = waterHere * (1.0 - advectionFactor(waterHere)) + waterAbove * advectionFactor(waterAbove);

  
  gl_FragColor = vec4(waterAmount, 0.0, 0.0, 0.0);
}