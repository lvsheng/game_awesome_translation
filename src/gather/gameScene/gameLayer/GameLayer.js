define([
    './Couple',
    './Heart',
    '../../../gameUtil/pauseGame',
    '../../../commonClass/TimerNode'
], function (Couple, Heart, pauseGame, TimerNode) {
    //这些参数单位都用比例，在计算精灵位置时再根据屏幕宽度换算成px。这样来达到不同屏幕大小下难度一致
    var INIT_DISTANCE = 0.4; //两个小人之间初始距离
    var INIT_SPEED = 0.2;

    return cc.Layer.extend({
        ctor: function (endCallback) {
            this._super(); this.init();

            this._couple = new Couple(_.bind(this._win, this), _.bind(this._loose, this), INIT_DISTANCE, INIT_SPEED);
            this._hearts = [];
            this._endCallback = endCallback;
            this._timer = (new TimerNode()).start();

            this.addChild(this._couple);
            this.addChild(this._timer);
        },


        _win: function () { this._endGame(true); },
        _loose: function () { this._endGame(false); },
        /**
         * @param winning {boolean}
         * @private
         */
        _endGame: function (winning) {
            pauseGame();
            //result应包括胜负信息、用了多少时间、用户点击了多少下
            this._endCallback({
                winning: winning,
                heartAmount: 0
            });
        }
    });
});
