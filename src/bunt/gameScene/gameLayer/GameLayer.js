define(['./Cars'], function (Cars) {
    return cc.Layer.extend({
        _cars: null,

        ctor: function () {
            this._super();
            this.init();

            this.cars = new Cars();
            alert("game layer constructed")
        }
    });
});
