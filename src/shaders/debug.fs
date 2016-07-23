precision mediump float;

uniform sampler2D water;
uniform sampler2D wet;
uniform sampler2D dry;

varying vec2 textureCoordinates;
uniform vec2 pixelSize;


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
  vec4 waterSampleCenter = texture2D(water, textureCoordinates);
  vec4 waterSampleLeft = texture2D(water, textureCoordinates + pixelSize * vec2(-1, 0));
  vec4 waterSampleRight = texture2D(water, textureCoordinates + pixelSize * vec2(1, 0));
  vec4 waterSampleDown = texture2D(water, textureCoordinates + pixelSize * vec2(0, -1));
  vec4 waterSampleUp = texture2D(water, textureCoordinates + pixelSize * vec2(0, 1));

  vec4 wetSample = texture2D(wet, textureCoordinates);
  vec4 drySample = texture2D(dry, textureCoordinates);

  float diff = abs(waterSampleLeft.r - waterSampleRight.r);
           //+ abs(waterSampleDown.r - waterSampleUp.r);


  diff = clamp(1.0 * diff, 0.0, 0.8);

  vec4 bg = vec4(0.90, 0.90, 0.90, 1.0);
  //vec4 bg = vec4(0.0, 0.0, 0.0, 1.0);
  vec4 waterContribution = vec4(1.0, 1.0, 1.0, diff);
  vec4 dryContribution = drySample;
  vec4 wetContribution = wetSample;

  vec4 result = blend(bg, vec4(0.0));
  result = blend(dryContribution, result);
  result = blend(wetContribution, result);
  result = blend(premult(waterContribution), result);

  //result = vec4(waterSampleCenter.r, 0.0, 0.0, 1.0);

  gl_FragColor = result;
}