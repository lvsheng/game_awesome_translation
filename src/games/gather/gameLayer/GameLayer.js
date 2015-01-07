define([
    './Couple',
    './Heart',
    '../../../util/pauseGame',
    '../../../commonClass/TimerNode'
], function (Couple, Heart, pauseGame, TimerNode) {
    //这些参数单位都用比例，在计算精灵位置时再根据屏幕宽度换算成px。这样来达到不同屏幕大小下难度一致
    var INIT_DISTANCE = 0.45; //两个小人之间初始距离
    //TODO
    //var INIT_DISTANCE = 0.95; //两个小人之间初始距离
    var hear_confs = [
        //amount, lifeTime, closeUpDistance
        [5, 1.5, 0.04],
        [3, 1.2],
        [3, 1.0],
        //[5, 0.5, 0.035],
        [5, 0.8],
        //[20, 0.4, 0.03],
        [15, 0.6, 0.03],
        //[1, 0.38, 0.02],
        [1, 0.5]
    ];
    var crazy_heart_confs = [
        //amount, lifeTime, closeUpDistance
        [5, 0.5, 0.165]
        //[3, 1.2],
        //[3, 1.0],
        //[5, 0.5, 0.035],
        //[5, 0.8],
        //[20, 0.4, 0.03],
        //[15, 0.6, 0.03],
        //[1, 0.38, 0.02],
        //[1, 0.5]
    ];

    var AUTO_HIT_FOR_DEBUG = true;
    var AUTO_HIT_REACT_TIME = 0.3;

    return cc.Layer.extend({
        ctor: function (endCallback) {
            var self = this;
            self._super(); self.init();

            self._couple = new Couple(
                function(result){ result === 'meet' ? self._endGame(true) : self._endGame(false); },
                INIT_DISTANCE,
                function(){ self._turnToCrazyMode(); }
            );
            self._heartConfs = _.map(hear_confs, _.clone);
            self._hearts = [];
            self._endCallback = endCallback;
            self._tint = _.bind(self._couple.tint, self._couple);
            self._timer = (new TimerNode()).start();
            self._gatherAmount = 0;
            self._dropAmount = 0;
            self._hitNothingAmount = 0;
            self._reactTime = [];
            self._hitNothingSeparateDistance = 0;
            self.addChild(this._timer = (new TimerNode()).start());
            self._endding = false;

            self.addChild(self._couple);
            self.addChild(self._timer);

            self._addHeart();

            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                //onTouchBegan: function () { return true; },
                //onTouchMoved: _.bind(self._examHit, self)
                onTouchBegan: _.bind(self._examHit, self)
            }, self);
        },

        _examHit: function (touch) {
            if (this._endding) { return; }
            var self = this;
            var hit = false;
            var hearts = _.clone(self._hearts); //因为遍历的judgeHit中有可能删除_hearts中的元素，复制一份，以使遍历不会乱掉
            _.forEach(hearts, function (heart) {
                if (heart.judgeHit(touch.getLocation())) {
                    self._heartHit(heart);
                    hit = true;
                }
            });
            if (!hit) {
                ++this._hitNothingAmount;
                self._tint();
                self._couple.separate(self._hitNothingSeparateDistance);
            }
        },

        _getAConf: function () {
            if (!this._lastConf) { this._lastConf = {}; this._remainedAmount = 0; } //for first call
            var conf = {};

            if (this._remainedAmount > 0) {
                conf = this._lastConf;
                --this._remainedAmount;
            } else {
                var arr = this._heartConfs.shift() || [];
                this._remainedAmount = arr.shift() - 1;

                if (arr.length) {
                    function add (name) { arr.length > 0 && (conf[name] = arr.shift()); } //防止_.extend把undefined值也扩展到lastConf
                    add('lifeTime');
                    add('closeUpDistance');
                }

                conf = _.extend(this._lastConf, conf);
            }

            conf.x = 0.6 * Math.random() + 0.2;
            return conf;
        },
        _addHeart: function () {
            if (this._endding) { return; }
            var conf = this._getAConf();
            var heart = new Heart(conf.x, conf.lifeTime, _.bind(this._heartOut, this));
            heart.closeUpDistance = conf.closeUpDistance;
            heart.createTime = (new Date).getTime();
            this._hitNothingSeparateDistance = conf.closeUpDistance * 1.5;
            ++this._gatherAmount;

            this._hearts.push(heart);
            this.addChild(heart);

            if (AUTO_HIT_FOR_DEBUG) { this.scheduleOnce(function(){ this._heartHit(heart); }, AUTO_HIT_REACT_TIME) }
        },
        _heartHit: function (heart) {
            this._reactTime.push((new Date()).getTime() - heart.createTime);
            this._couple.closeUp(heart.closeUpDistance);
            this._removeHeart(heart, true);
        },
        _heartOut: function (heart) {
            ++this._dropAmount;
            this._removeHeart(heart);
        },
        _turnToCrazyMode: function () {
            this._heartConfs = _.map(crazy_heart_confs, _.clone);
        },
        /**
         * @param winning {boolean}
         * @private
         */
        _endGame: function (winning) {
            var self = this;
            self._endding = true;

            _.forEach(self._hearts, function (heart) {
                self.removeChild(heart);
            });

            function end () {
                pauseGame.pauseGame();
                var result = {
                    winning: winning,
                    time: self._timer.get(),
                    gather: self._gatherAmount,
                    drop: self._dropAmount,
                    rightRate: Math.round(self._gatherAmount / (self._gatherAmount + self._hitNothingAmount) * 100)
                };
                if (self._reactTime.length > 0) {
                    var min = Math.round(_.min(self._reactTime));
                    var average = Math.round(_.reduce(self._reactTime, function(sum, v){ return sum + v; }) / self._reactTime.length);
                    result.minReactTime = min;
                    result.averageReactTime = average;
                }

                self._endCallback(result);
            }

            if (winning) {
                self._couple.preEnd(end);
            } else {
                self._couple.fadeOut(end);
            }
        },

        _removeHeart: function (heart, animate) {
            var self = this;
            function clear () { self.removeChild(heart); }

            if (animate) {
                heart.stopAllActions();
                heart.runAction(new cc.Sequence(
                    new cc.Spawn(
                        new cc.ScaleBy(0.08, 1.2, 1.2).easing(cc.easeBackIn()).easing(cc.easeOut(10)),
                        new cc.FadeOut(0.08)
                    ),
                    new cc.CallFunc(clear)
                ));
            } else {
                clear();
            }

            self._hearts.splice(_.indexOf(self._hearts, heart), 1);
            self._addHeart(); //去掉一个就加一个。
        }
    });
});
