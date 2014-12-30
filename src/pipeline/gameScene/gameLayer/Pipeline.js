/**
 * @author lvsheng
 * @date 2014/12/30
 */
define([
    './Body'
], function (Body) {
    var INTERVAL_DISTANCE = 80; //body间前一个右边与后一个左边的距离
    var DEFAULT_TIME = 0.1;
    return cc.Layer.extend({
        ctor: function () {
            var self = this;
            self._super(); self.init();

            self._bodyList = [];
            self._speed = 0;
            self._speedList = [
                //[speed, time]
                [150, 5.1],
                [200, 2],
                [300, 2],
                [400, 1],
                [500],
                [300],
                [500],
                [300],
                [500],
                [200],
                [500],
                [100],
                [600, 3],
                [700, 4]
            ];
            self._conf = null;
            self._oldConf = null;

            self.schedule(function(dt){
                self._updateSpeed(dt);
                self._updateBodyPosition(dt);
                self._judgeAddBody(dt);
                self._judgeBodyOut(dt);
            });
        },
        getBodyList: function () { return this._bodyList; },
        _updateSpeed: function (dt) {
            if (!this._conf || this._conf.time <= 0) { this._conf = this._getNextConf(); }
            this._conf.time -= dt;
            this._speed = this._conf.speed;
        },
        _updateBodyPosition: function (dt) {
            var self = this;
            var delta = self._speed * dt;
            _.forEach(self._bodyList, function (eachBody) { eachBody.setBodyPosition(eachBody.x - delta); });
        },
        _judgeAddBody: function () {
            var needAdd;

            if (this._bodyList.length <= 0) { needAdd = true; }
            else {
                var lastBody = this._bodyList[this._bodyList.length - 1];
                var distance = this._getNewBodyPosition() - lastBody.x;
                needAdd = distance >= (INTERVAL_DISTANCE + this._getBodyWidth());
            }

            if (needAdd) { this._addBody(); }
        },
        _judgeBodyOut: function () {
            var firstBody = this._bodyList[0];
            var needOut = firstBody && firstBody.x < -firstBody.width / 2;
            if (needOut) { this._removeFirstBody(); }
        },

        _addBody: function () {
            var body = new Body();
            body.attr({
                x: this._getNewBodyPosition(),
                y: body.height * body.anchorY //恰好body的底与layer的底重合
            });
            this._bodyList.push(body);
            this.addChild(body)
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
        _getNewBodyPosition: function () { return cc.director.getWinSize().width + this._getBodyWidth() / 2; },
        _getBodyWidth: function () {
            if (!this._bodyWidth) { this._bodyWidth = (new Body()).width; }
            return this._bodyWidth;
        }
    });
});
