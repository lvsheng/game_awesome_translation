/**
 * @author lvsheng
 * @date 2015/1/9
 */
define([], function () {
    var ScrollMenu = cc.Menu.extend({
        ctor : function () {
            this._super();
            cc.associateWithNative(this, cc.Layer);
            this._touchListener.setSwallowTouches(false);
        }
    });
    ScrollMenu.create = function () {
        var ret = new ScrollMenu();

        if (arguments.length == 0) {
            ret.initWithItems(null, null);
        } else if (arguments.length == 1) {
            if (arguments[0]instanceof Array) {
                ret.initWithArray(arguments[0]);
                return ret;
            }
        }
        ret.initWithItems(arguments);
        return ret;
    };

    return ScrollMenu;
});
