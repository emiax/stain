attribute vec2 texCoord;
attribute vec2 force;

uniform sampler2D water;
uniform sampler2D wet;
uniform sampler2D dry;

varying vec2 textureCoordinates;
varying vec2 pixelCoordinates;
varying vec2 gravity;

uniform vec2 pixelSize;

void main() {
  gl_Position = vec4(texCoord * 2.0 - vec2(1.0) , 0.0, 1.0);

  pixelCoordinates = texCoord / pixelSize;
  textureCoordinates = texCoord;
  gravity = force;
}