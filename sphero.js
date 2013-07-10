var spheroModule = require('node-sphero');

var sphero = new spheroModule.Sphero();

var energy = 0;
var last;

var rolling = false;
var intervallCounter = 0;
var intervallThreshold = 20;


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
			energy = Math.min(energy + dist/800, 255);
		}
	}

	if(energy <= 255) intervallThreshold = 2;
	if(energy <= 240) intervallThreshold = 3;
	if(energy <= 145) intervallThreshold = 8;
	if(energy <= 55) intervallThreshold = 10;
	if(energy <= 8) intervallThreshold = 12;
	if(energy <= 5) intervallThreshold = 14;
	if(energy <= 1.8) intervallThreshold = 16;
	if(energy <= 0.2) intervallThreshold = 18;
	if(energy <= 0.05) intervallThreshold = 20;

	sphero.setRGBLED(0, ((circleOpacity + energy)/2), 0, false);
	energy = Math.max(energy - 2, 0);

	//console.log(energy);

	circleSpeed = (circleSpeed + (0.1 + 7*(energy/256)))/2;

	//console.log("energy=" + energy + ", circleSpeed=" + circleSpeed + "\n");
	//document.write(energy + '\n');

	last = accel; 
});

sphero.connect();

setInterval((function() {
	if(!circleOpacity) {
		return
	}

	if(rolling === false && intervallCounter >= intervallThreshold) {
		sphero.setHeading(45).setHeading(315);
		sphero.setRGBLED(0, 255, 0, false);
		rolling = true;
		
		intervallCounter = 0;
		circleOpacity = 127 + (energy)/2;
		circleScale = 1.0;
		//circleSpeed = circleSpeed + 0.5;

		if(audioEngine != undefined) {
			audioEngine.playEffect(s_bgMusicOgg);
		}

		console.log("beat. - threshold=" + intervallThreshold + " energy=" + energy + " circleOpacity=" + circleOpacity);
	} else {
		//circleSpeed = circleSpeed - 0.5/intervallThreshold;
		rolling = false;
		intervallCounter++;
	}
}), 100);

// var jwertyModule = require('jwerty');
// var jwerty = jwertyModule.jwerty;

// jwerty.key('→', function () { energy = energy+10; console.log('up') }, '#gameCanvas');
// jwerty.key('←', function () { energy = energy-10; console.log('down') }, '#gameCanvas');

