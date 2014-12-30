/**
 * @author lvsheng
 * @date 2014/12/22
 */
define([
    '../../../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    return cc.Sprite.extend({
        ctor: function(){
            var self = this;
            self._super(resourceFileMap.pipeline.head);

        },
        tryAssemble: function (pipeline) {
            var bodyList = pipeline.getBodyList();
            for (var i = 0, assembled = false; !assembled && i < bodyList.length; ++i) {
                if (this._positionIsFit(bodyList[i])) {
                    this._assemble(bodyList[i]);
                    assembled = true;
                }
            }
            if (!assembled) { this._drop(); }
        },
        _positionIsFit: function (body) {

        },
        _assemble: function (body) {
            //TODO: run action
            body.addHead(this);
        },
        _drop: function () {

        }
    });
});
