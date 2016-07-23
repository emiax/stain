uniform sampler2D water;
uniform sampler2D wet;
uniform sampler2D dry;

uniform float dryingSpeed;
uniform float evaporationSpeed;
uniform float diffusionFactor;

uniform vec2 pixelSize;
varying vec2 gravity;
varying vec2 textureCoordinates;




float evaporate(float waterIn) {
  float waterOut = max(0.0, waterIn - evaporationSpeed);
  return waterOut;
}

float advectionFactor(float water) {
  return clamp(smoothstep(0.2, 1.0, water) * 0.8, 0.0, 0.6);
}

void main() {
  vec2 displacement = pixelSize * gravity;
  
  float waterSampleHere = texture2D(water, textureCoordinates).r;
  float waterSampleAbove = texture2D(water, textureCoordinates - displacement).r;

  float waterHere = evaporate(waterSampleHere);
  float waterAbove = evaporate(waterSampleAbove);

  float waterAmount = waterHere * (1.0 - advectionFactor(waterHere)) + waterAbove * advectionFactor(waterAbove);


  float left = texture2D(water, textureCoordinates + pixelSize * vec2(-1.0, 0.0)).r;
  float right = texture2D(water, textureCoordinates + pixelSize * vec2(1.0, 0.0)).r;
  float down = texture2D(water, textureCoordinates + pixelSize * vec2(0.0, -1.0)).r;
  float up = texture2D(water, textureCoordinates + pixelSize * vec2(0.0, 1.0)).r;

  float waterDiffusionFactor = diffusionFactor * waterAmount;
  waterAmount = (1.0 - waterDiffusionFactor) * waterAmount + waterDiffusionFactor * 0.25 * (left + right + down + up);


  gl_FragColor = vec4(waterAmount, 0.0, 0.0, 0.0);
}