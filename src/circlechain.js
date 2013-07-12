var circleOpacity = 40;
var circleMinOpacity = 40;

var circleSpeed = 0.1;

var circleScale = 0.4;
var circleMinScale = 0.4;

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

var circleChainGame = cc.Layer.extend({
	init:function(){
		this._super();
		var s = cc.Director.getInstance().getWinSize();

		var maxX = s.width;
		var mayY = s.height;
		var countCircles = 1000;

		// tell that update function should be called per frame
		this.scheduleUpdate();
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

		// add gameLayer to layer
		this.addChild(gameLayer);
		return true;
	},
	update:function() {
		this._super();

		// decrease opacity by modifier on update
		if(circleOpacity > circleMinOpacity) {
			circleOpacity = circleOpacity - 14;
		}

		// decrease scale by modifier on update
		if(circleScale > circleMinScale) {
			circleScale = circleScale - 0.033;
		}
	},
	onKeyUp : function(key) {
		switch (key) {
		case 37: // left
			energy = energy - 5;
			determineThresholdAndSpeed();
			break;
		case 38: // up
			break;
		case 39: // right
			energy = energy + 5;
			determineThresholdAndSpeed();
			break;
		case 40: // down
			break;
		}
	}
});

//circleChainGame.onEnter