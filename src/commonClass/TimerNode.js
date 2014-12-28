/**
 * 计时器
 * 使用方式：
 * this.addChild(this._timer = (new TimerNode()).start());
 * ...
 * this._timer.get()
 *
 * 注：为了在director或场景暂停时能同步暂停计时，故作为Node并且使用时需添加到需要计时的元素（典型为layer）上
 * @author lvsheng
 * @date 2014/12/24
 */
define([], function () {
    return cc.Node.extend({
        _time: 0,
        ctor: function () { this._super(); this.init(); },
        start: function () {
            var self = this;
            self._time = 0;
            self.schedule(function(dt){ self._time += dt; });
            return self;
        },
        get: function () { return Math.round(this._time); }
    })
});
