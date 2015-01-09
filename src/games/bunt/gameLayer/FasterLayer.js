/**
 * @author lvsheng
 * @date 2015/1/8
 */
define([
    '../../../util/resourceFileMap'
], function (resourceFileMap) {
    return cc.Layer.extend({
        /**
         * @param endCallback
         * @param level 0|1 0对应文案faster,1对应文案fasterer
         */
        ctor: function (endCallback, level) {
            var self = this;
            var winSize = cc.director.getWinSize();
            var center = cc.p(winSize.width / 2, winSize.height / 2);
            self._super(); self.init();

            var shadowLayer = new cc.LayerColor(cc.color(0, 0, 0, 100), winSize.width, winSize.height);
            self.addChild(shadowLayer);

            var faster = new cc.Sprite(resourceFileMap.bunt.faster);
            faster.attr({
                x: center.x,
                y: center.y
            });
            faster.scale = 0.6;
            self.addChild(faster);

            var scaleAction;
            //faster
            if (level === 0) {
                scaleAction = new cc.Sequence(
                    new cc.ScaleTo(0.05, 0.4),
                    new cc.ScaleTo(1, 0.7).easing(cc.easeElasticOut(0.1))
                );
            }
            //fasterer
            else {
                scaleAction = new cc.Sequence(
                    new cc.ScaleTo(0.05, 0.4),
                    new cc.ScaleTo(1, 1).easing(cc.easeElasticOut(0.1))
                );
            }
            faster.runAction(new cc.Sequence(
                scaleAction,
                new cc.CallFunc(function () {
                    cc.eventManager.addListener({
                        event: cc.EventListener.TOUCH_ONE_BY_ONE, //这里的ONE_BY_ONE指的是多个手指时
                        swallowTouches: true,
                        onTouchBegan: function(){
                            endCallback();
                        }
                    }, self);
                    self.scheduleOnce(endCallback, 1.5);
                })
            ));
        }
    });
});
