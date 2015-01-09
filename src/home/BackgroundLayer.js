define([
    '../util/resourceFileMap'
], function (resourceFileMap) {
    return cc.Layer.extend({
        ctor: function () {
            this._super();
            this.init();
            var winSize = cc.director.getWinSize();

            var bakeLayer = new cc.Layer();
            var backgroundSprite = new cc.Sprite(resourceFileMap.home.bg);
            backgroundSprite.attr({ anchorX: 0.5, anchorY: 0, x: winSize.width / 2, y: 0 });
            this._scaleToCoverWindow(backgroundSprite);
            bakeLayer.addChild(backgroundSprite);
            bakeLayer.bake();
            this.addChild(bakeLayer);

            var sun = new cc.Sprite(resourceFileMap.home.sun);
            sun.setPosition(winSize.width - 100, 189);
            this.addChild(sun);
            var cloud = new cc.Sprite(resourceFileMap.home.cloud);
            cloud.setPosition(110, 180);
            this.addChild(cloud);

            var delay = new cc.DelayTime(0);
            sun.runAction(new cc.RepeatForever(
                new cc.Sequence(
                    delay.clone(),
                    new cc.DelayTime(0.5),
                    new cc.MoveBy(1.5, 0, -25).easing(cc.easeInOut(2)),
                    new cc.DelayTime(1.5),
                    new cc.MoveBy(1.8, 0, 20).easing(cc.easeInOut(2)),
                    new cc.DelayTime(1.0)
                )
            ));
            cloud.runAction(new cc.RepeatForever(
                new cc.Sequence(
                    delay.clone(),
                    new cc.DelayTime(1.5),

                    new cc.DelayTime(0.3),
                    new cc.MoveBy(1.5, -25, -12.5).easing(cc.easeIn(2)),
                    new cc.DelayTime(1.4),
                    new cc.MoveBy(1.8, 20, 10).easing(cc.easeOut(1)),
                    new cc.DelayTime(0.6)
                )
            ))
        },

        _scaleToCoverWindow: function (sprite) {
            //先试着以等高进行缩放
            var scale = cc.director.getWinSize().height / sprite.height;
            //水平方向有黑边、换以等宽进行缩放
            if (sprite.width * scale < cc.director.getWinSize().width) { scale = cc.director.getWinSize().width / sprite.width; }

            sprite.scale = scale;
        }
    });
});
