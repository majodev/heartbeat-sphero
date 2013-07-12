var last;

var spheroModule = require('node-sphero');

var sphero;


initSphero = function () {
	 sphero = new spheroModule.Sphero();

	sphero.on('connected', function() {
	 	console.log("Sphero connected!");
		sphero.setStabilization(true);
		sphero.setDataStreaming([
			sphero.sensors.accelerometer_x,
			sphero.sensors.accelerometer_y,
			sphero.sensors.accelerometer_z
		]);
	});

	sphero.on('notification', function(message) {
		var accel = {
			x: message.DATA.readInt16BE(0),
			y: message.DATA.readInt16BE(2),
			z: message.DATA.readInt16BE(4)
		};

		if (last) {
			var dx = accel.x - last.x;
			var dy = accel.y - last.y;
			var dz = accel.z - last.z;
			var dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

			energy = Math.min(energy + dist/600, 255);
		}

		sphero.setRGBLED(0, ((circleOpacity + energy)/2), 0, false);
		
		determineThresholdAndSpeed();
		energy = Math.max(energy-2, 0); // manually decrease it if so high
		last = accel; 
	});

	sphero.on('error', function (error) {
		console.log("sphero error on connection!");
		reconnect();
	});
}

reconnect = function () {
	console.log("trying to reconnect with sphero...")

	// close it
	sphero.close();

	// init a new one
	initSphero();

	// try to reconnect...
	sphero.connect();
}

// init and connect for the first time...
initSphero();
sphero.connect();