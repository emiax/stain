// water texture:
// r: water amount
// g: evaporation speed
// b: drying speed
// w: reserved for future use
uniform sampler2D water;

//uniform float dryingSpeed;
//uniform float evaporationSpeed;
uniform float diffusionFactor;

uniform vec2 pixelSize;
varying vec2 gravity;
varying vec2 textureCoordinates;


float evaporate(float waterIn, vec2 coords, float evaporationSpeed) {
  float waterOut = max(0.0, waterIn - evaporationSpeed);
  return waterOut;
}

float advectionFactor(float water) {
  return smoothstep(0.2, 0.8, water) * 0.8;
}

float diffusion(float waterA, float waterB) {
  return min(waterA * waterB, 0.25);
}

void main() {
  vec2 displacement = pixelSize * gravity;
  
  vec4 waterTextureSampleHere = texture2D(water, textureCoordinates);
  vec4 waterTextureSampleAbove = texture2D(water, textureCoordinates - displacement);

  float waterSampleHere = waterTextureSampleHere.r;
  float waterSampleAbove = waterTextureSampleAbove.r;

  float evaporationSpeed = waterTextureSampleHere.g;
  float dryingSpeed = waterTextureSampleHere.b;

  float waterHere = evaporate(waterSampleHere, textureCoordinates, evaporationSpeed);
  float waterAbove = evaporate(waterSampleAbove, textureCoordinates, evaporationSpeed);

  float waterAmount = waterHere * (1.0 - advectionFactor(waterHere))
                    + waterAbove * advectionFactor(waterAbove);

  float left = texture2D(water, textureCoordinates + pixelSize * vec2(-1.0, 0.0)).r;
  float right = texture2D(water, textureCoordinates + pixelSize * vec2(1.0, 0.0)).r;
  float down = texture2D(water, textureCoordinates + pixelSize * vec2(0.0, -1.0)).r;
  float up = texture2D(water, textureCoordinates + pixelSize * vec2(0.0, 1.0)).r;

  float leftDiffusionFactor = diffusion(waterAmount, left);
  float rightDiffusionFactor = diffusion(waterAmount, right);
  float downDiffusionFactor = diffusion(waterAmount, down);
  float upDiffusionFactor = diffusion(waterAmount, up);
  float noDiffusionFactor = (1.0 - leftDiffusionFactor - rightDiffusionFactor - downDiffusionFactor - upDiffusionFactor);

  waterAmount = (1.0 - diffusionFactor) * waterAmount +
              diffusionFactor *
                (noDiffusionFactor * waterAmount
                + leftDiffusionFactor * left
                + rightDiffusionFactor * right
                + downDiffusionFactor * down
                + upDiffusionFactor * up);


  waterAmount = max(0.0, waterAmount);
  waterAmount = min(0.5, waterAmount);

  gl_FragColor = vec4(waterAmount, waterTextureSampleHere.gba);
}