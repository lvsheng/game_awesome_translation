define([
    '../../util/resourceFileMap'
], function (resourceFileMap) {
    return cc.Layer.extend({
        ctor: function () {
            this._super();
            this.init();

            this._backgroundSprite = new cc.Sprite(resourceFileMap.hit.background_png);
            var winSize = cc.director.getWinSize();
            this._backgroundSprite.attr({ anchorX: 0.5, anchorY: 1, x: winSize.width / 2, y: winSize.height });
            this._scaleToFillWindow(this._backgroundSprite);
            this.addChild(this._backgroundSprite);

            this.bake();
        },

        _scaleToFillWindow: function (sprite) {
            sprite.scaleX = cc.director.getWinSize().width / sprite.width;
            sprite.scaleY = cc.director.getWinSize().height / sprite.height;
        }
    });
});
