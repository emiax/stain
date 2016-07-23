precision mediump float;

uniform vec2 pixelSize;

attribute vec2 texCoord;
varying vec2 textureCoordinates;
varying vec2 pixelCoordinates;

void main() {
  textureCoordinates = texCoord;
  pixelCoordinates = texCoord / pixelSize;
  gl_Position = vec4(texCoord * 2.0 - vec2(1.0) , 0.0, 1.0);
}