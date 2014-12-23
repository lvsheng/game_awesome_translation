define([
    '../../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    return cc.Layer.extend({
        _onStartGame: null,
        ctor: function (onStartGame) {
            var self = this;
            self._super();
            self.init();

            self._onStartGame = onStartGame;

            setTimeout(function (){
                alert("点击屏幕使奥特曼跳跃，撞到00后你就死啦~");
                self._startGame();
            });
        },
        _startGame:function () {
            this.parent.removeChild(this);
            this._onStartGame();
        }
    });
});
