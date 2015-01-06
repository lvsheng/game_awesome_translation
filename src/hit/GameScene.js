/**
 * @author lvsheng
 * @date 2015/1/6
 */
define([
    './BackgroundLayer',
    './gameLayer/GameLayer',
    './scoreManager',
    '../commonClass/ResultLayer'
], function (BackgroundLayer, GameLayer, scoreManager, ResultLayer) {
    return cc.Scene.extend({
        onEnter: function () {
            var self = this;
            self._super();

            self.addChild(new BackgroundLayer());
            self.addChild(new GameLayer(function(result){
                result = {amount: scoreManager.getScore()};
                self.addChild(new ResultLayer("你成功打掉了" + result.amount + "个地鼠"));
            }));
        }
    });
});
