define([
    '../../util/resourceFileMap'
], function (resourceFileMap) {
    return cc.Layer.extend({
        ctor: function () {
            this._super();
            this.init();

            var backgroundSprite = new cc.Sprite(resourceFileMap.find.bg);
            backgroundSprite.attr({ anchorX: 0, anchorY: 1, x: 0, y: cc.director.getWinSize().height });
            this._scaleToCoverWindow(backgroundSprite);
            this.addChild(backgroundSprite);

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
