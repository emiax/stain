uniform sampler2D wet;
uniform sampler2D dry;

uniform float dryingSpeed;

uniform vec2 pixelSize;
varying vec2 gravity;
varying vec2 textureCoordinates;
varying vec2 pixelCoordinates;



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
  float ds = dryingSpeed * (0.7 + 0.3 * snoise(pixelCoordinates * 0.5));
  return wetIn * (1.0 - ds);
}

/*
  float amountIn = wetIn.a;
  float ds = dryingSpeed * (0.7 + 0.3 * snoise(pixelCoordinates * 0.5));
  float amountOut = max(0.0, amountIn - ds);
  if (amountIn > 0.0) {
    float remainFactor = amountOut / amountIn;
    return wetIn * remainFactor;
  } else {
    return wetIn;
  }
}*/

void main() { 
  

  vec4 wetSample = texture2D(wet, textureCoordinates);
  vec4 drySample = texture2D(dry, textureCoordinates);

  vec4 remainingWet = dryOut(wetSample);
  vec4 dried = wetSample - remainingWet;
  dried = clamp(dried, vec4(0.0), vec4(1.0));
  drySample = clamp(drySample, vec4(0.0), vec4(1.0));

    gl_FragColor = blend(dried, drySample);
}