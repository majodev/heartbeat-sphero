var circleOpacity = 40;
var circleMinOpacity = 40;

var circleSpeed = 0.1;

var circleScale = 0.4;
var circleMinScale = 0.4;

var energy = 0;

var intervallCounter = 0;
var intervallThreshold = 20;

var circlechain = cc.Scene.extend({
	onEnter:function(){
		this._super();
		var layer = new circleChainGame();
		layer.init();
		this.addChild(layer);
		console.log("onEnter");

		this.keyboardArrows = {
			left : false,
			right : false,
			up : false,
			down : false
		}
	}
});

var schedule_heartbeat = function () {
	//console.log("schedule_heartbeat");
	if(typeof circleOpacity === "undefined") {
		return;
	}

	if(intervallCounter >= intervallThreshold) {
		
		intervallCounter = 0;
		circleOpacity = 127 + (energy+1)/2;
		circleScale = 1.0;

		if(typeof audioEngine === undefined) {
			console.log("beat, cannot play audio!");
		} else {
			audioEngine.playEffect(s_bgMusicOgg);
		}

		if(typeof sphero === "undefined") {
			console.log("beat, cannot communicate with sphero!");
		} else {
			sphero.setHeading(45).setHeading(315);
			sphero.setRGBLED(0, 255, 0, false);
		}

		console.log("beat. - threshold=" + intervallThreshold + " energy=" + energy + " circleOpacity=" + circleOpacity);
	} else {
		intervallCounter++;
	}
}

// todo - move this to cocos layer completely!
var determineThresholdAndSpeed = function () {
	if(energy <= 255) 	intervallThreshold = 2;
	if(energy <= 240) 	intervallThreshold = 3;
	if(energy <= 220) 	intervallThreshold = 4;
	if(energy <= 160) 	intervallThreshold = 5;
	if(energy <= 145) 	intervallThreshold = 6;
	if(energy <= 125) 	intervallThreshold = 7;
	if(energy <= 110) 	intervallThreshold = 8;
	if(energy <= 80) 		intervallThreshold = 9;
	if(energy <= 55) 		intervallThreshold = 10;
	if(energy <= 20) 		intervallThreshold = 11;
	if(energy <= 8) 		intervallThreshold = 12;
	if(energy <= 5) 		intervallThreshold = 13;
	if(energy <= 3) 		intervallThreshold = 14;
	if(energy <= 1.5) 	intervallThreshold = 15;
	if(energy <= 1) 		intervallThreshold = 16;
	if(energy <= 0.8) 	intervallThreshold = 17;
	if(energy <= 0.6) 	intervallThreshold = 18;
	if(energy <= 0.4) 	intervallThreshold = 19;
	if(energy <= 0.2) 	intervallThreshold = 20;

	circleSpeed = (circleSpeed + (0.1 + 7*(energy/256)))/2;
}

var debugLabel;

var circleChainGame = cc.Layer.extend({
	init:function(){
		this._super();
		var s = cc.Director.getInstance().getWinSize();

		var maxX = s.width;
		var mayY = s.height;
		var countCircles = 1000;

		// tell that update function should be called per frame
		this.scheduleUpdate();

		// and schedule an own function that will be called every delay
		this.schedule(schedule_heartbeat, 0.1, cc.RepeatForever(), cc.DelayTime.create(0));

		// tell that keyboard input will be captured.
		this.setKeyboardEnabled(true);

		var gameLayer = cc.LayerColor.create(new cc.Color4B(0, 0, 0, 255), maxX, mayY)
		for(i=0;i<countCircles;i++){

			// create new circle
			var greenCircle = cc.Sprite.create(s_greenCircle);

			// add circle to layer
			gameLayer.addChild(greenCircle);

			// preset position
			greenCircle.setPosition(new cc.Point(Math.random()*maxX,Math.random()*mayY));
			
			// schedule update function
			greenCircle.schedule(function(){

				// randomize dir
				var rndDir = Math.random()*2*Math.PI;
				this.xSpeed=circleSpeed*Math.cos(rndDir);
				this.ySpeed=circleSpeed*Math.sin(rndDir);

				// set alpha
				this.setOpacity(((this.getOpacity() + circleOpacity)/2) + (Math.random()*25));

				// set scale
				this.setScale(circleScale);

				// set position
				this.setPosition(new cc.Point(this.getPosition().x+this.xSpeed,this.getPosition().y+this.ySpeed));
				
				// test boundaries
				if(this.getPosition().x>maxX){
					this.setPosition(new cc.Point(this.getPosition().x-maxX,this.getPosition().y));
				}
				if(this.getPosition().x<0){
					this.setPosition(new cc.Point(this.getPosition().x+maxX,this.getPosition().y));
				}
				if(this.getPosition().y>mayY){
					this.setPosition(new cc.Point(this.getPosition().x ,this.getPosition().y-mayY));
				}
				if(this.getPosition().y<0){
					this.setPosition(new cc.Point(this.getPosition().x ,this.getPosition().y+mayY));
				}
			})
		}

		debugLabel = cc.LabelTTF.create("trying to connect with sphero...", "Helvetica", 16, cc.size(256, 32), cc.TEXT_ALIGNMENT_RIGHT);
		debugLabel.setColor(new cc.Color3B(255,0,0));
		debugLabel.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM);
		debugLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_RIGHT)
		debugLabel.setPositionX(500);
		debugLabel.setPositionY(30);
		gameLayer.addChild(debugLabel);

		// add gameLayer to layer
		this.addChild(gameLayer);


		return true;
	},
	update:function() {
		this._super();

		// decrease opacity by modifier on update
		if(circleOpacity > circleMinOpacity) {
			circleOpacity = circleOpacity - 20;
		}

		// decrease scale by modifier on update
		if(circleScale > circleMinScale) {
			circleScale = circleScale - 0.05;
		}
	},
	onKeyUp : function(key) {
		switch (key) {
		case 37: // left
			if(energy >= 5) energy = energy - 5; determineThresholdAndSpeed();
			break;
		case 38: // up
			this.resumeSchedulerAndActions();
			//this.scheduleUpdate();
			break;
		case 39: // right
			if(energy <= 250) energy = energy + 5; determineThresholdAndSpeed();
			break;
		case 40: // down
			this.pauseSchedulerAndActions();
			//this.unscheduleUpdate();
			break;
		}
	}
});

var setSpheroConnectedTextEnabled = function () {
	debugLabel.setString("sphero connected!");
	debugLabel.setColor(new cc.Color3B(0,255,0));
}

//circleChainGame.onEnter