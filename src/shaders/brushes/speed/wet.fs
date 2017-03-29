uniform sampler2D wet;

varying vec2 textureCoordinates;

void main() {
  vec4 oldValue = texture2D(wet, textureCoordinates);
  gl_FragColor = oldValue;
}