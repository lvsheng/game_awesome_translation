define([
    './PositionManager',
    './ComputerControl',
    './UserControl',
    '../../../util/resourceFileMap'
], function (PositionManager, ComputerControl, UserControl, resourceFileMap) {
    return cc.Sprite.extend({
        _onWinningOrLoosing: function(){},
        _positionManager: null,
        _carsSprite: null,
        _computerControl: null,
        _userControl: null,

        ctor: function (onWinningOrLoosing) {
            var self = this;
            self._super();
            self.init();

            var curLevel = 0;
            self._onWinningOrLoosing = onWinningOrLoosing;
            self.addChild(self._positionManager = new PositionManager(function(winner){
                if (curLevel === 2 && winner === 'right') { //3局都赢了
                    self._onWinningOrLoosing(true);
                } else if (winner === 'right') { //赢了当前局，进入下一局
                    self._positionManager.restore();
                    self.removeChild(self._computerControl);

                    ++curLevel;
                    //TODO: 出faster
                    self.addChild(self._computerControl = new ComputerControl(self._positionManager, curLevel));
                } else {
                    self._onWinningOrLoosing(false);
                }
            }));
            self.addChild(self._carsSprite = new cc.Sprite(resourceFileMap.bunt.cars));
            self.addChild(self._userControl = new UserControl(self._positionManager));
            self.addChild(self._computerControl = new ComputerControl(self._positionManager, curLevel));

            self._updatePosition();
            self.schedule(_.bind(self._updatePosition, self));
        },

        getUserHitCount: function(){ return this._userControl.getHitCount(); },

        _updatePosition: function () {
            var centerPosition = new cc.Point(cc.director.getWinSize().width / 2, cc.director.getWinSize().height / 2);
            this._carsSprite.setPosition(centerPosition.x + this._positionManager.getOffset(), centerPosition.y);
        }
    });
});
