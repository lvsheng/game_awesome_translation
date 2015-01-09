define([
    '../../../util/resourceFileMap',
    '../scoreManager',
    './zIndexConf'
], function (resourceFileMap, scoreManager, zIndexConf) {
    return cc.Sprite.extend({
        _STATUS: {
            idle: 'idle',
            mouseOn: 'mouseOn',
            animating: 'animating'
        },

        _SAYING_AMOUNT: 6,

        ctor: function () {
            var self = this;
            self._super();

            //字段声明
            self._status = self._STATUS.idle;
            self._poppedMouse = null;

            self._uncle = null;
            self._lover1 = null;
            self._lover2 = null;
            self._leftHeart = null;
            self._rightHeart = null;
            self._fog = null;
            self._plusOne = null;
            self._mouseMask = null;

            self._uncleSayings = [];
            self._loverSayings = [];

            self._mousePopOnAction = null;
            self._mousePullAction = null;

            self._uncleAutoPullTime = 3;
            self._loverAutoPullTime = 2;
            self._popLoverProbability = 0.2;

            self._initialAttr = {
                hidingMouseY: null,
                fog: null,
                leftHeart: null,
                rightHeart: null,
                plusOne: null
            };
            self._hidingMouseY = null;

            self.init();
        },
        init: function () {
            var self = this;
            self._super();

            self._initialView();
            self._initialAction();
        },

        canPopMouse: function () {
            return this._status === this._STATUS.idle;
        },
        hasMouseOn: function () {
            return this._status === this._STATUS.mouseOn;
        },
        judgeHittingPoppedMouse: function (x, y) {
            var self = this;
            var HITTING_AREA_HEIGHT = 190;
            var HITTING_AREA_WIDTH = 160;
            var positionReferAnchor = self.convertToNodeSpaceAR(cc.p(x, y));
            var positionReferBase = cc.p(positionReferAnchor.x, positionReferAnchor.y + 62); //相对于电视机底线的中点

            if (self.hasMouseOn()) {
                return (
                (positionReferBase.y > 0 && positionReferBase.y <= HITTING_AREA_HEIGHT)
                && (Math.abs(positionReferBase.x) < HITTING_AREA_WIDTH / 2)
                );
            } else {
                return false;
            }
        },

        popMouse: function () {
            var self = this;
            var lover = Math.random() <= 0.5 ? self._lover1 : self._lover2;
            var poppedMouse = Math.random() <= self._popLoverProbability ? lover : self._uncle;

            self._poppedMouse = poppedMouse;
            self._status = self._STATUS.mouseOn;
            poppedMouse.runAction(self._mousePopOnAction);

            //防止冒出新鼠时与雾重叠
            self._fog.stopAllActions();
            self._fog.setVisible(false);

            var autoPullTime = (poppedMouse === lover ? self._loverAutoPullTime : self._uncleAutoPullTime);
            self.scheduleOnce(self._autoPullPoppedMouse, autoPullTime);
        },
        preHitPoppedMouse: function () {
            var self = this;

            self._status = self._STATUS.animating; //animating之后不能再放鼠也不能再被打
            self.unschedule(self._autoPullPoppedMouse);
        },
        //由hammer执行完挥锤子动画后调用
        afterHitPoppedMouse: function () {
            var self = this;
            if (self._poppedMouse === self._uncle) {
                self._poppedMouse.runAction(new cc.Sequence(
                    new cc.Spawn(
                        self._mousePullAction,
                        new cc.CallFunc(function () {
                            self._fog.attr(self._initialAttr.fog);
                            self._fog.setVisible(true);
                            self._fog.runAction(new cc.Sequence(
                                new cc.Spawn(
                                    new cc.ScaleTo(0.05, 1),
                                    new cc.FadeIn(0.05)
                                )
                            ));
                        })
                    ),
                    new cc.CallFunc(function () {
                        scoreManager.hitOneSuccessful();
                        self._fog.runAction(
                            new cc.FadeOut(0.2)
                        );
                        self._plusOne.attr(self._initialAttr.plusOne);
                        self._plusOne.setVisible(true);
                        self._plusOne.runAction(new cc.Spawn(
                            new cc.Sequence(
                                new cc.FadeIn(0.02),
                                new cc.FadeOut(0.8)
                            ),
                            new cc.MoveBy(0.82, 20, 60)
                        ));
                    })
                ));
            } else {
                self._poppedMouse.runAction(new cc.Sequence(
                    self._mousePullAction,
                    new cc.CallFunc(function () {
                        scoreManager.hitLover();
                        var heartNames = ['leftHeart', 'rightHeart'];
                        var animateTime = .3;
                        var rotateTo;
                        for (var i = 0; i < heartNames.length; ++i) {
                            var currentHeartName = heartNames[i];
                            var currentHeart = self['_' + currentHeartName];
                            rotateTo = currentHeartName === 'leftHeart' ? -70 : 70;

                            var animateInTimeRate = 0.2;
                            var animateInTime = animateTime * animateInTimeRate;
                            var animateOutTime = animateTime * (1 - animateInTimeRate);
                            currentHeart.attr(self._initialAttr[currentHeartName]);
                            currentHeart.setVisible(true);
                            currentHeart.runAction(new cc.Sequence(
                                new cc.FadeIn(animateInTime),
                                new cc.Spawn(
                                    new cc.EaseIn(new cc.RotateTo(animateOutTime, rotateTo), 0.4),
                                    new cc.FadeOut(animateOutTime)
                                )
                            ));
                        }
                    })
                ));
            }
        },

        setUncleAutoPullTime: function (newTime) {
            this._uncleAutoPullTime = newTime;
        },
        setLoverAutoPullTime: function (newTime) {
            this._loverAutoPullTime = newTime;
        },
        setPopLoverProbability: function (newProbability) {
            this._popLoverProbability = newProbability;
        },

        _initialView: function () {
            var self = this;

            self.setTexture(resourceFileMap.hit.hole_png);
            var anchorX = self.width / 2;
            var anchorY = self.height / 2;

            var lover2 = new cc.Sprite(resourceFileMap.hit.lover2_png);
            var hidingMouseY = anchorY - (lover2.height / 2) - 62; //lover2最高
            self._initialAttr.hidingMouseY = hidingMouseY;
            lover2.attr({
                x: anchorX,
                y: hidingMouseY,
                zIndex: zIndexConf.hitBeing
            });
            self.addChild(lover2);
            self._lover2 = lover2;

            var uncle = new cc.Sprite(resourceFileMap.hit.uncle_png);
            uncle.attr({
                x: anchorX,
                y: hidingMouseY,
                anchorX: 0.6,
                zIndex: zIndexConf.hitBeing
            });
            self.addChild(uncle);
            self._uncle = uncle;

            var lover1 = new cc.Sprite(resourceFileMap.hit.lover1_png);
            lover1.attr({
                x: anchorX,
                y: hidingMouseY,
                zIndex: zIndexConf.hitBeing
            });
            self.addChild(lover1);
            self._lover1 = lover1;

            var leftHeart = new cc.Sprite(resourceFileMap.hit.heartLeft_png);
            var heartY = anchorY + leftHeart.height / 2 + 30;
            self._initialAttr.leftHeart = {
                anchorX: 1,
                anchorY: 0,
                x: anchorX - 2,
                y: heartY,
                zIndex: zIndexConf.effectProp,
                visible: false,
                opacity: 255,
                rotation: 0
            };
            leftHeart.attr(self._initialAttr.leftHeart);
            self.addChild(leftHeart);
            self._leftHeart = leftHeart;

            var rightHeart = new cc.Sprite(resourceFileMap.hit.heartRight_png);
            self._initialAttr.rightHeart = {
                anchorX: 0,
                anchorY: 0,
                x: anchorX + 2,
                y: heartY,
                zIndex: zIndexConf.effectProp,
                visible: false,
                opacity: 255,
                rotation: 0
            };
            rightHeart.attr(self._initialAttr.rightHeart);
            self.addChild(rightHeart);
            self._rightHeart = rightHeart;

            var plusOne = new cc.Sprite(resourceFileMap.hit.plus_png);
            var plusOneY = anchorY + plusOne.height / 2 + 70;
            self._initialAttr.plusOne = {
                x: anchorX,
                y: plusOneY,
                zIndex: zIndexConf.effectProp,
                visible: false,
                opacity: 0
            };
            plusOne.attr(self._initialAttr.plusOne);
            self.addChild(plusOne);
            self._plusOne = plusOne;

            var fog = new cc.Sprite(resourceFileMap.hit.fog_png);
            fog.attr({
                x: anchorX,
                y: anchorY + 13,
                zIndex: zIndexConf.effectProp,
                visible: false,
                scale: .7
            });
            self.addChild(fog);
            self._fog = fog;

            var mouseMask = new cc.Sprite(resourceFileMap.hit.mask_png);
            mouseMask.attr({
                anchorX: 0.5,
                anchorY: 1,
                x: anchorX - 7,
                y: anchorY + 32,
                zIndex: zIndexConf.holeMask
            });
            self.addChild(mouseMask);
            self._mouseMask = mouseMask;

            self._initialSayings();
        },

        _initialSayings: function () {
            var self = this;
            var SAYING_AMOUNT = self._SAYING_AMOUNT;
            var anchorX = self.width / 2;
            var anchorY = self.height / 2;


            for (var i = 1; i <= SAYING_AMOUNT; ++i) {
                var curUncleSaying = new cc.Sprite(resourceFileMap['uncleSaying' + i + '_png']);
                var uncleSayAnchorX = 0.64; //都是右边出
                curUncleSaying.attr({
                    anchorX: uncleSayAnchorX,
                    anchorY: 1,
                    x: anchorX + (uncleSayAnchorX - 0.5) * curUncleSaying.width,
                    y: anchorY - 10,
                    zIndex: zIndexConf.effectProp,
                    visible: false
                });
                self.addChild(curUncleSaying);
                self._uncleSayings.push(curUncleSaying);

                var curLoverSaying = new cc.Sprite(resourceFileMap['loverSaying' + i + '_png']);
                var loverSayAnchorX = 0.44;
                curLoverSaying.attr({
                    anchorX: loverSayAnchorX,
                    anchorY: 1,
                    x: anchorX + (loverSayAnchorX - 0.5) * curLoverSaying.width,
                    y: anchorY - 10,
                    zIndex: zIndexConf.effectProp,
                    visible: false
                });
                self.addChild(curLoverSaying);
                self._loverSayings.push(curLoverSaying);
            }
        },

        _initialAction: function () {
            var self = this;

            var holeAnchorY = self.height / 2;
            var mousePopOnMoveAction = new cc.MoveTo(0.1, self._lover2.x, holeAnchorY + self._lover2.height / 2 - 62);
            var mousePullMoveAction = new cc.MoveTo(0.06, self._lover2.x, self._initialAttr.hidingMouseY);

            self._mousePopOnAction = new cc.Sequence(
                new cc.EaseIn(mousePopOnMoveAction, .8)
            );
            self._mousePullAction = new cc.Sequence(
                new cc.EaseIn(mousePullMoveAction, .8),
                new cc.CallFunc(function () {
                    self._status = self._STATUS.idle;
                })
            );
        },

        _autoPullPoppedMouse: function () {
            var self = this;
            self._status = self._STATUS.animating;
            self._poppedMouse.runAction(self._mousePullAction);
        }
    });
});
