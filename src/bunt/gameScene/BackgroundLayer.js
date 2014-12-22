define([
    '../../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    return cc.Layer.extend({
        ctor: function () {
            this._super();
            this.init();

            var backgroundSprite = new cc.Sprite(resourceFileMap.bunt.bg);
            backgroundSprite.setPosition(cc.director.getWinSize().width / 2, cc.director.getWinSize().height / 2);
            this.addChild(backgroundSprite);
        }
    });
});
