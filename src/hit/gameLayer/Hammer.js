define([
    '../../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    return cc.Sprite.extend({
        ctor: function () {
            var self = this;
            self._super();

            //初始化字段
            self._hittingEffect = null;
            self._lastHittingHole = null;

            self.init();
        },
        init: function () {
            var self = this;
            self._super();

            //纹理会被后面add的hammer的child覆盖掉，这里是为了设置self的宽高
            self.setTexture(resourceFileMap.hit.hammer_png);

            self._hittingEffect = new cc.Sprite(resourceFileMap.hit.hitEffect_png);
            self._hittingEffect.attr({
                x: 10,
                y: 80,
                rotation: -130,
                visible: false
            });
            self.addChild(self._hittingEffect);

            //这里是真正显示的锤子，为了把hittingEffect挡住，放在其后又添加了这个child
            var coverHammerChild = new cc.Sprite(resourceFileMap.hit.hammer_png);
            coverHammerChild.attr({
                anchorX: 0,
                anchorY: 0,
                x: 0,
                y: 0
            });
            self.addChild(coverHammerChild);

            self.setVisible(false);

            //TODO: for debug:
            window.hammer = self;
            window.hitting = self._hittingEffect;
        },
        hit: function (hammerHeadX, hammerHeadY, hittingHole) {
            var self = this;
            var anchorX = .7;
            var anchorY = .3;
            self.attr({
                anchorX: anchorX,
                anchorY: anchorY,
                rotation: 0,
                visible: true,
                x: hammerHeadX + (self.width * anchorX) - 35,
                y: hammerHeadY + (self.height * anchorY)
            });

            self.stopAllActions();
            if (self._lastHittingHole) { //上次动作里的通知还没被执行到，这里通知
                self._informHoleAfterHitPoppedMouse();
            }

            var rotationBackAction = new cc.RotateTo(.08, 50);
            var rotationDownAction = new cc.RotateTo(.03, -60);
            var delayAction = new cc.DelayTime(.02);
            var hideAction = new cc.Hide();
            if (hittingHole) {
                hittingHole.preHitPoppedMouse();
                self._lastHittingHole = hittingHole; //防止本次action被下一个hit到了直接stop导致hittingHole没有被通知到，保存之下次hit时判断并通知之

                self.runAction(new cc.Sequence(
                    rotationBackAction,
                    rotationDownAction,
                    new cc.CallFunc(function () {
                        self._hittingEffect.setVisible(true);
                        self._hittingEffect.setOpacity(255);
                        self._hittingEffect.runAction(new cc.Sequence(
                            new cc.ScaleTo(0.02, 1.5),
                            new cc.FadeOut(0.02),
                            new cc.CallFunc(function () {
                                self.runAction(hideAction);
                                self._informHoleAfterHitPoppedMouse();
                            })
                        ))
                    })
                ));
            } else {
                self.runAction(new cc.Sequence(
                    rotationBackAction,
                    rotationDownAction,
                    delayAction,
                    hideAction
                ));
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
