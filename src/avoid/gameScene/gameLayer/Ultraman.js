/**
 * @author lvsheng
 * @date 2014/12/24
 */
define([
    '../../../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    return cc.Sprite.extend({
        ctor: function () {
            this._super(resourceFileMap.avoid.ultraman);
        }
    });
});
