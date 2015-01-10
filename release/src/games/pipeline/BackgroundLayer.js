define([
    '../../util/resourceFileMap'
], function (resourceFileMap) {
    return cc.Layer.extend({
        ctor: function () {
            this._super();
            this.init();

            this._backgroundSprite = new cc.Sprite(resourceFileMap.pipelineBackground.bg);
            var winSize = cc.director.getWinSize();
            this._backgroundSprite.attr({ anchorX: 1, anchorY: 1, x: winSize.width, y: winSize.height });
            this._scaleToCoverWindow(this._backgroundSprite);
            this.addChild(this._backgroundSprite);

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