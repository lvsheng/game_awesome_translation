/**
 * 单例
 * @author lvsheng
 * @date 2015/1/3
 */
define([
    '../gameUtil/resourceFileList',
    '../gameUtil/preload',
    '../list/listScene',
    './AnimateLayer',
    './BackgroundLayer'
], function (resourceFileList, preload, listScene, AnimateLayer, BackgroundLayer) {
    return cc.Scene.extend({
        onEnter: function () {
            var self = this;
            self._super();

            self.addChild(new BackgroundLayer());
            self.addChild(new AnimateLayer(function(){
                preload(resourceFileList['list'], function(){
                    cc.director.runScene(listScene.getInstance());
                });
            }));
        }
    });
});
