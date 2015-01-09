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
        },
        _onTouchBegan: function (touch, event) {
            var target = event.getCurrentTarget();
            if (target._state != cc.MENU_STATE_WAITING || !target._visible || !target.enabled)
                return false;
            for (var c = target.parent; c != null; c = c.parent) {
                if (!c.isVisible())
                    return false;
            }
            target._selectedItem = target._itemForTouch(touch);
            if (target._selectedItem) {
                target._state = cc.MENU_STATE_TRACKING_TOUCH;
                target._selectedItem.selected();
                target._selectedItem.setNodeDirty();
                return true;
            }
            return false;
        },
        _onTouchEnded: function (touch, event) {
            var target = event.getCurrentTarget();
            if (target._state !== cc.MENU_STATE_TRACKING_TOUCH) {
                cc.log("cc.Menu.onTouchEnded(): invalid state");
                return;
            }
            if (target._selectedItem) {
                target._selectedItem.unselected();
                target._selectedItem.setNodeDirty();
                target._selectedItem.activate();
            }
            target._state = cc.MENU_STATE_WAITING;
        },
        _onTouchCancelled: function (touch, event) {
            var target = event.getCurrentTarget();
            if (target._state !== cc.MENU_STATE_TRACKING_TOUCH) {
                cc.log("cc.Menu.onTouchCancelled(): invalid state");
                return;
            }
            if (this._selectedItem) {
                target._selectedItem.unselected();
                target._selectedItem.setNodeDirty();
            }
            target._state = cc.MENU_STATE_WAITING;
        },
        _onTouchMoved: function (touch, event) {
            var target = event.getCurrentTarget();
            if (target._state !== cc.MENU_STATE_TRACKING_TOUCH) {
                cc.log("cc.Menu.onTouchMoved(): invalid state");
                return;
            }
            var currentItem = target._itemForTouch(touch);
            if (currentItem != target._selectedItem) {
                if (target._selectedItem) {
                    target._selectedItem.unselected();
                    target._selectedItem.setNodeDirty();
                }
                target._selectedItem = currentItem;
                if (target._selectedItem) {
                    target._selectedItem.selected();
                    target._selectedItem.setNodeDirty();
                }
            }
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
