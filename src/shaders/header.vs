uniform vec2 texturePixelSize;
uniform vec2 headerPixelSize;

attribute vec2 vertexCoord;
varying vec2 pixelCoordinates;
varying vec2 textureCoordinates;
varying vec2 vertexCoordinates;

uniform vec2 center;
uniform float strokeWidth;
uniform vec2 boxSize;

void main() {
  vertexCoordinates = vertexCoord;


  if (abs(vertexCoord.x) < 1.0) {
    vertexCoordinates.x = center.x + sign(vertexCoord.x) * boxSize.x;
  } else {
    vertexCoordinates.x = center.x + sign(vertexCoord.x) * (boxSize.x + strokeWidth);
  }
  if (abs(vertexCoord.y) < 1.0) {
    vertexCoordinates.y = center.y + sign(vertexCoord.y) * boxSize.y;
  } else {
    vertexCoordinates.y = center.y + sign(vertexCoord.y) * (boxSize.y + strokeWidth);
  }


  vertexCoordinates *= headerPixelSize;
  vertexCoordinates = vertexCoordinates - vec2(0.5); 


  textureCoordinates = vertexCoordinates * 0.5 + 0.5;
  pixelCoordinates = textureCoordinates / texturePixelSize;
  gl_Position = vec4(vertexCoordinates, 0.0, 1.0);
}