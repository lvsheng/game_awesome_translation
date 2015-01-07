/**
 * @author lvsheng
 * @date 2015/1/8
 */
define([

], function () {
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

            var fasterText = level === 0 ? 'Faster!' : 'Fasterer!';
            var label = new cc.LabelTTF(fasterText, "STHeiti", 180, null, cc.TEXT_ALIGNMENT_CENTER);
            label.attr({
                x: center.x,
                y: center.y,
                fillStyle: cc.color(255, 255, 255, 255)
            });
            self.addChild(label);

            label.runAction(new cc.Sequence(
                new cc.ScaleBy(0.05, 0.7),
                new cc.ScaleBy(1, 1.3).easing(cc.easeElasticOut(0.1)),
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

            //吞噬下面层的触摸.. 不成功。。。
            //function no () { return false; }
            //cc.eventManager.addListener(cc.EventListener.create({
            //    event: cc.EventListener.TOUCH_ONE_BY_ONE,
            //    swallowTouches: true,
            //    onTouchBegan: no,
            //    onTouchMoved: no,
            //    onTouchEnded: no,
            //    onTouchCancelled: no
            //}), self);
        }
    });
});
