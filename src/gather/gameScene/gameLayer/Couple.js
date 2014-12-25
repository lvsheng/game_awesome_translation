/**
 * @author lvsheng
 * @date 2014/12/22
 */
define([
    '../../../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    return cc.Node.extend({
        /**
         * @param endCallback {Function} 调用时传入参数: 'meet'|'out'
         * @param initDistance {number} 0~1的数字，1代表整个屏幕的长度
         * @param initSpeed {number} 0~1的数字，1代表整个屏幕的长度
         */
        ctor: function(endCallback, initDistance, initSpeed){
            var self = this;
            self._super(); self.init();

            self._endCallback = endCallback;
            self._speed = initSpeed;
            self._distance = initDistance; //双方之间的距离。距离与left、right的位置绑定，每次更新distance，同步更新left、right位置
            self._left = new cc.Sprite(resourceFileMap.gather.left);
            self._right = new cc.Sprite(resourceFileMap.gather.right);

            self._left.anchorY = self._right.anchorY = 0;
            self.addChild(self._left);
            self.addChild(self._right);
            self._updatePosition();

            self.schedule(function (dt) { self.separate(self._speed * dt); });
        },

        setSpeed: function (speed) { this._speed = speed },
        closeUp: function (distance) {
            this._setDistance(this._distance - distance);
            if (this._isMeet()) {
                this._setDistance(this._getMeetDistance());
                //TODO:
                this.scheduleOnce(function(){ this._endCallback('meet'); }, 0.001); //为了绘制完之后再结束游戏，加个回调
            }
        },
        separate: function (distance) {
            this._setDistance(this._distance + distance);
            if (this._distance > 1) {
                this._setDistance(1);
                this.scheduleOnce(function(){ this._endCallback('out'); }, 0.001);
            }
        },

        _isMeet: function () { return this._distance <= this._getMeetDistance(); },
        _getMeetDistance: function () {
            var px = (this._left.width / 2 + this._right.width / 2) * 0.8;
            return px / cc.director.getWinSize().width;
        },
        _setDistance: function (distance) {
            this._distance = Math.abs(distance);
            this._updatePosition();
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
