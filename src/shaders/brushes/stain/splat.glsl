float splat(vec2 pixelCoords, vec2 pos, float size) {

  float d = 10000000.0;
  //float closest = vec2();
  for (int i = 0; i < 10; i++) {
  	vec2 manipulatedPos = pos + 100.0 * vec2(snoise(pos + vec2(float(i))), 
  	                                        snoise(pos - vec2(float(i))));
  	d = min(distance(pixelCoords, manipulatedPos), d);

  }


  //float d = distance(pixelCoords, pos);
  d += size * 0.3 * snoise(pixelCoords * (1.0 / size));
  return smoothstep(size, size * 0.5, d) * 0.5;
}