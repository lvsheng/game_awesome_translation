define([
    '../../util/resourceFileMap',
    '../../util/getGameTitle',
    '../../util/getGameTip',
    '../../commonClass/GuideDialog'
], function (resourceFileMap, getGameTitle, getGameTip, GuideDialog) {
    return cc.Layer.extend({
        _onStartGame: null,
        ctor: function (onStartGame) {
            var self = this;
            self._super();
            self.init();

            self._onStartGame = onStartGame;

            self.addChild(new GuideDialog(
                getGameTitle("avoid"),
                getGameTip("avoid"),
                function(){ self._startGame(); }
            ));
        },
        _startGame:function () {
            this.parent.removeChild(this);
            this._onStartGame();
        }
    });
});
