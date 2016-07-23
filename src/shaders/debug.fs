precision mediump float;

uniform sampler2D water;
uniform sampler2D wet;
uniform sampler2D dry;

varying vec2 textureCoordinates;
varying vec2 pixelCoordinates;
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
             + abs(waterSampleDown.r - waterSampleUp.r);


  diff = clamp(0.2 * diff, 0.0, 0.2);

  vec4 bg1 = vec4(0.96, 0.96, 0.96, 1.0);
  vec4 bg2 = vec4(0.98, 0.98, 0.98, 1.0);

  vec4 bg = mix(bg1, bg2, snoise(pixelCoordinates * 0.005)
                  + 0.5 * snoise(pixelCoordinates * 0.01)
                  + 0.25 * snoise(pixelCoordinates * 0.02));


  //vec4 bg = vec4(0.0, 0.0, 0.0, 1.0);
  vec4 waterContribution = vec4(1.0, 1.0, 1.0, diff);
  vec4 dryContribution = drySample;
  vec4 wetContribution = wetSample;

  vec4 result = blend(bg, vec4(0.0));
  result = blend(dryContribution, result);
  result = blend(wetContribution, result);
  result = blend(premult(waterContribution), result);

  //result = vec4(waterSampleCenter.r * 0.5, waterSampleCenter.r - 1.0, waterSampleCenter.r - 2.0, 1.0);


  gl_FragColor = result;
}