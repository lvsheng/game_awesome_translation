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
            target.touchPY1 = touch.getLocation().y;

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
            target.touchPY2 = touch.getLocation().y;

            if (target._state !== cc.MENU_STATE_TRACKING_TOUCH) {
                cc.log("cc.Menu.onTouchEnded(): invalid state");
                return;
            }
            if (target._selectedItem) {
                target._selectedItem.unselected();
                target._selectedItem.setNodeDirty();
                if (Math.abs(target.touchPY2 - target.touchPY1) <= 5) {
                    target._selectedItem.activate();
                    $.stats.myTrack("列表页点按钮");
                }
            }
            target._state = cc.MENU_STATE_WAITING;

            if (Math.abs(target.touchPY2 - target.touchPY1) > 5) {
                $.stats.myTrack("列表页滚动");
            }
            return true;
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
            //cocos原本是在划动时将新被划动到的元素作为当前选中的元素。
            //但处于scrollView中时，在划出了菜单区域后会引发bug（菜单位置更新失效，导致下次点击时看着点中的菜单项与实际生效的被点中的菜单项出现错位）
            //并且不需要划动时更新选中元素，而可以直接认为划动了就选中已经失效，故这里不再处理
            return true;
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
