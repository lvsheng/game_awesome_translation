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


        }
    });
});
