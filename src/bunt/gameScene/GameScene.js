define([
    './BackgroundLayer',
    './GuideLayer'
], function (BackgroundLayer, GuideLayer) {
    return cc.Scene.extend({
        onEnter: function () {
            this._super();

            this.addChild(new BackgroundLayer());
            this.addChild(new GuideLayer(function () {
                alert("游戏开始！")
            }));
        }
    });
});
