uniform vec2 stainPositions[10];
varying vec2 pixelCoordinates;
uniform float splatSize;

float splat() {

  float d = 10000000.0;
  
  for (int i = 0; i < 10; i++) {
    vec2 pos = stainPositions[i];
  	d = min(distance(pixelCoordinates, pos), d);
  }

  d += splatSize * 0.3 * snoise(pixelCoordinates * (1.0 / splatSize));
  return smoothstep(splatSize, splatSize * 0.5, d) * 0.5;
}