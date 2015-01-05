/**
 * @author lvsheng
 * @date 2015/1/5
 */
define([
    '../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    return cc.Layer.extend({
        ctor: function (header, text, onButtonClick) {
            this._super(); this.init();
            var winSize = cc.director.getWinSize();
            var center = cc.p(winSize.width / 2, winSize.height / 2);

            var shadowLayer = new cc.LayerColor(cc.color(0, 0, 0, 125), winSize.width, winSize.height);
            this.addChild(shadowLayer);

            var dialogLayer = this._dialogLayer = new cc.Layer();
            this.addChild(dialogLayer);

            var dialogBg = new cc.Sprite(resourceFileMap.common.guideDialog.bg);
            dialogBg.setPosition(center.x, winSize.height - 277);
            dialogLayer.addChild(dialogBg);

            var buttonMenuItem = new cc.MenuItemSprite(
                new cc.Sprite(resourceFileMap.common.guideDialog.button),
                new cc.Sprite(resourceFileMap.common.guideDialog.button_hover),
                null,
                onButtonClick,
                null
            );
            var buttonMenu = new cc.Menu(buttonMenuItem);
            buttonMenu.height = buttonMenuItem.height; //cc.Menu的高度默认为占满整个屏幕的高，这里强制改为按钮的高
            buttonMenu.setPosition(center.x, winSize.height - 488.5);
            dialogLayer.addChild(buttonMenu);

            //TODO: title,text label

            this._animate();
        },
        _animate: function () {
            var self = this;
            var dialogLayer = self._dialogLayer;
            //TODO: 加初态、动画
        }
    });
});