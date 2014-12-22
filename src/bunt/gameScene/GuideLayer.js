/**
 * 引导层、提示用户本游戏的玩法
 */
define([
    '../../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    return cc.Layer.extend({
        /**
         * @constructor
         * @param startGame 回调函数，用户确认跳过引导层时执行
         */
        ctor: function (startGame) {
            this._super();
            this.init();

            setTimeout(function (){
                alert("快速点击屏幕右侧以驱动你的挖掘机");
                startGame();
            })
        }
    });
});
