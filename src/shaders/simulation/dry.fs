uniform sampler2D water;
uniform sampler2D wet;
uniform sampler2D dry;

uniform float dryingSpeed;

uniform vec2 pixelSize;
varying vec2 gravity;
varying vec2 textureCoordinates;



/**
 * Blend in src behind dst
 * background is premultiplied
 * contrib is premultiplied
 */
vec4 blend(vec4 contrib, vec4 background) {
  vec4 result = vec4(0.0);
    result.rgb = contrib.rgb + (1.0 - contrib.a) * background.rgb;
    result.a = contrib.a + (1.0 - contrib.a) * background.a;
    return result;
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
  

  vec4 wetSample = texture2D(wet, textureCoordinates);
  vec4 drySample = texture2D(dry, textureCoordinates);

  vec4 remainingWet = dryOut(wetSample);
  vec4 dried = wetSample - remainingWet;

    gl_FragColor = blend(dried, drySample);
}