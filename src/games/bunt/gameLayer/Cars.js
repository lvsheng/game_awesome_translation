define([
    './PositionManager',
    './ComputerControl',
    './UserControl',
    './FasterLayer',
    '../../../util/resourceFileMap'
], function (PositionManager, ComputerControl, UserControl, FasterLayer, resourceFileMap) {
    return cc.Sprite.extend({
        ctor: function (onWinningOrLoosing) {
            var self = this;
            self._super();
            self.init();

            self._curLevel = 0;
            self._winAmount = 0;
            self._onWinningOrLoosing = onWinningOrLoosing;
            self._positionManager = null;
            self._carsSprite = null;
            self._computerControl = null;
            self._userControl = null;

            self.addChild(self._positionManager = new PositionManager(function(winner){
                if (winner === 'right') { ++ self._winAmount; }

                self._userControl.pauseTouch();
                self.removeChild(self._computerControl);

                self._blink(function () {
                    if (self._curLevel === 2 && winner === 'right') { //3局都赢了
                        self._onWinningOrLoosing(true);
                    } else if (winner === 'right') { //赢了当前局，进入下一局
                        self.addChild(self._fasterLayer = new FasterLayer(function(){
                            self.removeChild(self._fasterLayer);
                            self._fasterLayer = null;
                            ++self._curLevel;
                            self.addChild(self._computerControl = new ComputerControl(self._positionManager, self._curLevel));
                            self._userControl.restoreTouch();
                        }, self._curLevel));
                    } else { //输了
                        self._onWinningOrLoosing(false);
                    }
                });
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

        _blink: function (callback) {
            var self = this;
            self._carsSprite.runAction(new cc.Sequence(
                new cc.DelayTime(0.3),
                new cc.Blink(0.3, 3),
                new cc.FadeOut(0.8),
                new cc.CallFunc(function(){
                    self._carsSprite.opacity = 255;
                    self._positionManager.restore();
                    self._updatePosition();
                    callback();
                })
            ));
        },

        _updatePosition: function () {
            var centerPosition = new cc.Point(cc.director.getWinSize().width / 2, cc.director.getWinSize().height / 2);
            this._carsSprite.setPosition(centerPosition.x + this._positionManager.getOffset(), centerPosition.y);
        }
    });
});
