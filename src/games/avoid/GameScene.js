/**
 * @author lvsheng
 * @date 2014/12/24
 */
define([
    './BackgroundLayer',
    './GuideLayer',
    './gameLayer/GameLayer',
    '../../commonClass/ResultLayer',
    '../../commonClass/MenuLayer'
], function (BackgroundLayer, GuideLayer, GameLayer, ResultLayer, MenuLayer) {
    //TODO: 看是不是能把GameScene的创建抽出来一个基类，每个子类指定其四个层、指定其展示结果的方法
    return cc.Scene.extend({
        onEnter: function () {
            var self = this;
            self._super();

            self.addChild(new BackgroundLayer());
            self.addChild(new GuideLayer(function(){
                // 用户确认开始游戏的回调
                self.addChild(new GameLayer(function(result){
                    self.addChild(new ResultLayer(result.passedAmount, result, 'avoid'));
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
