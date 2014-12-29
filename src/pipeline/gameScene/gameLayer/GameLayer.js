define([
    './Body',
    './Head',
    '../../../gameUtil/pauseGame',
    '../../../commonClass/TimerNode'
], function (Body, Head, pauseGame, TimerNode) {
    var INTERVAL = 0.8;
    var INTERVAL_RANDOM_RANGE = 0.5;
    var BODY_CONFS = [
        //amount, lifeTime
        [3, 1.2],
        [3, 0.7],
        [3, 0.5],
        [5, 0.4],
        [15, 0.38],
        [1, 0.33],
        [1]
    ];

    return cc.Layer.extend({
        ctor: function (endCallback) {
            var self = this;
            self._super(); self.init();

            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                onTouchBegan: _.bind(self._exam, self)
            }, self);
        },

        _exam: function (touch) {
            var self = this;

        },

        _getAConf: function () {
            if (!this._lastConf) { this._lastConf = {}; this._remainedAmount = 0; } //for first call
            var conf = {};

            if (this._remainedAmount > 0) {
                conf = this._lastConf;
                --this._remainedAmount;
            } else {
                var arr = this._heartConfs.shift() || [];
                this._remainedAmount = arr.shift() - 1;

                if (arr.length) {
                    function add (name) { arr.length > 0 && (conf[name] = arr.shift()); } //防止_.extend把undefined值也扩展到lastConf
                    add('lifeTime');
                }

                conf = _.extend(this._lastConf, conf);
            }

            return conf;
        },
        _addBody: function () {
            var conf = this._getAConf();

        },
        _installRight: function (heart) {
            ++this._gatherAmount;

        },
        _bodyOut: function (heart) {
            ++this._dropAmount;
        },
        _endGame: function (winning) {
            var result = {
                winning: winning,
                time: this._timer.get(),
                gather: this._gatherAmount,
                drop: this._dropAmount
            };
            pauseGame.pauseGame();

            this._endCallback(result);
        }
    });
});
