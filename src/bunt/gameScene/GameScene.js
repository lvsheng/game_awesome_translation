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
    '../../commonClass/FinishLayer',
    '../../commonClass/MenuLayer'
], function (BackgroundLayer, GuideLayer, GameLayer, FinishLayer,MenuLayer) {
    return cc.Scene.extend({
        onEnter: function () {
            var self = this;
            self._super();

            self.addChild(new BackgroundLayer());
            self.addChild(new GuideLayer(function(){
                // 用户确认开始游戏的回调
                self.addChild(new GameLayer(function(result){
                    // 用户完成游戏的回调
                    self.addChild(new FinishLayer(_.template([
                        "<% if (!winning) { %>",
                        "<% } %>",
                        "以<%= rate %>下/秒的手速狂点了<%= hitCount %>下，",
                        "<% if (winning) { %>",
                        "终于赢了~",
                        "<% } else { %>",
                        "你坚持了<%= time %>s却还是输了..",
                        "<% } %>"
                    ].join(''))(result)));
                }));
                //TODO:创建边栏层
                self.addChild(new MenuLayer());
            }));
        }
    });
});
