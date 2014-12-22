define(['./BackgroundLayer'], function (BackgroundLayer) {
    return cc.Scene.extend({
        onEnter: function () {
            this._super();

            this.addChild(new BackgroundLayer());
        }
    });
});
