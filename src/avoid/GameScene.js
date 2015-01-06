/**
 * @author lvsheng
 * @date 2014/12/24
 */
define([
    './BackgroundLayer',
    './GuideLayer',
    './gameLayer/GameLayer',
    '../commonClass/ResultLayer',
    '../commonClass/MenuLayer'
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
                    var info;
                    if (result.winning) {
                        info = "这绝对是一个值得纪念的时刻！\n" +
                        "你成功避开了总共" + result.passedAmount + "个00后，\n" +
                        "拯救了" + result.passedWave + "波奥特曼，\n" +
                        "赢得了最终的胜利！"
                    } else if (result.remainedWave === 0) {
                        info = "共成功避开了" + result.passedAmount + "个00后！\n" +
                        "拯救完最后一波奥特曼就可以取得最后的胜利！";
                    } else  if (result.passedWave > 1) {
                        info = "共成功避开了" + result.passedAmount + "个00后！\n" +
                        "再拯救" + (result.remainedWave + 1) + "波奥特曼就可以取得最后的胜利";
                    } else if (result.passedAmount < 3) {
                        info = "呃... 你只避开了" + result.passedAmount + "个00后，\n" +
                        "再接再厉~！";
                    } else {
                        info = "成功避开了" + result.passedAmount + "个00后！\n" +
                        "不过还是输了~";
                    }

                    self.addChild(new ResultLayer(result.winning ? "你赢了！" : "你输了...", info));
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
