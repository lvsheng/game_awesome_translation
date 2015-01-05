define([
    '../../gameUtil/resourceFileMap',
    '../../commonClass/GuideDialog'
], function (resourceFileMap, GuideDialog) {
    return cc.Layer.extend({
        _onStartGame: null,
        ctor: function (onStartGame) {
            var self = this;
            self._super();
            self.init();

            self._onStartGame = onStartGame;

            self.addChild(new GuideDialog(
                "00后",
                "点击屏幕使奥特曼跳跃，撞到00后你就死啦~",
                function(){ self._startGame(); }
            ));
        },
        _startGame:function () {
            this.parent.removeChild(this);
            this._onStartGame();
        }
    });
});
