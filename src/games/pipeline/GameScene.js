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

            $.stats.myTrack("进入游戏-pipeline");
            $.stats.myTrack("进入游戏");
            self._backgroundLayer = new BackgroundLayer();
            self.addChild(self._backgroundLayer);
            self.addChild(new GuideLayer(function(){
                $.stats.myTrack("开始游戏-pipeline");
                $.stats.myTrack("开始游戏");
                self.addChild(new GameLayer(function(result){
                    result.score = result.assemble;
                    require('../../util/myDirector').enterResult('pipeline', result);
                }));
                self.addChild(self._menuLayer = new MenuLayer());
            }));
        },
        pauseGame: function () { this._menuLayer && this._menuLayer.pauseGame(); },
        resumeGame: function () { this._menuLayer && this._menuLayer.resumeGame(); }
    });
});
