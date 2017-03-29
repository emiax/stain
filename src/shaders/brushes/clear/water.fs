uniform float evaporationSpeed;
uniform float dryingSpeed;

void main() {
  gl_FragColor = vec4(0.0, evaporationSpeed, dryingSpeed, 0.0);
}