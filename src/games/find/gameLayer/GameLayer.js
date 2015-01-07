define([
    './Matrix',
    '../../../util/pauseGame',
    '../../../commonClass/TimerNode'
], function (Matrix, pauseGame, TimerNode) {
    return cc.Layer.extend({
        ctor: function (endCallback) {
            var self = this;
            self._super(); self.init();

            self._gameTime = 30;
            self._matrixScaleList = [
                2,
                3,
                4,
                5,
                5,
                5,
                6,
                6,
                6,
                7,
                7,
                7,
                8,
                9,
                10
            ];
            self._endCallback = endCallback;
            self._scale = self._matrixScaleList.shift();
            self._hitCount = 0;

            self.addChild(self._matrix = new Matrix());
            self.addChild(self._timer = (new TimerNode()).start());

            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE, //这里的ONE_BY_ONE指的是多个手指时
                swallowTouches: false,
                onTouchBegan: function (touch) {
                    if (self._matrix.whetherFind(touch.getLocation())) {
                        ++self._hitCount;
                        self._scale = self._matrixScaleList.length > 0 ? self._matrixScaleList.shift() : self._scale;
                        self._matrix.generate(self._scale);
                    }
                }
            }, self);

            self.schedule(function () {
                self._endGame();
            }, self._gameTime);
        },

        _endGame: function () {
            pauseGame.pauseGame();
            this._endCallback({
                time: this._timer.get(),
                hitCount: this._hitCount
            });
        }
    });
});
