/**
 * @author lvsheng
 * @date 2014/12/22
 */
define([
    '../../../util/resourceFileMap'
], function (resourceFileMap) {
    //var B = 0.3;
    //var SPEED_MAP = {10: B, 9: B - 0.2, 8: B - 0.15, 7: B - 0.1, 6: B - 0.05, 5: B, 4: B, 3: B + 0.15, 2: B + 0.25, 1: B + 0.3, 0: 0};
    var B = 0.05;
    var SPEED_MAP = {10: B - 0.04, 9: B - 0.03, 8: B - 0.02};
    var CRAZY_B = 0.15;
    var CRAZY_SPEED_MAP = {10: CRAZY_B - 0.08, 9: CRAZY_B - 0.04, 8: CRAZY_B - 0.02};

    return cc.Node.extend({
        /**
         * @param endCallback {Function} 调用时传入参数: 'meet'|'out'
         * @param initDistance {number} 0~1的数字，1代表整个屏幕的长度
         * @param turnToCrazyModeFunc layer传过来的开启疯狂模式的方法
         */
        ctor: function(endCallback, initDistance, turnToCrazyModeFunc){
            var self = this;
            self._super(); self.init();

            self._endCallback = endCallback;
            self._speed = 0;
            self._distance = initDistance; //双方之间的距离。距离与left、right的位置绑定，每次更新distance，同步更新left、right位置
            self._left = new cc.Sprite(resourceFileMap.gather.left);
            self._right = new cc.Sprite(resourceFileMap.gather.right);
            self._ended = false;
            self._turnToCrazyMode = turnToCrazyModeFunc;
            self._inCrazyMode = false;
            self._endding = false;

            self._left.anchorY = self._right.anchorY = 0;
            self.addChild(self._left);
            self.addChild(self._right);
            self._updatePosition();

            self.schedule(function (dt) {
                var map = self._inCrazyMode ? CRAZY_SPEED_MAP : SPEED_MAP;
                var b = self._inCrazyMode ? CRAZY_B : B;
                var speed = map[Math.ceil((self._distance  - self._getMeetDistance()) * 10)] || b;
                self.separate(speed * dt);
            });
        },

        closeUp: function (distance) {
            var self = this;
            self._setDistance(self._distance - distance);
            if (self._distance - self._getMeetDistance() <= 0.065 && !self._inCrazyMode) {
                //启动疯狂模式
                self.tint();
                self._inCrazyMode = true;
                self._distance += 0.18;
                self._turnToCrazyMode();
            }
        },
        separate: function (distance) {
            if (this._endding) { return; }
            this._setDistance(this._distance + distance);
        },

        tint: function () {
            var action = new cc.Sequence(
                new cc.TintTo(0.1, 255, 150, 150),
                new cc.TintTo(0.2, 255, 255, 255)
            );
            this._left.runAction(action);
            this._right.runAction(action.clone());
        },
        fadeOut: function (callback) {
            var action = new cc.Sequence(
                new cc.TintTo(0.1, 150, 150, 150),
                new cc.TintTo(0.2, 255, 255, 255),
                new cc.FadeOut(1)
            );
            this._left.runAction(action);
            this._right.runAction(new cc.Sequence(
                action.clone(),
                new cc.CallFunc(callback)
            ));
        },
        preEnd: function (callback) {
            var self = this;
            self._endding = true;
            var blinkAction = new cc.Sequence(
                new cc.Blink(0.3, 1.58)
            );
            self._left.runAction(blinkAction);
            self._right.runAction(new cc.Sequence(
                blinkAction.clone(),
                new cc.CallFunc(function(){
                    self.runAction(new cc.Sequence(
                        new cc.MoveBy(1, 0, 200),
                        new cc.CallFunc(callback)
                    ));
                })
            ));
        },

        _isMeet: function () { return this._distance <= this._getMeetDistance(); },
        _getMeetDistance: function () {
            var px = (this._left.width / 2 + this._right.width / 2) * 0.8;
            return px / cc.director.getWinSize().width;
        },
        _setDistance: function (distance) {
            var self = this;
            if (distance < self._getMeetDistance()) { distance = self._getMeetDistance(); }
            else if (distance > 1) { distance = 1; }

            self._distance = distance;

            if (self._distance >= 1) { self.scheduleOnce(function(){ self._endGame('out'); }); } //直接end会导致运行结果的下一帧不被绘制，故加个schedule
            else if (self._isMeet()) { self.scheduleOnce(function(){ self._endGame('meet'); }); }

            self._updatePosition();
        },
        _updatePosition: function () {
            var self = this;
            var winWidth = cc.director.getWinSize().width;
            var centerX = winWidth / 2;
            var offset = self._distance / 2 * winWidth;
            self._left.x = centerX - offset;
            self._right.x = centerX + offset;
        },
        /**
         * @param result {string} 'out'|'meet'
         * @private
         */
        _endGame: function (result) {
            //防止结束后再次autoSeparate导致再次执行_endGame,(unschedule也无效。。）
            if (!this._ended) {
                this._endCallback(result);
                this._ended = true;
            }
        }
    });
});