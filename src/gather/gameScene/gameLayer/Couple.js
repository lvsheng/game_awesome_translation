/**
 * @author lvsheng
 * @date 2014/12/22
 */
define([
    '../../../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    return cc.Node.extend({
        _hitCount: 0,
        /**
         * @param meetCallback
         * @param outCallback
         * @param initDistance {number} 0~1的数字，1代表整个屏幕的长度
         * @param initSpeed {number} 0~1的数字，1代表整个屏幕的长度
         */
        ctor: function(meetCallback, outCallback, initDistance, initSpeed){
            this._super(); this.init();

            this._meetCallback = meetCallback;
            this._outCallback = outCallback;
            this._speed = initSpeed;
            this._distance = initDistance; //双方之间的距离，0~1
            this._left = new cc.Sprite(resourceFileMap.gather.left);
            this._right = new cc.Sprite(resourceFileMap.gather.right);

            this._left.anchorY = this._right.anchorY = 0;

            this.addChild(this._left);
            this.addChild(this._right);

            this._startSeparate();
        },

        setSpeed: function (speed) { this._speed = speed },

        //开始让两个小人向左右分离
        _startSeparate: function () {
            var self = this;
            self.schedule(function (dt) {
                self._distance += self._speed * dt;

                if (self._distance < 1) { self._updatePosition(); }
                else { self.unschedule(arguments.callee); self._outCallback(); }
            });
        },
        _updatePosition: function () {
            var winWidth = cc.director.getWinSize().width;
            var centerX = winWidth / 2;
            var offset = this._distance / 2 * winWidth;
            this._left.x = centerX - offset;
            this._right.x = centerX + offset;
        }
    });
});
