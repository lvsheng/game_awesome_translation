define([
    '../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    return cc.Layer.extend({
        ctor: function () {
            this._super();
            this.init();

            var backgroundSprite = new cc.Sprite(resourceFileMap.avoid.bg);
            backgroundSprite.attr({ anchorX: 0, anchorY: 1, x: 0, y: cc.director.getWinSize().height });
            this._scaleToCoverWindow(backgroundSprite);
            this.addChild(backgroundSprite);
        },

        //TODO:后面看这个方法抽出来作为一个统一方法？或者还是整个背景层抽出来个基类。只留出anchor、位置、游戏名作为参数？
        _scaleToCoverWindow: function (sprite) {
            //先试着以等高进行缩放
            var scale = cc.director.getWinSize().height / sprite.height;
            //水平方向有黑边、换以等宽进行缩放
            if (sprite.width * scale < cc.director.getWinSize().width) { scale = cc.director.getWinSize().width / sprite.width; }

            sprite.scale = scale;
        }
    });
});
