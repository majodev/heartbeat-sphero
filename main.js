var cocos2dApp = cc.Application.extend({
	config:document.ccConfig,
	ctor:function (scene) {
			this._super();
			this.startScene = scene;
			cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
			cc.initDebugSetting();
			cc.setup(this.config['tag']);
			cc.AppController.shareAppController().didFinishLaunchingWithOptions();
	},
	applicationDidFinishLaunching:function () {
		if(cc.RenderDoesnotSupport()){
				//show Information to user
				alert("Browser doesn't support WebGL");
				return false;
		}
		// initialize director
		var director = cc.Director.getInstance();

		// turn on display FPS
		director.setDisplayStats(this.config['showFPS']);

		// set FPS. the default value is 1.0/60 if you don't call this
		director.setAnimationInterval(0.5 / this.config['frameRate']);

		//load resources
		cc.LoaderScene.preload(g_ressources, function () {
			director.replaceScene(new this.startScene());
		}, this);

		return true;
	}
});

var myApp = new cocos2dApp(circlechain);
var audioEngine = cc.AudioEngine.getInstance();

// add method for resizing via scaling, code from http://cocos2d-x.org/boards/19/topics/31205
myApp.adjustSizeForWindow = function () {
				var margin = document.documentElement.clientWidth - document.body.clientWidth;
				if (document.documentElement.clientWidth < cc.originalCanvasSize.width) {
						cc.canvas.width = cc.originalCanvasSize.width;
				} else {
						cc.canvas.width = document.documentElement.clientWidth - margin;
				}
				if (document.documentElement.clientHeight < cc.originalCanvasSize.height) {
						cc.canvas.height = cc.originalCanvasSize.height;
				} else {
						cc.canvas.height = document.documentElement.clientHeight - margin;
				}
				var xScale = cc.canvas.width / cc.originalCanvasSize.width;
				var yScale = cc.canvas.height / cc.originalCanvasSize.height;
				if (xScale > yScale) {
						xScale = yScale;
				}
				cc.canvas.width = cc.originalCanvasSize.width * xScale;
				cc.canvas.height = cc.originalCanvasSize.height * xScale;
				var parentDiv = document.getElementById("Cocos2dGameContainer");
				if (parentDiv) {
						parentDiv.style.width = cc.canvas.width + "px";
						parentDiv.style.height = cc.canvas.height + "px";
				}
				cc.renderContext.translate(0, cc.canvas.height);
				cc.renderContext.scale(xScale, xScale);
				cc.Director.getInstance().setContentScaleFactor(xScale);
				console.log( 'adjustSizeForWindow(), scaleFactor = ' + xScale );
		};

// event handler for resizing the window (via js window event onresize)
window.onresize=function(){
	console.log("resize");
	myApp.adjustSizeForWindow();
};

