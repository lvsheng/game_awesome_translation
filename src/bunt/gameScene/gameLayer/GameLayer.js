/**
 * 负责一个具体游戏中游戏规则的所有逻辑
 * （包括游戏内逻辑、用户操作、各种事件与调度，同时也包括计时、计分）
 *
 * 实例被创建即进入游戏过程，
 * 游戏玩到结束时会调用pauseGame停止游戏并通知所属的游戏场景
 * 正常结束后唯一输出为玩家在游戏中的分数、成就（通过回调回传给场景）
 * (非正常结束有暂停、场景被强制切换等）
 */
define([
    './Cars',
    '../../../gameUtil/pauseGame',
    '../../../commonClass/TimerNode'
], function (Cars, pauseGame, TimerNode) {
    return cc.Layer.extend({
        _cars: null,
        _timer: null,
        _endCallback: function(){},

        /**
         * @param endCallback 回调函数。游戏结束时调用此函数进行处理
         */
        ctor: function (endCallback) {
            this._super(); this.init();

            this._endCallback = endCallback;
            this.addChild(this._cars = new Cars(_.bind(this._endGame, this)));
            this.addChild(this._timer = (new TimerNode()).start());
        },

        /**
         * @param winning {boolean}
         * @private
         */
        _endGame: function (winning) {
            pauseGame.pause();
            //result应包括胜负信息、用了多少时间、用户点击了多少下
            this._endCallback({
                winning: winning,
                time: this._timer.get(),
                hitCount: this._cars.getUserHitCount(),
                rate: Math.round(this._cars.getUserHitCount() / this._timer.get())
            });
        }
    });
});
