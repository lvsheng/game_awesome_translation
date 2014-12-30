/**
 * @author lvsheng
 * @date 2014/12/30
 */
define([
    './Body'
], function (Body) {
    var INTERVAL_DISTANCE = 80;
    return cc.Layer.extend({
        ctor: function () {
            var self = this;
            self._super(); self.init();

            self._bodyList = [];
            self._speed = 0;
            self._speedList = [
                //[speed, time]
                [100, 3],
                [80, 2],
                [70, 1]
            ];

            self.schedule(function(dt){
                self._updateSpeed();
                self._updateBodyPosition();
                self._judgeAddBody();
                self._judgeBodyOut();
            });
        },
        getBodyList: function () { return this._bodyList; },
        _updateSpeed: function () {
            //TODO: how? with _speedList
        },
        _updateBodyPosition: function () {

        },
        _judgeAddBody: function () {

        },
        _judgeBodyOut: function () {

        },
        _addBody: function () {

        },
        _removeBody: function () {

        }
    });
});
