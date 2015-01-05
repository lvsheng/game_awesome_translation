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

            //貌似HomeScene里的schedule不生效？touch事件也不行？菜单的点击事件也不行？？？？
            self.scheduleOnce(function (){alert('ok??')})
        }
    });
});
