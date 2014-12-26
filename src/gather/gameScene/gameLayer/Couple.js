/**
 * @author lvsheng
 * @date 2014/12/22
 */
define([
    '../../../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    var B = 0.3;
    var SPEED_MAP = {10: B, 9: B - 0.2, 8: B - 0.15, 7: B - 0.1, 6: B - 0.05, 5: B, 4: B, 3: B + 0.15, 2: B + 0.25, 1: B + 0.3};

    return cc.Node.extend({
        /**
         * @param endCallback {Function} 调用时传入参数: 'meet'|'out'
         * @param initDistance {number} 0~1的数字，1代表整个屏幕的长度
         */
        ctor: function(endCallback, initDistance){
            var self = this;
            self._super(); self.init();

            self._endCallback = endCallback;
            self._speed = 0;
            self._distance = initDistance; //双方之间的距离。距离与left、right的位置绑定，每次更新distance，同步更新left、right位置
            self._left = new cc.Sprite(resourceFileMap.gather.left);
            self._right = new cc.Sprite(resourceFileMap.gather.right);

            self._left.anchorY = self._right.anchorY = 0;
            self.addChild(self._left);
            self.addChild(self._right);
            self._updatePosition();

            self.schedule(function (dt) {
                var matchSpeed = SPEED_MAP[Math.ceil((self._distance - self._getMeetDistance()) * 10)];
                //(matchSpeed > self._speed) && (self._speed = matchSpeed);
                self._speed = matchSpeed;
                self.separate(self._speed * dt);
            });
        },

        //setSpeed: function (speed) { this._speed = speed },
        closeUp: function (distance) {
            this._setDistance(this._distance - distance);
            if (this._isMeet()) {
                //TODO:
                this.scheduleOnce(function(){ this._endCallback('meet'); }, 0.001); //为了绘制完之后再结束游戏，加个回调
            }
        },
        separate: function (distance) {
            this._setDistance(this._distance + distance);
            if (this._distance === 1) {
                this.scheduleOnce(function(){ this._endCallback('out'); }, 0.001);
            }
        },

        _isMeet: function () { return this._distance <= this._getMeetDistance(); },
        _getMeetDistance: function () {
            var px = (this._left.width / 2 + this._right.width / 2) * 0.8;
            return px / cc.director.getWinSize().width;
        },
        _setDistance: function (distance) {
            if (distance < this._getMeetDistance) { distance = this._getMeetDistance(); }
            if (distance > 1) { distance = 1; }
            this._distance = distance;
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
