/**
 * @author lvsheng
 * @date 2014/12/24
 */
define([
    './BackgroundLayer',
    './GuideLayer',
    './gameLayer/GameLayer',
    '../../commonClass/FinishLayer'
], function (BackgroundLayer, GuideLayer, GameLayer, FinishLayer) {
    //TODO: 看是不是能把GameScene的创建抽出来一个基类，每个子类指定其四个层、指定其展示结果的方法
    return cc.Scene.extend({
        onEnter: function () {
            var self = this;
            self._super();

            self.addChild(new BackgroundLayer());
            self.addChild(new GuideLayer(function(){
                // 用户确认开始游戏的回调
                self.addChild(new GameLayer(function(result){
                    self.addChild(new FinishLayer(_.template([
                        //只完成了第一波~ 还剩几波~ 只剩几波~
                        "花费了<%= Math.round(time) %>s",
                        "避开了<%= passAmount %>个00后~",
                        "<% if (winning) { %>",
                        "你终于赢了~",
                        "<% } else { %>",
                        "你还是输了",
                        "<% } %>"
                    ].join(''))(result)));
                }));
                //TODO:创建边栏层
            }));
        }
    });
});
