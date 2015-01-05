/**
 * 单例
 * @author lvsheng
 * @date 2015/1/3
 */
define([
    '../gameUtil/resourceFileMap',
    './ListLayer',
    './BackgroundLayer'
], function (resourceFileMap, ListLayer, BackgroundLayer) {
    var instance;
    var ListScene =  cc.Scene.extend({
        onEnter: function () {
            var self = this;
            self._super();

            self.addChild(new BackgroundLayer());
            self.addChild(new ListLayer());
        }
    });

    return { getInstance: function(){ return instance ? instance : (instance = new ListScene()); } };
});
