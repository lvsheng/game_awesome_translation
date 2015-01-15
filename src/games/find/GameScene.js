/**
 * 代表一个小游戏，是一个小游戏的入口
 * 其负责：游戏玩法的引导、游戏过程、游戏结束后的结果展示等
 * 正常结束后的唯一结局应是生成并展现ResultLayer（展现分数、重玩与分享等功能键的面板）
 * (非正常结束包括用户暂停、重玩、回主页面等，无输出结果）
 */
define([
    'require',
    './BackgroundLayer',
    './GuideLayer',
    './gameLayer/GameLayer',
    '../../commonClass/MenuLayer',
    '../../util/myDirector'
], function (require, BackgroundLayer, GuideLayer, GameLayer, MenuLayer) {
    return cc.Scene.extend({
        onEnter: function () {
            var self = this;
            self._super();

            $.stats.myTrack("进入游戏-find");
            $.stats.myTrack("进入游戏");
            self.addChild(new BackgroundLayer());
            self.addChild(new GuideLayer(function(){
                // 用户确认开始游戏的回调
                $.stats.myTrack("开始游戏-find");
                $.stats.myTrack("开始游戏");
                self.addChild(new GameLayer(function(result){
                    // 用户完成游戏的回调
                    result.score = result.hitCount;
                    require('../../util/myDirector').enterResult('find', result);
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
