module.exports = function () {
	let output = '';
	let lineNumber = 1;
	for(let i = 0; i < arguments.length; i++) {
		let input = arguments[i];
		let lines = input.split('\n');
		output += 'precision mediump float; // ' + (lineNumber++) + '\n';
		lines.forEach((line) => {
			output += line + ' // line ' + (lineNumber++) + '\n';
		});
	}

	return output;
};