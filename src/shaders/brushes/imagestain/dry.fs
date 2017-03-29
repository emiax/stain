uniform sampler2D water;
uniform sampler2D wet;
uniform sampler2D dry;

varying vec2 textureCoordinates;

void main() {
  gl_FragColor = texture2D(dry, textureCoordinates); // do not affect this layer at all.
}