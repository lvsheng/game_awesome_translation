define([
    './Couple',
    './Heart',
    '../../../gameUtil/pauseGame',
    '../../../commonClass/TimerNode'
], function (Couple, Heart, pauseGame, TimerNode) {
    //这些参数单位都用比例，在计算精灵位置时再根据屏幕宽度换算成px。这样来达到不同屏幕大小下难度一致
    var INIT_DISTANCE = 0.5; //两个小人之间初始距离
    var CLOSE_UP_DISTENCE = 0.03;
    var HEART_CONFS = [
        //amount, nextTime, lifeTime
        [5, 0.5, 1.2],
        [10, 0.4, 1.2],
        [15, 0.3, 0.9],
        [5, 0.3, 0.9],
        [5, 0.3, 0.85],
        [30, 0.3, 0.85],
        [30, 0.3, 0.75],
        [10, 0.3, 0.55]
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
            self._timer = (new TimerNode()).start();
            self._gatherAmount = 0;
            self._dropAmount = 0;

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
            _.forEach(self._hearts, function (heart) {
                if (heart.judgeHit(touch.getLocation())) {
                    self._heartHit(heart);
                }
            });
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
            if (this._lastConf.amount > 0) {
                --this._lastConf.amount;
                conf = this._lastConf;
            } else {
                var arr = this._heartConfs.shift() || [];

                function add (name) { arr.length > 0 && (conf[name] = arr.shift()); }
                add('amount');
                add('nextTime');
                add('lifeTime');

                //其他属性可以没有，即使用旧值。但x必需每次有一个新值
                conf = _.extend(this._lastConf, conf); //为支持配置时可以省略，这里extend以对本次没有指明的属性取上次值
            }
            //conf.x = 0.25 * Math.random() + 0.385;
            conf.x = 0.8 * Math.random() + 0.1;
            return conf;
        },
        _addHeart: function (conf) {
            var heart = new Heart(conf.x, conf.lifeTime, _.bind(this._heartHit, this), _.bind(this._heartOut, this));
            this._hearts.push(heart);
            this.addChild(heart);
        },
        //这两个方法由heart对象在其自身被点击或移出屏幕时调用
        _heartHit: function (heart) {
            ++this._gatherAmount;
            this._couple.closeUp(CLOSE_UP_DISTENCE);
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
