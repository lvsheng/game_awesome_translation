define([
    '../../util/resourceFileMap'
], function (resourceFileMap) {
    return cc.Layer.extend({
        ctor: function () {
            this._super();
            this.init();

            var winSize = cc.director.getWinSize();
            var center = cc.p(winSize.width / 2, winSize.height / 2);

            var backgroundSprite = new cc.Sprite(resourceFileMap.findBackground.bg);
            backgroundSprite.attr({ anchorX: 0, anchorY: 1, x: 0, y: cc.director.getWinSize().height });
            this._scaleToCoverWindow(backgroundSprite);
            this.addChild(backgroundSprite);

            var person = new cc.Sprite(resourceFileMap.find.person);
            person.attr({anchorX: 0.5, anchorY: 0, x: center.x - 323, y: 0});
            this.addChild(person);

            this.bake();
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
