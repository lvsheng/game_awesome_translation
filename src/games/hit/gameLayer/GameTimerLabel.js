define([
    '../../../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    return cc.Sprite.extend({
        ctor: function () {
            var self = this;
            self._super();

            //初始化字段
            self._textLabel = null;
            self._actionOn = false;

            self.init();
        },
        init: function () {
            var self = this;
            self._super();

            self.setTexture(resourceFileMap.hit.timer_png);

            var textLabel = new cc.LabelTTF("45\"", "STHeiti", 30, null, cc.TEXT_ALIGNMENT_LEFT);
            textLabel.attr({
                anchorX: 0,
                x: 56,
                y: self.height * 0.5,
                fillStyle: cc.color(255, 255, 255, 255)
            });
            self._textLabel = textLabel;
            self.addChild(textLabel);
        },
        setTime: function (newTime) {
            var self = this;
            self._textLabel.string = newTime + '"';

            if (newTime <= 5 && !self._actionOn) {
                self._actionOn = true;
                self.runAction(new cc.Sequence(
                    new cc.TintTo(.5, 255, 0, 0),
//                    new cc.TintTo(.5, (255 / 5) * (5 - newTime + 1), 0, 0, 2),
                    new cc.TintTo(.5, 255, 255, 255),
                    new cc.CallFunc(function () {
                        self._actionOn = false;
                    })
                ))
            }
        },

        /**
         * 通知上次被击中的hole已经完成了击打
         * @private
         */
        _informHoleAfterHitPoppedMouse: function () {
            var self = this;
            //有可能新的hit里判断时还没有通知，也stopAllAction了，但后面其实还是执行了action里的回调导致本函数再次被调用，故需先判断
            if (!self._lastHittingHole) {return;}

            self._lastHittingHole.afterHitPoppedMouse();
            self._lastHittingHole = null;
        }
    });
});
