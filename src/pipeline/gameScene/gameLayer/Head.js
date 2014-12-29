/**
 * @author lvsheng
 * @date 2014/12/22
 */
define([
    '../../../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    return cc.Node.extend({
        /**
         * @param endCallback {Function} 调用时传入参数: 'meet'|'out'
         * @param initDistance {number} 0~1的数字，1代表整个屏幕的长度
         */
        ctor: function(endCallback, initDistance){
            var self = this;
            self._super(); self.init();

        }
    });
});
