define([
    './BackgroundLayer',
    './GuideLayer',
    './gameLayer/GameLayer'
], function (BackgroundLayer, GuideLayer, GameLayer) {
    return cc.Scene.extend({
        onEnter: function () {
            var self = this;
            self._super();

            self.addChild(new BackgroundLayer());
            self.addChild(new GuideLayer(function(){
                self.addChild(new GameLayer(function(result){
                    alert("游戏结束。你的分数是：" + result.score);
                }));
            }));
        }
    });
});
