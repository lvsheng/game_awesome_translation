/**
 * @author lvsheng
 * @date 2015/1/5
 */
define([
    'require',
    '../util/resourceFileMap',
    '../list/Scene'
], function (require, resourceFileMap) {
    return cc.Layer.extend({
        ctor: function (title, text, onButtonClick) {
            this._super(); this.init();
            var winSize = cc.director.getWinSize();
            var center = cc.p(winSize.width / 2, winSize.height / 2);

            var shadowLayer = new cc.LayerColor(cc.color(0, 0, 0, 125), winSize.width, winSize.height);
            this.addChild(shadowLayer);
            shadowLayer.bake();

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
            var homeButtonMenuItem = new cc.MenuItemSprite(
                new cc.Sprite(resourceFileMap.common.guideDialog.homeButton),
                new cc.Sprite(resourceFileMap.common.guideDialog.homeButtonHover),
                null,
                function () {
                    $.stats.myTrack("引导层返回首页-" + require("../list/Scene").getInstance().getCurGame().name);
                    cc.director.runScene(require('../list/Scene').getInstance());
                },
                null
            );
            homeButtonMenuItem.attr({x: -115});
            var buttonMenu = new cc.Menu(buttonMenuItem, homeButtonMenuItem);
            buttonMenu.height = buttonMenuItem.height; //cc.Menu的高度默认为占满整个屏幕的高，这里强制改为按钮的高
            buttonMenu.setPosition(center.x, winSize.height - 488.5);
            dialogLayer.addChild(buttonMenu);

            //TODO: 换用图片字体
            //var titleLabel = new cc.LabelBMFont(title, resourceFileMap.common.guideDialog.titleFont);
            var titleLabel = new cc.LabelTTF(title, "FZMiaoWuS-GB", 43);
            //titleLabel.setPosition(center.x - 17, winSize.height - 164);
            titleLabel.setPosition(center.x - 12, winSize.height - 164);
            dialogLayer.addChild(titleLabel);

            //TODO: 换用图片字体
            //var textLabel = new cc.LabelBMFont(text, resourceFileMap.common.guideDialog.textFont);
            var textLabel = new cc.LabelTTF(text, "FZMiaoWuS-GB", 33);
            textLabel.attr({anchorX: 0.5, anchorY: 0.5});
            textLabel.setPosition(center.x, winSize.height - 300);
            textLabel.color = cc.color(0, 37, 41, 255);
            dialogLayer.addChild(textLabel);

            dialogLayer.bake();

            this._animate();
        },
        _animate: function () {
            var dialogLayer = this._dialogLayer;
            dialogLayer.scale = 0.4;
            dialogLayer.runAction(new cc.Sequence(
                new cc.ScaleTo(0.1, 0.1),
                //(new cc.ScaleTo(1, 1)).easing(cc.easeElasticOut(0.5))
                (new cc.ScaleTo(0.3, 1)).easing(cc.easeElasticOut(1))
                //new cc.ScaleTo(0.2, 1).easing(cc.easeBackIn())//.easing(cc.easeCircleActionIn(.3))
            ));
        }
    });
});
