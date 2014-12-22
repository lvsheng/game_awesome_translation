define([
    '../../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    return cc.Layer.extend({
        ctor: function () {
            this._super();
            this.init();
            var windowSize = cc.director.getWinSize();

            var centerPosition = cc.p(windowSize.width / 2, windowSize.height / 2);
            var backgroundSprite = new cc.Sprite(resourceFileMap.bunt.bg);
            backgroundSprite.setPosition(centerPosition.x, centerPosition.y);
            this.addChild(backgroundSprite);
        }
    });
});
