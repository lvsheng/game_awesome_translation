define([
    '../../../util/resourceFileMap',
    './Hole',
    './Hammer',
    './GameTimerLabel'
], function (resourceFileMap, Hole, Hammer, GameTimerLabel) {
    return cc.Layer.extend({
        _GAME_TIME: 30, //游戏时长，秒为单位
        //TODO: for debug
        //_GAME_TIME: 3, //游戏时长，秒为单位
        _POP_MOUSE_INTERVAL_UPDATE_TIME: 3, //多久更新一次弹鼠的间隔
        _POP_MOUSE_FACTOR_LIST: [
            //mousePopInterval, uncleExistTime, loverExistTime, popLoverProbability
            [1, 3, 3, 0.5],
            [0.8, 1, 2, 0.3],
            [0.8],
            [0.8, 0.8, 1],
            [0.8],

            [0.5, 0.7]
            ,
            [0.3],
            [0.25]
            //,
            //[0.1, 0.6, 0.8],
            //[0.1],
            //[0.1]
        ],

        ctor: function (endCallback) {
            var self = this;
            self._super();

            self._endCallback = endCallback;

            //初始化成员变量
            self._holes = [];
            self._hammer = null;
            self._timer = null;
            self._popMouseIntervalIndex = 0;
            self._remainGameTime = self._GAME_TIME;

            self.init();

            //for debug
            //self.showAllAmount();
        },
        init: function () {
            var self = this;
            self._super();

            self._initView();
            self._startPop();
            self._listenEvent();

            self.schedule(self._updateGameRemainTime);
        },

        _updateGameRemainTime: function (dt) { //要求每次更新都要调用本方法
            var self = this;
            if (self._endding) { return; }
            self._remainGameTime -= dt;

            self._timer.setTime(parseInt(self._remainGameTime) + 1);

            if (self._remainGameTime <= 0) {
                self._remainGameTime = 0;
                self._endding = true;

                var winSize = cc.director.getWinSize();
                var shadowLayer = new cc.LayerColor(cc.color(0, 0, 0, 0), winSize.width, winSize.height);
                self.addChild(shadowLayer);
                shadowLayer.runAction(new cc.Sequence(
                    //new cc.FadeTo(1, 200).easing(cc.easeOut()),
                    new cc.CallFunc(function(){
                        self._endGame();
                    })
                ));
            }
        },

        _initView: function () {
            var self = this;
            var winSize = cc.director.getWinSize();
            var center = cc.p(winSize.width / 2, winSize.height / 2 - 15);
            var HORIZONTAL_INTERVAL = 245;
            var VERTICAL_INTERVAL = 187;
            var HOLE_POSITIONS = [
                //顺序为渲染的顺序，会影响到覆盖，所以应该让下面的hole排在前（下面的心等会覆盖上面的洞口）
                //第一排
                cc.p(center.x - HORIZONTAL_INTERVAL, center.y + VERTICAL_INTERVAL),
                cc.p(center.x, center.y + VERTICAL_INTERVAL),
                cc.p(center.x + HORIZONTAL_INTERVAL, center.y + VERTICAL_INTERVAL),

                //第二排
                cc.p(center.x - HORIZONTAL_INTERVAL, center.y),
                cc.p(center.x, center.y),
                cc.p(center.x + HORIZONTAL_INTERVAL, center.y),

                //第三排
                cc.p(center.x - HORIZONTAL_INTERVAL, center.y - VERTICAL_INTERVAL),
                cc.p(center.x, center.y - VERTICAL_INTERVAL),
                cc.p(center.x + HORIZONTAL_INTERVAL, center.y - VERTICAL_INTERVAL)
            ];

            for (var i = 0; i < HOLE_POSITIONS.length; ++i) {
                var createdHole = new Hole();
                createdHole.x = HOLE_POSITIONS[i].x;
                createdHole.y = HOLE_POSITIONS[i].y;

                self._holes.push(createdHole);
                self.addChild(createdHole);
            }

            self._hammer = new Hammer();
            self.addChild(self._hammer);

            self._timer = new GameTimerLabel();
            self._timer.attr({
                anchorX: 0,
                x: 32,
                y: 54
            });
            self.addChild(self._timer);
        },
        _listenEvent: function () {
            var self = this;
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE, //这里的ONE_BY_ONE指的是多个手指时
                swallowTouches: false,
                onTouchBegan: function (touch) { self._onUserTouch(touch); }
            }, self);
        },

        _onUserTouch: function (touch) {
            var self = this;
            var pos = touch.getLocation();

            self._hammer.hit(pos.x, pos.y, self._getHoleOn(pos.x, pos.y));
        },

        _getHoleOn: function (x, y) {
            var self = this;
            var resultHole = null;

            for (var i = 0; !resultHole && i < self._holes.length; ++i) {
                var eachHole = self._holes[i];
                if (eachHole.judgeHittingPoppedMouse(x, y)) {
                    resultHole = eachHole;
                }
            }

            return resultHole;
        },

        /**
         * 开始按规则冒地鼠
         * 其实是开始更新的popInterval
         * @private
         */
        _startPop: function () {
            var self = this;

            //每过self._POP_MOUSE_INTERVAL_UPDATE_TIME更新一次pop的间隔
            self.schedule(self._updatePopMouseFactor, self._POP_MOUSE_INTERVAL_UPDATE_TIME);
            self._updatePopMouseFactor();
        },

        _updatePopMouseFactor: function () {
            var self = this;

            if (self._popMouseIntervalIndex < self._POP_MOUSE_FACTOR_LIST.length) {
                var newFactorArray = self._POP_MOUSE_FACTOR_LIST[self._popMouseIntervalIndex];

                if (newFactorArray) {
                    var newInterval = newFactorArray[0];
                    self._setPopMouseSchedule(newInterval);

                    var holeFactorSetMethodNames = [ //顺序与newFactorArray中值对应
                        null,
                        'setUncleAutoPullTime',
                        'setLoverAutoPullTime',
                        'setPopLoverProbability'
                    ];
                    for (var indexOfMethodName = 1; indexOfMethodName < holeFactorSetMethodNames.length; ++indexOfMethodName) {
                        var curMethodName = holeFactorSetMethodNames[indexOfMethodName];
                        var curFactorValue = newFactorArray[indexOfMethodName];
                        if (curFactorValue !== undefined && curFactorValue !== null) {
                            for (var indexOfHole = 0; indexOfHole < self._holes.length; ++indexOfHole) {
                                var curHole = self._holes[indexOfHole];
                                curHole[curMethodName](curFactorValue);
                            }
                        }
                    }
                }

                ++self._popMouseIntervalIndex;
            } else {
                self.unschedule(self._updatePopMouseFactor); //没有了，也就不再定时更新popFactor了
            }
        },

        _setPopMouseSchedule: function (interval) {
            var self = this;
            self.schedule(self._popMouse, interval);
        },

        _popMouse: function () {
            var self = this;

            function hasCanPopHole () {
                var has = false;
                for (var i = 0; i < self._holes.length; ++i) {
                    if (self._holes[i].canPopMouse()) {
                        has = true;
                    }
                }

                return has;
            }

            if (hasCanPopHole()) { //防止都冒出过了，用户还没点时进入死循环
                var popSuccessful = false;
                while (!popSuccessful) { //通过了hasCanPopHole()，所以最终一定能找到
                    var holeIndex = Math.round(Math.random() * (self._holes.length - 1));

                    var selectedHole = self._holes[holeIndex];
                    if (selectedHole.canPopMouse()) {
                        selectedHole.popMouse();
                        popSuccessful = true;
                    }
                }
            } else {
                //想后面要不就如果都冒出过了，没有能冒出的了，就给游戏结束？
            }
        },

        _endGame: function () {
            var self = this;
            self.unschedule(self._updatePopMouseFactor);
            self.unschedule(self._popMouse);
            self.unschedule(self._updateGameRemainTime);
            self._endCallback();
        },

        //just for Debug
        showAllAmount: function () {
            var self = this;
            var factorList = self._POP_MOUSE_FACTOR_LIST;

            if (factorList.length * self._POP_MOUSE_INTERVAL_UPDATE_TIME !== self._GAME_TIME) {
                alert('self._POP_MOUSE_FACTOR_LIST 总和与游戏时间不符~');
                return;
            }

            var wholeAmount = 0;
            var wholeUncleAmount = 0;
            var wholeLoverAmount = 0;
            var lastLoverProbability = factorList[0][3];
            for (var i = 0; i < factorList.length; ++i) {
                var curProbability = factorList[i][3];
                if (!curProbability) {
                    curProbability = lastLoverProbability;
                }

                var curAmount = self._POP_MOUSE_INTERVAL_UPDATE_TIME / factorList[i][0];
                wholeAmount += curAmount;
                wholeUncleAmount += curAmount * (1 - curProbability);
                wholeLoverAmount += curAmount * curProbability;

                lastLoverProbability = curProbability;
            }
            alert('出现地鼠总数：' + wholeAmount + ' uncle:' + wholeUncleAmount + ' lover: ' + wholeLoverAmount);
        }
    });
});
