uniform vec2 stainPositions[10];
uniform float stainSizes[10];

varying vec2 pixelCoordinates;
//uniform float splatSize;
uniform float fuzziness;

float splat() {

  float minNormalizedDistance = 10000000.0;
  int closestIndex = 0;
  vec2 closestPosition = vec2(0.0, 0.0);
  float closestStainSize = 0.01;

  for (int i = 0; i < 10; i++) {
    vec2 pos = stainPositions[i];
    float size = stainSizes[i];
    //float size = stainSizes[i];
    float currentNormalizedDistance = length((pixelCoordinates - pos) / size);
    if (currentNormalizedDistance < minNormalizedDistance) {
        closestIndex = i;
        minNormalizedDistance = min(currentNormalizedDistance, minNormalizedDistance);
        closestPosition = pos;
        closestStainSize = size;
    }
  }

  vec2 centerOffset = closestPosition - pixelCoordinates;

  float len = length(centerOffset);
  len += fuzziness * len * snoise(pixelCoordinates / closestStainSize * 1.0); 

  return smoothstep(closestStainSize, closestStainSize * 0.5, len);
}