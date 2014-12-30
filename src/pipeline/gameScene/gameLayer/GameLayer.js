define([
    './Pipeline',
    './Head',
    '../../../gameUtil/pauseGame',
    '../../../commonClass/TimerNode'
], function (Pipeline, Head, pauseGame, TimerNode) {
    var GAME_TIME = 30;
    return cc.Layer.extend({
        ctor: function (endCallback) {
            var self = this;
            self._super(); self.init();

            self._endCallback = endCallback;
            self._assembledAmount = 0;
            self._dropedAmount = 0;
            self._head = null;
            self.addChild(self._pipeline = new Pipeline());
            self.addChild(self._timer = (new TimerNode()).start());

            self._addNewHead();

            //游戏定时结束
            self.schedule(_.bind(self._endGame, self), GAME_TIME);

            //点击时将旧的头尝试安装到流水线上，并增加一个新的头
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                onTouchBegan: function(){
                    var assembled = self._head.tryAssemble(self._pipeline);
                    if (assembled) { ++self._assembledAmount }
                    else { ++self._dropedAmount; }
                    self._addNewHead();
                }
            }, self);

            //TODO: for test
            window.layer = this;
        },
        _addNewHead: function () { this.addChild(this._head = new Head()); },
        _endGame: function () {
            this._endCallback({
                assemble: this._assembledAmount,
                drop: this._dropedAmount,
                time: Math.round(this._timer.get())
            });
        }
    });
});
