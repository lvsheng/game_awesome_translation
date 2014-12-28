define([
    './Couple',
    './Heart',
    '../../../gameUtil/pauseGame',
    '../../../commonClass/TimerNode'
], function (Couple, Heart, pauseGame, TimerNode) {
    //这些参数单位都用比例，在计算精灵位置时再根据屏幕宽度换算成px。这样来达到不同屏幕大小下难度一致
    var INIT_DISTANCE = 0.5; //两个小人之间初始距离
    var HEART_CONFS = [
        //x, nextTime, lifeTime, closeUpDistance
        [0.3, 0.5, 1.2, 0.02],
        //[0.3, 0.5, 1.2, 0.2, 0],
        [0.5],
        [0.7]
        ,
        [0.7, 0.6, 0.7],
        [0.5],
        [0.3],

        //[0.5, 0.4, 0.6, 0.18],
        [0.5, 0.6, 0.6, 0.04],
        [0.5],
        [0.5],
        [0.5],
        [0.5],

        [0.1, 0.6, 0.5, 0.035],
        [0.2],
        [0.3],
        [0.4],
        [0.5],

        [0.5, 0.6, 0.4],
        [0.6],
        [0.7],
        [0.8],
        [0.9],

        [0.5, 0.6, 0.4, 0.03], //20个
        [0.4],
        [0.3],
        [0.2],
        [0.1],
        [0.1],
        [0.2],
        [0.3],
        [0.4],
        [0.5],
        [0.5],
        [0.6],
        [0.7],
        [0.8],
        [0.9],
        [0.9],
        [0.8],
        [0.7],
        [0.6],
        [0.5],

        [30, 0.6, 0.38, 0.02],
        [30, 0.6, 0.35]
    ];

    return cc.Layer.extend({
        ctor: function (endCallback) {
            var self = this;
            self._super(); self.init();

            self._couple = new Couple(
                function(result){ result === 'meet' ? self._endGame(true) : self._endGame(false); },
                INIT_DISTANCE
            );
            self._heartConfs = _.map(HEART_CONFS, _.clone);
            self._hearts = [];
            self._endCallback = endCallback;
            self._tint = _.bind(self._couple.tint, self._couple);
            self._timer = (new TimerNode()).start();
            self._gatherAmount = 0;
            self._dropAmount = 0;
            self._hitNothingSeparateDistance = 0;

            self.addChild(self._couple);
            self.addChild(self._timer);

            self._launchHearts();

            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                //onTouchBegan: function () { return true; },
                //onTouchMoved: _.bind(self._examHit, self)
                onTouchBegan: _.bind(self._examHit, self)
            }, self);
        },

        _examHit: function (touch) {
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
                self._tint();
                self._couple.separate(self._hitNothingSeparateDistance);
            }
        },

        _launchHearts: function () {
            var self = this;

            function each () {
                var conf = self._getAConf();
                self._addHeart(conf);
                self.scheduleOnce(function () { each(); }, conf.nextTime);
            }
            each();
        },

        _getAConf: function () {
            if (!this._lastConf) { this._lastConf = {}; } //for first call

            var conf = {};
            var arr = this._heartConfs.shift() || [];

            if (arr.length) {
                function add (name) { arr.length > 0 && (conf[name] = arr.shift()); }
                add('x');
                add('nextTime');
                conf.nextTime = 0.5;
                add('lifeTime');
                add('closeUpDistance');
            }
            conf.x = 0.6 * Math.random() + 0.2;

            conf = _.extend(this._lastConf, conf);
            return conf;
        },
        _addHeart: function (conf) {
            var heart = new Heart(conf.x, conf.lifeTime, _.bind(this._heartHit, this), _.bind(this._heartOut, this));
            heart.closeUpDistance = conf.closeUpDistance;
            this._hitNothingSeparateDistance = conf.closeUpDistance * 0.5;
            this._hearts.push(heart);
            this.addChild(heart);
        },
        //这两个方法由heart对象在其自身被点击或移出屏幕时调用
        _heartHit: function (heart) {
            ++this._gatherAmount;
            this._couple.closeUp(heart.closeUpDistance);
            this._removeHeart(heart);
        },
        _heartOut: function (heart) {
            ++this._dropAmount;
            this._removeHeart(heart);
        },
        /**
         * @param winning {boolean}
         * @private
         */
        _endGame: function (winning) {
            pauseGame();
            //result应包括胜负信息、用了多少时间、用户点击了多少下
            this._endCallback({
                winning: winning,
                gather: this._gatherAmount,
                drop: this._dropAmount
            });
        },

        _removeHeart: function (heart) {
            this.removeChild(heart);
            this._hearts.splice(_.indexOf(this._hearts, heart), 1);
        }
    });
});
