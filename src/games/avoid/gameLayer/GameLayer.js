/**
 * 负责一个具体游戏中游戏规则的所有逻辑
 * （包括游戏内逻辑、用户操作、各种事件与调度，同时也包括计时、计分）
 *
 * 实例被创建即进入游戏过程，
 * 游戏玩到结束时会调用pauseGame停止游戏并通知所属的游戏场景
 * 正常结束后唯一输出为玩家在游戏中的分数、成就（通过回调回传给场景）
 * (非正常结束有暂停、场景被强制切换等）
 */
define([
    '../../../util/pauseGame',
    '../../../util/resourceFileMap',
    '../../../commonClass/TimerNode',
    './Teenager',
    './Ultraman'
], function (pauseGame, resourceFileMap, TimerNode, Teenager, Ultraman) {
    var L = 'left', R = 'right';
    return cc.Layer.extend({
        _ultramanConfList: null, //奥特曼配置列表
        _ultramans: null,
        _teenager: null,
        _timer: null,
        _passedAmount: 0,
        _passedWave: 0,

        /**
         * @param endCallback 回调函数。游戏结束时调用此函数进行处理（没有奥特曼了为成功，还有奥特曼为失败）
         */
        ctor: function (endCallback) {
            this._super(); this.init();

            this._endCallback = endCallback;
            this._ultramanConfList = [
                //[1, R, 500, 1]
                //[每一个与下一个的出现间隔，方向，速度, 数量]
                "wave",
                [1, R, 500, 3],
                [2, R, 500, 1],
                "wave",
                [0.8, L, 600, 4],
                "wave",
                [1, R, 800, 2],
                [1, R, 1000, 2],
                [3, R, 1000, 1],
                "wave",
                [0.8, L, 1100, 3],
                [1.5, L, 1100, 1],
                "wave",
                //[2, R, 1200, 1],
                [0.5, R, 1200, 12],
                [1.3, R, 1200, 1],
                "wave",
                [0.01, R, 1300, 1],
                "wave",
                [0, L, 1400, 1]
            ];
            this._ultramans = [];
            this._passedWave = 0;
            this._endding = false;

            var spriteBatchNode = this._spriteBatchNode = new cc.SpriteBatchNode(resourceFileMap.avoid.ultraman, 30);
            this.addChild(spriteBatchNode);

            this.addChild(this._teenager = new Teenager());
            this._launchUltramanList();
            this._jumpUltramanOnTouch();

            this.addChild(this._timer = (new TimerNode()).start());
            this.schedule(_.bind(this._judgeCrash, this));
            //TODO: for debug
            window.avoidLayer = this;
        },

        _launchUltramanList: function () {
            var self = this;
            var remainedAmount = 0; //当前前配置还剩的个数
            var curConf = null;

            function launchOne () {
                if (self._endding) { return; }

                if (remainedAmount === 0) { //上一个配置的已经发完
                    curConf = self._getNextUltraManConf();
                    if (!curConf || curConf.amount == 0) { //已经全部发射完
                        //开始判断成功通过
                        self.schedule(function(){
                            if (self._endding) { return; }
                            self._ultramans.length === 0 && self._endGame(true);
                        });
                        //结束递归schedule
                        return;
                    }
                    remainedAmount = curConf.amount;
                }

                //从上方逻辑执行到这里，remainedAmount应一定不为0
                self._addAUltraman(curConf.direction, curConf.speed);
                --remainedAmount;
                self.scheduleOnce(function(){ launchOne(); }, curConf.interval);
            }

            launchOne();
        },
        _getNextUltraManConf: function () {
            var arr;
            while (typeof (arr = this._ultramanConfList.shift()) === 'string') { //"wave xx"
                ++this._passedWave;
            }
            if (!arr) { return null; }
            else { return { interval: arr[0], direction: arr[1], speed: arr[2], amount: arr[3] }; }
        },
        _addAUltraman: function (direction, speed) {
            var path = resourceFileMap.avoid.ultraman;
            //var ultraman = new Ultraman(direction, speed, this, '#' + path.substring(path.lastIndexOf('/') + 1));
            var ultraman = new Ultraman(direction, speed, this, this._spriteBatchNode.getTexture());
            this._spriteBatchNode.addChild(ultraman);
            this._ultramans.push(ultraman);
        },
        removeAUltraman: function (ultraman) {
            this._ultramans.splice(_.indexOf(this._ultramans, ultraman), 1);
            this.removeChild(ultraman);
        },
        passAUltraman: function () { ++this._passedAmount; },

        getTeenager: function () { return this._teenager; },

        //判断是不是有奥特曼撞上了00后
        _judgeCrash: function () {
            if (this._endding) { return; }
            var self = this;
            _.forEach(self._ultramans, function (each) {
                if (self._teenager.ifCrash(each)) { self._endGame(false, each); }
            });
        },

        /**
         * @param winning
         * @param [crashedUltraman] 失败（winning为false）时应传入
         * @private
         */
        _endGame: function (winning, crashedUltraman) {
            var self = this;
            self._endding = true;
            self._teenager.stopAllActions();

            if (!winning) {
                _.forEach(self._ultramans, function (each) {
                    each.stopAllActions();
                });
                crashedUltraman.runAction(new cc.Sequence(
                    new cc.Blink(0.3, 1.58),
                    new cc.DelayTime(0.5),
                    new cc.CallFunc(end)
                ));
            } else {
                self._teenager.runAction(new cc.Sequence(
                    new cc.FadeOut(0.5),
                    new cc.CallFunc(end)
                ));
            }

            function end () {
                pauseGame.pauseGame();
                self._endCallback({
                    winning: winning,
                    time: self._timer.get(),
                    passedAmount: self._passedAmount,
                    remainedWave: self._getRemainedWave(),
                    passedWave: self._passedWave
                });
            }
        },

        _jumpUltramanOnTouch: function () {
            var self = this;

            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE, //这里的ONE_BY_ONE指的是多个手指时
                swallowTouches: false,
                onTouchBegan: function () {
                    if (self._endding) { return; }
                    var ultraman = self._teenager.comingNoJumpCloset(self._ultramans);
                    if (ultraman) { ultraman.jump(); }
                }
            }, self);
        },
        _getRemainedWave: function () {
            return _.filter(this._ultramanConfList, function (each) { return typeof each === 'string'; }).length;
        }
    });
});
