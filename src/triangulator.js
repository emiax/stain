import earcut from 'earcut';
import Buffer from './buffer'

class Triangulator {
	constructor() {
	}

	triangulate(vertices, holes) {
		let indices = earcut(vertices, holes);
		let vertexArray = [];
		indices.forEach((index) => {
			vertexArray.push(vertices[index * 2]);
			vertexArray.push(vertices[index * 2 + 1]);
		});
  		return vertexArray;
	}

}

module.exports = Triangulator;