uniform vec2 texturePixelSize;
uniform vec2 headerPixelSize;

attribute vec2 vertexCoord;
varying vec2 pixelCoordinates;
varying vec2 textureCoordinates;
varying vec2 vertexCoordinates;




void main() {
  vertexCoordinates = vertexCoord;
  textureCoordinates = vertexCoordinates * 0.5 + 0.5;
  pixelCoordinates = textureCoordinates / texturePixelSize;
  gl_Position = vec4(vertexCoordinates, 0.0, 1.0);
}