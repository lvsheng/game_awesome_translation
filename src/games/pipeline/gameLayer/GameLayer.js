define([
    './Pipeline',
    './Head',
    '../../../util/pauseGame',
    '../../../util/resourceFileMap',
    '../../../commonClass/TimerNode'
], function (Pipeline, Head, pauseGame, resourceFileMap, TimerNode) {
    //var GAME_TIME = 30;
    return cc.Layer.extend({
        ctor: function (endCallback) {
            var self = this;
            self._super(); self.init();

            self._endCallback = endCallback;
            self._assembledAmount = 0;
            self._dropedAmount = 0;
            self._head = null;
            self.addChild(self._pipeline = new Pipeline(), -9999999);
            self.addChild(self._timer = (new TimerNode()).start());
            var bar = new cc.Sprite(resourceFileMap.pipeline.bar);
            bar.attr({x: cc.director.getWinSize().width / 3 - 10, anchorY: 1, y: cc.director.getWinSize().height});
            self.addChild(bar, -9999999);

            self._addNewHead();

            //游戏定时结束
            //self.scheduleOnce(function(){ self._pipeline.stopAddBody(); }, GAME_TIME);

            self.schedule(function () {
                if (this._pipeline.getBodyList().length === 0) {
                    self._endGame();
                }
            });

            //点击时将旧的头尝试安装到流水线上，并增加一个新的头
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                onTouchBegan: function(){
                    if (!self._head) { return; }

                    var assembled = self._head.tryAssemble(function(){
                        if (assembled) {
                            ++self._assembledAmount;
                            self._addNewHead();
                        }
                        else {
                            ++self._dropedAmount;
                            if (self._dropedAmount < 3) {
                                self._addNewHead();
                            } else {
                                self._endGame();
                            }
                        }
                    });
                    self._head = null;
                }
            }, self);
        },
        _addNewHead: function () {
            var newZIndex = this._head ? this._head.getLocalZOrder() - 1 : 0;
            this.addChild(this._head = new Head(this._pipeline), newZIndex);
        },
        _endGame: function () {
            var self = this;
            self._pipeline.stopRun();

            self.runAction(new cc.Sequence(
                new cc.Sequence(
                    new cc.Blink(0.5, 9),
                    new cc.DelayTime(0.5)
                ),
                new cc.CallFunc(function () {
                    pauseGame.pauseGame();
                    self._endCallback({
                        assemble: self._assembledAmount,
                        drop: self._dropedAmount,
                        time: Math.round(self._timer.get())
                    });
                })
            ));
        }
    });
});
