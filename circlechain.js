var circlechain = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new circleChainGame();
        layer.init();
        this.addChild(layer);
    }
})

var circleSpeed = 3;

var circleChainGame = cc.Layer.extend({
    init:function(){
        this._super();
        var s = cc.Director.getInstance().getWinSize();

        var maxX = 1024;
        var mayY = 640;
        var countCircles = 200;

        var gameLayer = cc.LayerColor.create(new cc.Color4B(0, 0, 0, 255), maxX, mayY)
        for(i=0;i<countCircles;i++){
            var greenCircle = cc.Sprite.create("greencircle.png");
            var randomDir = Math.random()*2*Math.PI;
            
            greenCircle.cos = Math.cos(randomDir);
            greenCircle.sin = Math.sin(randomDir);

            greenCircle.xSpeed=circleSpeed*greenCircle.cos;
            greenCircle.ySpeed=circleSpeed*greenCircle.sin;

            gameLayer.addChild(greenCircle);
            greenCircle.setPosition(new cc.Point(Math.random()*maxX,Math.random()*mayY));
            greenCircle.schedule(function(){

                this.xSpeed=circleSpeed*this.cos;
                this.ySpeed=circleSpeed*this.sin;

                 this.setPosition(new cc.Point(this.getPosition().x+this.xSpeed,this.getPosition().y+this.ySpeed));
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
        this.addChild(gameLayer);
        return true;
    }
});

//circleChainGame.onEnter