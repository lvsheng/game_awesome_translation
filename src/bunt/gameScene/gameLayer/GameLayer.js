/**
 * 负责一个具体游戏中游戏规则的所有逻辑
 *
 * 实例被创建后即进入游戏过程，
 * 游戏玩到结束时会调用pauseGame停止游戏并通知所属的游戏场景
 * 正常结束后唯一输出为玩家在游戏中的分数、成就（通过回调回传给场景）
 * (非正常结束有暂停、场景被强制切换等）
 */
define([
    './Cars',
    '../../../gameUtil/pauseGame'
], function (Cars, pauseGame) {
    return cc.Layer.extend({
        _cars: null,
        _endCallback: function(){},

        /**
         * @param endCallback 回调函数。游戏结束时调用此函数进行处理
         */
        ctor: function (endCallback) {
            this._super();
            this.init();

            this._endCallback = endCallback;
            this.cars = new Cars();

            //for test
            console.log("game begin");
            this.scheduleUpdate();
        },

        update: function () {
            //for test
            this._score ? ++this._score : this._score = 1;
            if (this._score < 30) {
                console.log('game continue');
            } else {
                this._endGame();
            }
        },
        
        _endGame: function () {
            pauseGame();
            this._endCallback({score: this._score});
        }
    });
});
