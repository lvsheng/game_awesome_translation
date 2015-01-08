define([
    '../../util/resourceFileMap'
], function (resourceFileMap) {
    return cc.Layer.extend({
        ctor: function () {
            this._super();
            this.init();

            var backgroundSprite = new cc.Sprite(resourceFileMap.bunt.bg);
            backgroundSprite.attr({ anchorX: 0, anchorY: 1, x: 0, y: cc.director.getWinSize().height });
            this._scaleToFillWindow(backgroundSprite);
            this.addChild(backgroundSprite);

            this.bake();
        },

        _scaleToFillWindow: function (sprite) {
            //y方向先拉伸以保证纵向完全展示并填充窗口
            sprite.scaleY = cc.director.getWinSize().height / sprite.height;

            if (sprite.width * sprite.scaleY < cc.director.getWinSize().width) {
                //若水平方向有黑边、水平方向也拉伸
                sprite.scaleX = cc.director.getWinSize().width / sprite.width;
            } else {
                //若采用y方向拉伸比例不会有黑边，则采用相同缩放比例
                sprite.scaleX = sprite.scaleY;
            }
        }
    });
});
