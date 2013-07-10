var spheroModule = require('node-sphero');
var sphero = new spheroModule.Sphero();

var energy = 0;
var last;

var rolling = false;

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

		if (dist > 100) {
			energy = Math.min(energy + dist/400, 255);
		}
	}

	sphero.setRGBLED(0, 0, energy, false);
	energy = Math.max(energy - 2, 0);

	//console.log(energy);

	circleSpeed = 0.2 + 7*(energy/256);

	//console.log("energy=" + energy + ", circleSpeed=" + circleSpeed + "\n");
	//document.write(energy + '\n');

	last = accel; 
});

setInterval((function() {
	if(rolling === false) {
		sphero.setHeading(45).setHeading(315);
		rolling = true;
	} else {
		//disable and reset heartbeat timing
		rolling = false;
	}
}), 1000);

//sphero.on('error', function() {
//	sphero.connect();
//});


sphero.connect();