uniform sampler2D water;
uniform sampler2D wet;
uniform sampler2D dry;

uniform float dryingSpeed;
uniform float diffusionFactor;

uniform vec2 pixelSize;
varying vec2 gravity;
varying vec2 textureCoordinates;
varying vec2 pixelCoordinates;

uniform float time;

float advectionFactor(float water) {
  return clamp(smoothstep(0.2, 1.0, water) * 0.8, 0.0, 0.6);
}

vec4 dryOut(vec4 wetIn) {
  float amountIn = wetIn.a;
  float amountOut = max(0.0, amountIn - dryingSpeed);
  if (amountIn > 0.0) {
    float remainFactor = amountOut / amountIn;
    return remainFactor * wetIn;
  } else {
    return wetIn;
  }
}

float diffusion(float waterA, float waterB) {
  return smoothstep(0.0, 1.0, waterA) * smoothstep(0.0, 1.0, waterB);
}

vec4 addWet(vec4 a, vec4 b) {
  //float concentration = a.a + b.a;
  //vec3 pigment = (a.rgb * a.a + b.rgb * b.a) / concentration;
  //return vec4(pigment, concentration);
  return a + b;
}

void main() {
 
  vec2 displacement = pixelSize * gravity;
  

  float waterSampleHere = texture2D(water, textureCoordinates).r;
  float waterSampleAbove = texture2D(water, textureCoordinates - displacement).r;

  vec4 wetSampleHere = texture2D(wet, textureCoordinates);
  vec4 wetSampleAbove = texture2D(wet, textureCoordinates - displacement);


  float waterAmount = waterSampleHere;
  vec4 wetSampleFromHere = dryOut(wetSampleHere); 
  vec4 wetSampleFromAbove = dryOut(wetSampleAbove);
  
  wetSampleFromHere *= (1.0 - advectionFactor(waterSampleHere));
  wetSampleFromAbove *= advectionFactor(waterSampleAbove);

  vec4 wetAmount = addWet(wetSampleFromHere, wetSampleFromAbove);
  float leftWater = texture2D(water, textureCoordinates + pixelSize * vec2(-1.0, 0.0)).r;
  float rightWater = texture2D(water, textureCoordinates + pixelSize * vec2(1.0, 0.0)).r;
  float downWater = texture2D(water, textureCoordinates + pixelSize * vec2(0.0, -1.0)).r;
  float upWater = texture2D(water, textureCoordinates + pixelSize * vec2(0.0, 1.0)).r;

  vec4 leftWet = texture2D(wet, textureCoordinates + pixelSize * vec2(-1.0, 0.0));
  vec4 rightWet = texture2D(wet, textureCoordinates + pixelSize * vec2(1.0, 0.0));
  vec4 downWet = texture2D(wet, textureCoordinates + pixelSize * vec2(0.0, -1.0));
  vec4 upWet = texture2D(wet, textureCoordinates + pixelSize * vec2(0.0, 1.0));

  float df = diffusionFactor;

  float leftDiffusionFactor = clamp(df * diffusion(waterAmount, leftWater), 0.0, 0.25);
  float rightDiffusionFactor = clamp(df * diffusion(waterAmount, rightWater), 0.0, 0.25);
  float downDiffusionFactor = clamp(df * diffusion(waterAmount, downWater), 0.0, 0.25);
  float upDiffusionFactor = clamp(df * diffusion(waterAmount, upWater), 0.0, 0.25);
  float noDiffusionFactor = (1.0 - (leftDiffusionFactor + rightDiffusionFactor + downDiffusionFactor + upDiffusionFactor));

  vec4 noDiffusion = vec4(wetAmount.rgb, wetAmount.a) * noDiffusionFactor;
  vec4 diffusionFromLeft = vec4(leftWet.rgb, leftWet.a) * leftDiffusionFactor;
  vec4 diffusionFromRight = vec4(rightWet.rgb, rightWet.a)  * rightDiffusionFactor;
  vec4 diffusionFromDown = vec4(downWet.rgb, downWet.a) * downDiffusionFactor;
  vec4 diffusionFromUp = vec4(upWet.rgb, upWet.a) * upDiffusionFactor;

  wetAmount = noDiffusion + diffusionFromLeft + diffusionFromRight + diffusionFromDown + diffusionFromUp;  

  wetAmount = max(vec4(0.0), wetAmount);
  
    gl_FragColor = wetAmount;
}