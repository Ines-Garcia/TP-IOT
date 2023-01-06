function randomNumber(min, max) {
	return Math.trunc(Math.random() * (max - min) + min);
}

function toByte(string, length) {
	let result = string;
	while (result.length < length * 2) {
		result = '0' + result;
	}
	return result;
}

export default { randomNumber, toByte };
