/**
 * @author lvsheng
 * @date 2015/1/3
 */
define([
    '../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    return cc.Layer.extend({
        ctor: function(startCallback){
            this._super(); this.init();
            this._startAnimation(startCallback);
        },
        _startAnimation: function (startCallback) {
            //TODO: 各动画执行完了执行回调
            setTimeout(function(){
            startCallback();

            }, 1000);
        }
    });
});
