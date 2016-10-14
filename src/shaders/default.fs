precision mediump float;

uniform sampler2D wet;
uniform sampler2D dry;

varying vec2 textureCoordinates;
varying vec2 pixelCoordinates;
uniform vec2 headerPixelSize;
uniform vec2 texturePixelSize;

uniform vec3 backgroundColor;


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

vec4 premult(vec4 color) {
  return vec4(vec3(color.rgb * color.a), color.a);
}

void main() {
  vec4 wetSample = texture2D(wet, textureCoordinates);
  vec4 drySample = texture2D(dry, textureCoordinates);

  vec4 bg = vec4(backgroundColor, 1.0);

  vec4 dryContribution = drySample;
  vec4 wetContribution = wetSample;

  if (wetContribution.a > 1.0) {
    wetContribution /= wetContribution.a;
  }

  vec4 result = blend(bg, vec4(0.0));
  result = blend(0.75 * dryContribution, result);
  result = blend(wetContribution, result);

  gl_FragColor = result;
}