/**
 * @author lvsheng
 * @date 2014/12/24
 */
define([
    'require',
    './BackgroundLayer',
    './GuideLayer',
    './gameLayer/GameLayer',
    '../../commonClass/MenuLayer',
    '../../util/myDirector'
], function (require, BackgroundLayer, GuideLayer, GameLayer, MenuLayer) {
    //TODO: 看是不是能把GameScene的创建抽出来一个基类，每个子类指定其四个层、指定其展示结果的方法
    return cc.Scene.extend({
        onEnter: function () {
            var self = this;
            self._super();

            $.stats.myTrack("进入游戏-avoid");
            $.stats.myTrack("进入游戏");
            self.addChild(new BackgroundLayer());
            self.addChild(new GuideLayer(function(){
                // 用户确认开始游戏的回调
                $.stats.myTrack("开始游戏-avoid");
                $.stats.myTrack("开始游戏");
                self.addChild(new GameLayer(function(result){
                    result.score = result.passedAmount;
                    require('../../util/myDirector').enterResult('avoid', result);
                }));
                self.addChild(self._menuLayer = new MenuLayer());
            }));
        },
        pauseGame: function () {
            this._menuLayer && this._menuLayer.pauseGame();
        },
        resumeGame: function () { this._menuLayer && this._menuLayer.resumeGame(); }
    });
});
