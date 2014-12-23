/**
 * @author lvsheng
 * @date 2014/12/22
 */
define([], function () {
    var B = 0.08;
    return cc.Node.extend({
        _positionManager: null,
        //key为剩余比例。1为还剩10%以内，5为中央
        //TODO: 改策略：从远到近会加快其速度，但从近到远不再再降低其速度
        _HIT_INTERVAL_MAP: {10: B, 9: B, 8: B, 7: B, 6: B, 5: B - 0.01, 4: B - 0.01, 3: B - 0.02, 2: B - 0.03, 1: B - 0.04},
        _hitInterval: 0,
        ctor: function (positionManager) {
            this._super(); this.init();
            this._positionManager = positionManager;
            this._update();
        },
        _update: function () {
            var p = this._positionManager;
            var nextTime = this._HIT_INTERVAL_MAP[Math.ceil((p.getOffset() + p.END_WIDTH) / (p.END_WIDTH * 2) * 10)];
            this._positionManager.toRight();
            this.scheduleOnce(_.bind(this._update, this), nextTime);
        }
    });
});
