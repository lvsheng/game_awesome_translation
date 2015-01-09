/**
 * @author lvsheng
 * @date 2015/1/6
 */
define([
    './BackgroundLayer',
    './GuideLayer',
    './gameLayer/GameLayer',
    './scoreManager',
    '../../commonClass/ResultLayer',
    '../../commonClass/MenuLayer'
], function (BackgroundLayer, GuideLayer, GameLayer, scoreManager, ResultLayer, MenuLayer) {
    return cc.Scene.extend({
        onEnter: function () {
            var self = this;
            self._super();

            $.stats.myTrack("进入游戏-hit");
            self.addChild(new BackgroundLayer());
            self.addChild(new GuideLayer(function(){
                $.stats.myTrack("开始游戏-hit");
                self.addChild(new GameLayer(function(result){
                    result = {amount: scoreManager.getScore()};
                    self.addChild(new ResultLayer(result.amount, result, 'hit'));
                }));
                self.addChild(self._menuLayer = new MenuLayer());
            }));
        },
        pauseGame: function () { this._menuLayer && this._menuLayer.pauseGame(); },
        resumeGame: function () { this._menuLayer && this._menuLayer.resumeGame(); }
    });
});
