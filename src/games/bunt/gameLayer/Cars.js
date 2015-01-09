define([
    './PositionManager',
    './ComputerControl',
    './UserControl',
    './FasterLayer',
    '../../../util/resourceFileMap'
], function (PositionManager, ComputerControl, UserControl, FasterLayer, resourceFileMap) {
    return cc.Sprite.extend({
        _onWinningOrLoosing: function(){},
        _positionManager: null,
        _carsSprite: null,
        _computerControl: null,
        _userControl: null,
        _curLevel: 0,
        _winAmount: 0,

        ctor: function (onWinningOrLoosing) {
            var self = this;
            self._super();
            self.init();

            self._onWinningOrLoosing = onWinningOrLoosing;
            self.addChild(self._positionManager = new PositionManager(function(winner){
                if (winner === 'right') { ++ self._winAmount; }

                if (self._curLevel === 2 && winner === 'right') { //3局都赢了
                    self._onWinningOrLoosing(true);
                } else if (winner === 'right') { //赢了当前局，进入下一局
                    self.removeChild(self._computerControl);
                    self._userControl.pauseTouch();
                    self._positionManager.restore();

                    self.addChild(self._fasterLayer = new FasterLayer(function(){
                        self.removeChild(self._fasterLayer);
                        self._userControl.restoreTouch();
                        ++self._curLevel;
                        self.addChild(self._computerControl = new ComputerControl(self._positionManager, self._curLevel));
                    }, self._curLevel));
                } else {
                    self._onWinningOrLoosing(false);
                }
            }));
            self.addChild(self._carsSprite = new cc.Sprite(resourceFileMap.bunt.cars));
            self.addChild(self._userControl = new UserControl(self._positionManager));
            self.addChild(self._computerControl = new ComputerControl(self._positionManager, self._curLevel));

            self._updatePosition();
            self.schedule(_.bind(self._updatePosition, self));
        },

        getUserHitCount: function () { return this._userControl.getHitCount(); },
        getWinAmount: function () {
            return this._winAmount;
        },

        _updatePosition: function () {
            var centerPosition = new cc.Point(cc.director.getWinSize().width / 2, cc.director.getWinSize().height / 2);
            this._carsSprite.setPosition(centerPosition.x + this._positionManager.getOffset(), centerPosition.y);
        }
    });
});
