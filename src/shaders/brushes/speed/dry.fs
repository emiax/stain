uniform sampler2D dry;

varying vec2 textureCoordinates;

void main() {
  vec4 oldValue = texture2D(dry, textureCoordinates);
  gl_FragColor = oldValue;
}