define([], function (namespace) {
    return cc.Sprite.extend({
        ctor: function () {
            this._super();
            this.init();
        }
    });
});
