/**
 * 引导层、提示用户本游戏的玩法
 */
define([
    '../../util/resourceFileMap',
    '../../util/getGameTitle',
    '../../util/getGameTip',
    '../../commonClass/GuideDialog'
], function (resourceFileMap, getGameTitle, getGameTip, GuideDialog) {
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

            self.addChild(new GuideDialog(
                getGameTitle("bunt") + "！",
                getGameTip("bunt"),
                function(){ self._startGame(); }
            ));

            self._onStartGame = onStartGame;
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
