uniform sampler2D water;

uniform float dryingSpeed;
uniform float evaporationSpeed;
uniform float diffusionFactor;

uniform vec2 pixelSize;
varying vec2 gravity;
varying vec2 textureCoordinates;




float evaporate(float waterIn, vec2 coords) {
  float waterOut = max(0.0, waterIn - evaporationSpeed);
  return waterOut;
}

float advectionFactor(float water) {
  //water = clamp(water, 0.0, 1.0);
  return smoothstep(0.2, 0.8, water) * 0.8;
}

float diffusion(float waterA, float waterB) {
  //return smoothstep(0.0, 1.0, waterA) * smoothstep(0.0, 1.0, waterB);
  return min(waterA * waterB, 0.25);
}

void main() {
  vec2 displacement = pixelSize * gravity;
  
  float waterSampleHere = texture2D(water, textureCoordinates).r;
  float waterSampleAbove = texture2D(water, textureCoordinates - displacement).r;

  float waterHere = evaporate(waterSampleHere, textureCoordinates);
  float waterAbove = evaporate(waterSampleAbove, textureCoordinates);

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

  gl_FragColor = vec4(waterAmount, 0.0, 0.0, 0.0);
}