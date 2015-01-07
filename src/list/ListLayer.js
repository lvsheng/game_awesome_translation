/**
 * @author lvsheng
 * @date 2015/1/3
 */
define([
    '../util/resourceFileMap'
], function (resourceFileMap) {
    return cc.Layer.extend({
        ctor: function(enterAGame){
            var self = this;
            self._super(); self.init();
            var winSize = cc.director.getWinSize();

            //定位思路：为了整个屏都可以触摸以滑动，将scrollView设为整个屏幕大小。
            //container高超高，宽与屏幕相同。以0,0定位。而每一个菜单项以位置定位
            var wholeHeight = 890;
            var viewSize = winSize;
            var currentX = winSize.width - 343;
            var currentY = wholeHeight - 90;
            var menuItemLineHeight = 145;
            var imgMap = resourceFileMap.list;
            var menuItems = [];
            var menuConfs = [
                [imgMap.button_love, imgMap.button_love_hover, 'gather'],
                [imgMap.button_00, imgMap.button_00_hover, 'avoid'],
                [imgMap.button_lanxiang, imgMap.button_lanxiang_hover, 'bunt'],
                [imgMap.button_tech, imgMap.button_tech_hover, 'pipeline'],
                [imgMap.button_director, imgMap.button_director_hover, 'hit'],
                [imgMap.button_ps, imgMap.button_ps_hover, 'find']
            ];
            _.forEach(menuConfs, function (confArr) {
                var conf = {img: confArr[0], imgHover: confArr[1], gameName: confArr[2], gameClass: confArr[3]};
                var menuItem = new cc.MenuItemSprite(
                    new cc.Sprite(conf.img),
                    new cc.Sprite(conf.imgHover),
                    null,
                    function(){ enterAGame(conf.gameName); }
                );
                menuItem.attr({x: currentX, y: currentY});
                currentY -= menuItemLineHeight;
                menuItems.push(menuItem);
            });

            var menu = new cc.Menu(menuItems);
            menu.attr({ x: 0, y: 0, anchorX: 0, anchorY: 0 });
            var container = new cc.Layer();
            container.addChild(menu);

            var scrollView = new cc.ScrollView();
            scrollView.setContainer(container);
            scrollView.setViewSize(viewSize);
            scrollView.setContentSize(viewSize.width, wholeHeight);
            scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
            scrollView.setVisible(true);
            scrollView.setBounceable(true);
            scrollView.setContentOffset(cc.p(0, -(wholeHeight - viewSize.height)));

            this.addChild(scrollView);

            //TODO: for debug
            enterAGame("avoid");
        }
    });
});
