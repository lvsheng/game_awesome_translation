/**
 * 一个小游戏结束后展示结果的层
 * 会展示成绩，并带有重玩、下个游戏、回首页、分享等按钮及相关功能
 * 出现时有动画
 * @author lvsheng
 * @date 2014/12/22
 */
define([
    'require',
    '../util/resourceFileMap',
    '../util/share',
    '../util/getResultText',
    '../util/isWeixin',
    '../list/Scene'
], function (require, resourceFileMap,share, getResultText, isWeixin) {
    return cc.Layer.extend({
        isResultLayer: true,
        ctor: function (score, result, gameName) {
            var self = this;
            self._super();
            self.init();

            self._gameResult = result;
            self._gameName = gameName;

            share.setShareResult("gameResult", self._gameName, self._gameResult);

            var imgMap = resourceFileMap.common.resultLayer;
            var winSize = cc.director.getWinSize();
            var center = cc.p(winSize.width / 2, winSize.height / 2);

            var bakeLayer = self._bakeLayer = new cc.Layer();
            self.addChild(bakeLayer);

            var bg = new cc.Sprite(imgMap.bg);
            bg.setPosition(center);
            self._scaleToFillWindow(bg);
            bakeLayer.addChild(bg);

            var dialog = new cc.Sprite(imgMap.dialog);
            dialog.setPosition(center.x - 46, winSize.height - 242);
            bakeLayer.addChild(dialog);

            var logo = new cc.Sprite(imgMap.logo);
            logo.setPosition(center.x + 375, winSize.height - 414.5);
            bakeLayer.addChild(logo);

            var retryMenuItem = new cc.MenuItemSprite(new cc.Sprite(imgMap.retry), new cc.Sprite(imgMap.retry), null, _.bind(self._rePlay, self));
            retryMenuItem.attr({ x: center.x - 323, y: 111 });
            var homeMenuItem = new cc.MenuItemSprite(new cc.Sprite(imgMap.home), new cc.Sprite(imgMap.home), null, _.bind(self._returnHome, self));
            homeMenuItem.attr({ x: center.x + 20, y: 111 });
            var weixinShareMenuItem = new cc.MenuItemSprite(new cc.Sprite(imgMap.weixinShare), new cc.Sprite(imgMap.weixinShare), null, _.bind(self._shareWeixin, self));
            weixinShareMenuItem.attr({ x: center.x + 353, y: 111 });
            var weiboShareMenuItem = new cc.MenuItemSprite(new cc.Sprite(imgMap.weiboShare), new cc.Sprite(imgMap.weiboShare), null, _.bind(self._shareWeibo, self));
            weiboShareMenuItem.attr({ x: center.x + 353, y: 111 });
            var linkMenuItem = new cc.MenuItemSprite(new cc.Sprite(imgMap.zhangzishi), new cc.Sprite(imgMap.zhangzishi), null, _.bind(self._jumpToOther, self));
            linkMenuItem.attr({x: center.x + 120 - 54, y: winSize.height - 390 - 13 + 15});

            var menu;
            if (isWeixin()) {
                menu = new cc.Menu(retryMenuItem, homeMenuItem, weixinShareMenuItem, linkMenuItem);
            } else {
                menu = new cc.Menu(retryMenuItem, homeMenuItem, weiboShareMenuItem, linkMenuItem);
            }
            menu.attr({ x: 0, y: 0, anchorX: 0, anchorY: 0 });
            bakeLayer.addChild(menu);

            //TODO: 换用图片字体
            //var titleLabel = new cc.LabelBMFont(score, resourceFileMap.common.resultLayer.titleFont);
            var titleLabel = new cc.LabelTTF(score, "FZMiaoWuS-GB", 65);
            titleLabel.setPosition(center.x + 118 - 34, winSize.height - 175 + 26 + 48);
            titleLabel.color = cc.color(0, 37, 41, 255);
            bakeLayer.addChild(titleLabel);

            //TODO: 换用图片字体
            //var textLabel = new cc.LabelBMFont(getResultText(gameName, result), resourceFileMap.common.resultLayer.textFont);
            var textLabel = new cc.LabelTTF(getResultText(gameName, result), "FZMiaoWuS-GB", 36);
            textLabel.attr({anchorX: 0.5, anchorY: 1});
            textLabel.setPosition(center.x + 120 - 20, winSize.height - 221 + 40 + 65);
            textLabel.color = cc.color(0, 37, 41, 255);
            bakeLayer.addChild(textLabel);

            self._animate();

            share.tryWeixinShare(); //一展示结果就尝试一次分享到微信

            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                onTouchBegan: _.bind(self._removeShadowLayer, self)
            }, self);
        },

        _removeShadowLayer: function () {
            if (this._shadowLayer) {
                this.removeChild(this._shadowLayer);
                this._shadowLayer = null;
            }
        },

        _animate: function () {
            var winSize = cc.director.getWinSize();
            this._bakeLayer.y = winSize.height;
            this._bakeLayer.runAction(new cc.Sequence(
                new cc.MoveTo(0.6, this.x, 0).easing(cc.easeBounceOut(7))
            ));
        },
        _scaleToFillWindow: function (sprite) {
            sprite.scaleX = cc.director.getWinSize().width / sprite.width;
            sprite.scaleY = cc.director.getWinSize().height / sprite.height;
        },
        _rePlay: function () {
            if (this._shadowLayer) { this._removeShadowLayer(); return; } //尝试在shadow上阻止事件向下传递，但没成功，先用这种比较挫的标记方法。。。
            $.stats.myTrack("结果页重玩-" + require("../list/Scene").getInstance().getCurGame().name);
            var mainScene = require('../list/Scene').getInstance();
            var curGame = mainScene.getCurGame();
            mainScene.enterAGame(curGame.name);
        },
        _returnHome: function () {
            $.stats.myTrack("结果页返回首页-" + require("../list/Scene").getInstance().getCurGame().name);
            if (this._shadowLayer) { this._removeShadowLayer(); return; }
            cc.director.runScene(require('../list/Scene').getInstance());
        },
        _shareWeibo: function () {
            if (this._shadowLayer) { this._removeShadowLayer(); return; }
            share.weiboShare();
        },
        _shareWeixin: function () {
            if (this._shadowLayer) { this._removeShadowLayer(); return; }
            $.stats.myTrack("分享到微信按钮");
            var self = this;
            share.tryWeixinShare(function(){
                var winSize = cc.director.getWinSize();
                var center = cc.p(winSize.width / 2, winSize.height / 2);

                var shadowLayer = new cc.LayerColor(cc.color(0, 0, 0, 125), winSize.width, winSize.height);
                self.addChild(shadowLayer);

                var tipSprite = new cc.Sprite(resourceFileMap.common.resultLayer.tip);
                tipSprite.setPosition(center.x + 58, 640 - 233.5);
                shadowLayer.addChild(tipSprite);

                var buttonSprite = new cc.Sprite(resourceFileMap.common.resultLayer.okButton);
                buttonSprite.setPosition(center.x + 35, 640 - 530);
                shadowLayer.addChild(buttonSprite);

                shadowLayer.bake();

                self._shadowLayer = shadowLayer;
            });
        },
        _jumpToOther: function () {
            if (this._shadowLayer) { this._removeShadowLayer(); return; }
            $.stats.myTrack("结果页涨姿势链接-" + require("../list/Scene").getInstance().getCurGame().name);
            //向其他地方导流
            window.location.href = "http://events.we4media.com/bdck/mobile-flip/?nsukey=gre04mvq50qZwsOPu%2FwkUGqICYExaE%2BP5DV7EZU0gLnfwoZyzUh%2B5mH%2BT0WpZINW5quHDc1xFl%2BspcLKI2861Q%3D%3D";
        }
    });
});
