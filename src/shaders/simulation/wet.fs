precision mediump float;

uniform sampler2D water;
uniform sampler2D wet;
uniform sampler2D dry;

uniform float dryingSpeed;

uniform vec2 pixelSize;
varying vec2 gravity;
varying vec2 textureCoordinates;

float advectionFactor(float water) {
  return clamp(smoothstep(0.2, 1.0, water), 0.0, 1.0);
}

vec4 dryOut(vec4 wetIn) {
  float amountIn = wetIn.a;
  float amountOut = max(0.0, amountIn - dryingSpeed);
  if (amountIn > 0.0) {
    float remainFactor = amountOut / amountIn;
    return wetIn * remainFactor;
  } else {
    return wetIn;
  }
}


void main() {
 
  vec2 displacement = pixelSize * gravity;
  
  float waterSampleHere = texture2D(water, textureCoordinates).r;
  float waterSampleAbove = texture2D(water, textureCoordinates - displacement).r;

  vec4 wetSampleHere = texture2D(wet, textureCoordinates);
  vec4 wetSampleAbove = texture2D(wet, textureCoordinates - displacement);


  vec4 wetAmount = dryOut(wetSampleHere) * (1.0 - advectionFactor(waterSampleHere))
                 + dryOut(wetSampleAbove) * advectionFactor(waterSampleAbove);
  
    gl_FragColor = wetAmount;
}