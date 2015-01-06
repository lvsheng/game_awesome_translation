/**
 * 引导层、提示用户本游戏的玩法
 */
define([
    '../../util/resourceFileMap',
    '../../commonClass/GuideDialog'
], function (resourceFileMap, GuideDialog) {
    return cc.Layer.extend({
        _onStartGame: null,

        /**
         * @constructor
         * @param onStartGame 回调函数，用户确认跳过引导层时执行
         */
        ctor: function (onStartGame) {
            var self = this;
            self._super();
            self.init();

            self._onStartGame = onStartGame;

            self.addChild(new GuideDialog(
                "pipeline",
                "点击屏幕为机器人女友安装头部",
                function(){ self._startGame(); }
            ));
        },

        /**
         * 结束引导，开始游戏
         * @private
         */
        _startGame:function () {
            this.parent.removeChild(this);
            this._onStartGame();
        }
    });
});
