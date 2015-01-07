define([
    './MatrixLayer',
    '../../../util/pauseGame',
    '../../../util/resourceFileMap',
    '../../../commonClass/TimerNode'
], function (MatrixLayer, pauseGame, resourceFileMap, TimerNode) {
    return cc.Layer.extend({
        ctor: function (endCallback) {
            var self = this;
            self._super(); self.init();

            self._gameTime = 30;
            self._matrixSizeList = [
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
            self._scale = self._matrixSizeList.shift();
            self._hitCount = 0;

            var winSize = cc.director.getWinSize();
            var center = cc.p(winSize.width / 2, winSize.height / 2);
            var person = new cc.Sprite(resourceFileMap.find.person);
            person.attr({anchorX: 0.5, anchorY: 0, x: center.x - 323, y: 0});
            self.addChild(person);
            self.addChild(self._matrix = new MatrixLayer());
            self.addChild(self._timer = (new TimerNode()).start());

            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE, //这里的ONE_BY_ONE指的是多个手指时
                swallowTouches: false,
                onTouchBegan: function (touch) {
                    if (self._matrix.whetherFind(touch.getLocation())) {
                        ++self._hitCount;
                        self._scale = self._matrixSizeList.length > 0 ? self._matrixSizeList.shift() : self._scale;
                        self._matrix.generate(self._scale);
                    }
                }
            }, self);

            self.schedule(function () {
                self._endGame();
            }, self._gameTime);

            self._matrix.generate(self._scale);
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
