/**
 * @author lvsheng
 * @date 2014/12/22
 */
define([], function () {
    return cc.Node.extend({
        _hitCount: 0,
        ctor: function(positionManager){
            var self = this;
            self._super(); self.init();

            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE, //这里的ONE_BY_ONE指的是多个手指时
                swallowTouches: false,
                onTouchBegan: function (touch) {
                    if (touch.getLocation().x > cc.director.getWinSize().width / 2) { ++self._hitCount; positionManager.toLeft(); }
                    console.log("on touch --in userControl(don't del, test whether auto unbind when destroy.)"); //TODO
                }
            }, self);
        },
        getHitCount: function(){ return this._hitCount; }
    });
});
