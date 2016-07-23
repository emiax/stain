attribute vec2 texCoord;
varying vec2 textureCoordinates;

void main() {
  textureCoordinates = texCoord;
  gl_Position = vec4(texCoord * 2.0 - vec2(1.0) , 0.0, 1.0);
}