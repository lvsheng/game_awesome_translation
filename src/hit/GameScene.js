/**
 * @author lvsheng
 * @date 2015/1/6
 */
define([
    './BackgroundLayer',
    './gameLayer/GameLayer'
], function (BackgroundLayer, GameLayer) {
    return cc.Scene.extend({
        onEnter: function () {
            var self = this;
            self._super();

            self.addChild(new BackgroundLayer());
            self.addChild(new GameLayer());
        }
    });
});
