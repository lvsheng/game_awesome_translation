/**
 * 代表一个小游戏，是一个小游戏的入口
 * 其负责：游戏玩法的引导、游戏过程、游戏结束后的结果展示等
 * 正常结束后的唯一结局应是生成并展现FinishLayer（展现分数、重玩与分享等功能键的面板）
 * (非正常结束包括用户暂停、重玩、回主页面等，无输出结果）
 */
define([
    './BackgroundLayer',
    './GuideLayer',
    './gameLayer/GameLayer',
    '../../commonClass/FinishLayer'
], function (BackgroundLayer, GuideLayer, GameLayer, FinishLayer) {
    return cc.Scene.extend({
        onEnter: function () {
            var self = this;
            self._super();

            self._backgroundLayer = new BackgroundLayer();
            self.addChild(self._backgroundLayer);
            self.addChild(new GuideLayer(function(){
                self.addChild(new GameLayer(function(result){
                    var info = '你以';

                    if (result.minReactTime && result.averageReactTime) {
                        info += "平均" + result.minReactTime/1000 + "s的反应时间，";
                    }
                    info += result.rightRate + "%的正确率\n";
                    info += "在" + result.time + "s内";
                    info += "成功收集了" + result.gather + "颗心,\n";

                    if (result.winning) {
                        info += "终于成功挽救了单身狗，使他与女神相遇了！"
                    } else {
                        info += [
                            "但还不足以挽留住女神~"
                        ].join('\n');
                    }

                    self.addChild(new FinishLayer(info));
                }));
            }));
        },
        pauseGame: function () { this._menuLayer && this._menuLayer.pauseGame(); },
        resumeGame: function () { this._menuLayer && this._menuLayer.resumeGame(); }
    });
});
