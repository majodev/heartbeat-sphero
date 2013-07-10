(function () {
    var d = document;
    var c = {
        menuType:"canvas",
            COCOS2D_DEBUG:2, // full debug mode
        box2d:false, // no physics in this game
        chipmunk: false, // no chipmunk engine
        showFPS:true, // let's show the FPS meter
        frameRate:60, // 60 frames per second
        loadExtension:false,
        renderMode:1,       //Choose of RenderMode: 0(default), 1(Canvas only), 2(WebGL only)
        tag:"gameCanvas", // id of the canvas element
        engineDir:"./cocos2d/", // path to your cocos2d installation
        //SingleEngineFile:'',
        appFiles:["circlechain.js"] // path to the main game file
    };
    window.addEventListener('DOMContentLoaded', function () {
        var s = d.createElement("script");
        s.src = c.engineDir + "platform/jsloader.js";
        d.body.appendChild(s);
        s.c = c;
        s.id = "cocos2d-html5";
        document.ccConfig = c;
    });
})();