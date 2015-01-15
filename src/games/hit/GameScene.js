/**
 * @author lvsheng
 * @date 2015/1/6
 */
define([
    'require',
    './BackgroundLayer',
    './GuideLayer',
    './gameLayer/GameLayer',
    './scoreManager',
    '../../commonClass/MenuLayer',
    '../../util/myDirector'
], function (require, BackgroundLayer, GuideLayer, GameLayer, scoreManager, MenuLayer) {
    return cc.Scene.extend({
        onEnter: function () {
            var self = this;
            self._super();

            $.stats.myTrack("进入游戏-hit");
            $.stats.myTrack("进入游戏");
            self.addChild(new BackgroundLayer());
            self.addChild(new GuideLayer(function(){
                $.stats.myTrack("开始游戏-hit");
                $.stats.myTrack("开始游戏");
                self.addChild(new GameLayer(function(result){
                    result = scoreManager.getResult();
                    require('../../util/myDirector').enterResult('hit', result);
                }), 10);
                self.addChild(self._menuLayer = new MenuLayer(), 100);
            }));
        },
        pauseGame: function () { this._menuLayer && this._menuLayer.pauseGame(); },
        resumeGame: function () { this._menuLayer && this._menuLayer.resumeGame(); }
    });
});
