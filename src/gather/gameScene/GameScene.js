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

            self.addChild(new BackgroundLayer());
            self.addChild(new GuideLayer(function(){
                self.addChild(new GameLayer(function(result){
                    var info;
                    if (result.winning) {
                        info = "收集了" + result.heartAmount + "颗心之后，" +
                            "你终于成功挽救了单身狗，使他与女神相遇了！"
                    } else {
                        self.addChild(new FinishLayer([
                            "你成功收集了" + result.heartAmount + "颗心，",
                            "但还不足以挽留住女神~"
                        ].join('\n')));
                    }
                }));
            }));
        }
    });
});