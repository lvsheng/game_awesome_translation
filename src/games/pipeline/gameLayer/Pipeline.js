/**
 * @author lvsheng
 * @date 2014/12/30
 */
define([
    './Body'
], function (Body) {
    var INTERVAL_DISTANCE = 330;
    var INTERVAL_DISTANCE_RANDOM_RANGE = 150;
    var DEFAULT_TIME = 1;
    return cc.Layer.extend({
        ctor: function () {
            var self = this;
            self._super(); self.init();

            self._bodyList = [];
            self._speed = 0;
            self._speedList = [
                //[speed, time]
                //[150, 3]
                [100, 8],
                [150, 5],
                [165, 3],
                [180, 3],
                [200, 3],
                //[250],
                [300, 3],
                [350]
                //[350]
                //[400],
                //[450],
                //[500],
                //[550],
                //[600],
                //[650],
                //[700],
                //[750],
                //[800],
                //[850],
                //[900]
            ];
            self._conf = null;
            self._oldConf = null;
            self._stopped = false;

            self.schedule(function(dt){
                self._updateSpeed(dt);
                self._updateBodyPosition(dt);
                self._judgeAddBody(dt);
                self._judgeBodyOut(dt);
            });
        },
        getBodyList: function () { return this._bodyList; },
        getSpeed: function () { return this._speed; },
        _updateSpeed: function (dt) {
            if (!this._conf || this._conf.time <= 0) { this._conf = this._getNextConf(); }
            this._conf.time -= dt;
            this._speed = this._conf.speed;
        },
        _updateBodyPosition: function (dt) {
            var self = this;
            if (self._stopped) { return; }
            var delta = self._speed * dt;
            _.forEach(self._bodyList, function (eachBody) { eachBody.setBodyPosition(eachBody.x - delta); });
        },
        _judgeAddBody: function () {
            var needAdd;

            if (this._bodyList.length <= 0) { needAdd = true; }
            else {
                needAdd = this._getNewBodyPosition() - cc.director.getWinSize().width <= this._getBodyWidth() / 2 + 5;
            }
            if (needAdd) { this._addBody(this._getNewBodyPosition()); }
        },
        _judgeBodyOut: function () {
            var firstBody = this._bodyList[0];
            var needOut = firstBody && firstBody.x < -firstBody.width / 2;
            if (needOut) { this._removeFirstBody(); }
        },

        _addBody: function (x) {
            if (this._stopped) { return; }

            var body = new Body();
            body.attr({
                x: x,
                y: body.height * body.anchorY //恰好body的底与layer的底重合
            });
            this._bodyList.push(body);
            this.addChild(body);

            this._nextOffset = null;
        },
        _removeFirstBody: function () { this._bodyList.shift().remove(); },

        _getNextConf: function () {
            var arr = this._speedList.shift();
            if (!arr) { return _.clone(this._oldConf); }
            var conf = { speed: arr[0], time: arr[1] };
            if (!conf.time) { conf.time = DEFAULT_TIME; }
            this._oldConf = _.clone(conf);
            return conf;
        },
        _getNewBodyPosition: function () {
            if (!this._nextOffset) {
                this._nextOffset = Math.random() * INTERVAL_DISTANCE_RANDOM_RANGE * 2 - INTERVAL_DISTANCE_RANDOM_RANGE;
            }

            if (this._bodyList.length === 0) {
                return cc.director.getWinSize().width / 2;
            } else {
                //在现有最后一个body的后方INTERVAL_DISTANCE远处加
                return this._bodyList[this._bodyList.length - 1].x + INTERVAL_DISTANCE + this._nextOffset;
            }
        },
        _getBodyWidth: function () {
            if (!this._bodyWidth) {
                this._bodyWidth = (new Body()).width;
            }
            return this._bodyWidth;
        },
        stopRun: function () { this._stopped = true; },
        blink: function (callback) {
            if (this._bodyList.length === 0) {
                callback();
            } else {
                this._bodyList[0].blink(callback);
                for (var i = 1; i < this._bodyList.length; ++i) { this._bodyList[i].blink(); }
            }
        }
    });
});
