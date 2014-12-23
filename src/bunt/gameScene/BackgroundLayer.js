define([
    '../../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    return cc.Layer.extend({
        ctor: function () {
            this._super();
            this.init();

            var backgroundSprite = new cc.Sprite(resourceFileMap.bunt.bg);
            backgroundSprite.setPosition(cc.director.getWinSize().width / 2, cc.director.getWinSize().height / 2);
            this._scaleToCoverWindow(backgroundSprite);
            this.addChild(backgroundSprite);
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
