/**
 * 单例
 * @author lvsheng
 * @date 2015/1/3
 */
define([
    '../gameUtil/resourceFileMap',
    '../mainScene',
    './AnimateLayer',
    './BackgroundLayer'
], function (resourceFileMap, mainScene, AnimateLayer, BackgroundLayer) {
    return cc.Scene.extend({
        onEnter: function () {
            var self = this;
            self.addChild(new BackgroundLayer());
            self.addChild(new AnimateLayer(function(){
                cc.director.runScene(mainScene.getInstance());
            }));
        }
    });
});
