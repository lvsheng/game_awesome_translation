/**
 * 单例
 * @author lvsheng
 * @date 2015/1/3
 */
define([
    '../util/preload',
    '../util/myDirector',
    './AnimateLayer',
    './BackgroundLayer'
], function (preload, myDirector, AnimateLayer, BackgroundLayer) {
    return cc.Scene.extend({
        onEnter: function () {
            $.stats.myTrack("首页");
            //alert('home scene enter');
            var canvas = document.getElementById("gameCanvas");
            //var winSize = cc.director.getWinSize();
            //alert('in Home, canvas w*h' + canvas.width + ', ' + canvas.height);
            //alert('cc.winSize w*h' + winSize.width + ', ' + winSize.height);
            //canvas.style.display = 'none';
            var self = this;
            self._super();

            self.addChild(new BackgroundLayer());
            self.addChild(new AnimateLayer(function(){
                myDirector.enterList()
            }));
        }
    });
});
