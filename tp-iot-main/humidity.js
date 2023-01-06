import axios from 'axios';
import utils from './utils.js';

// ------------ CONFIGURATION -------------
const DELAY = 5000; // Delay between frames in ms

const TEMP_MIN = 0; // Minimum humidity % x 10
const TEMP_MAX = 1000; // Maximum humidity % x 10
const THRESHOLD = 80;

const ENDPOINT = 'http://localhost:3001/api/humidity'; //Middleware Endpoint ex: http//localhost:8000/api/temperature

// ---------------- END -------------------

function sendData(data) {
	if (ENDPOINT != null && ENDPOINT != '') {
		console.log('Sending frame...');
		axios
			.post(ENDPOINT, {
				data: data,
			})
			.then((res) => {
				console.log(res.data);
			});
	} else {
		console.log('ENDPOINT is not configured.');
	}
}

function start() {
	//Generate random value and convert it into hexadecimal
	const humidity = utils.randomNumber(TEMP_MIN, TEMP_MAX);
	let code, value, frame;
	if (humidity > THRESHOLD) {
		code = utils.toByte((10).toString(16), 1);
		//Create frame
		value = utils.toByte(humidity.toString(16), 2);
		value = value + utils.toByte(THRESHOLD.toString(16), 2);
		frame = code + value;
		sendData(frame);
	}
	value = utils.toByte(humidity.toString(16), 2);
	//Add Frame
	code = utils.toByte((20).toString(16), 1);

	//Create frame
	frame = code + value;
	sendData(frame);
}

setInterval(() => start(), DELAY);
