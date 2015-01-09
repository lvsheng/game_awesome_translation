/**
 * @author lvsheng
 * @date 2014/12/22
 */
define([], function () {
    var B = {
        0: 0.35,
        1: 0.22,
        2: 0.15
    };
    return cc.Node.extend({
        _positionManager: null,
        //key为剩余比例。1为还剩10%以内，5为中央
        //_HIT_INTERVAL_MAP: {10: B, 9: B, 8: B, 7: B, 6: B, 5: B - 0.01, 4: B - 0.01, 3: B - 0.02, 2: B - 0.03, 1: B - 0.04},
        _HIT_INTERVAL_MAP: {
            0: {10: B[0], 9: B[0], 8: B[0], 7: B[0], 6: B[0], 5: B[0] - 0.01, 4: B[0] - 0.01, 3: B[0] - 0.02, 2: B[0] - 0.03, 1: B[0] - 0.04},
            1: {10: B[1], 9: B[1], 8: B[1], 7: B[1], 6: B[1], 5: B[1] - 0.01, 4: B[1] - 0.01, 3: B[1] - 0.02, 2: B[1] - 0.03, 1: B[1] - 0.04},
            2: {10: B[2], 9: B[2], 8: B[2], 7: B[2], 6: B[2], 5: B[2] - 0.01, 4: B[2] - 0.01, 3: B[2] - 0.02, 2: B[2] - 0.025, 1: B[2] - 0.03}
        },
        _hitInterval: 0,
        _nextTime: 0,
        ctor: function (positionManager, level) {
            this._super(); this.init();

            this.intervalMap = this._HIT_INTERVAL_MAP[level];
            this._positionManager = positionManager;
            this._nextTime = 0;
            this._update();
        },
        _update: function () {
            var p = this._positionManager;
            var matchedTime = this.intervalMap[Math.ceil((p.getOffset() + p.END_WIDTH) / (p.END_WIDTH * 2) * 10)];
            if (!this._nextTime || matchedTime < this._nextTime) { this._nextTime = matchedTime; }
            this._positionManager.toRight();
            this.scheduleOnce(_.bind(this._update, this), this._nextTime);
        }
    });
});
