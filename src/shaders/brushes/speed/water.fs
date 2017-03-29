uniform sampler2D water;
uniform float evaporationSpeed;
uniform float dryingSpeed;

varying vec2 textureCoordinates;

void main() {
  vec4 oldValue = texture2D(water, textureCoordinates);
  gl_FragColor = vec4(oldValue.r, evaporationSpeed, dryingSpeed, oldValue.a);
}