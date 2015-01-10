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
    '../util/dataStorage',
    '../util/myDirector'
], function (require, resourceFileMap,share, getResultText, isWeixin, dataStorage) {
    return cc.Layer.extend({
        isResultLayer: true,
        ctor: function (gameName, result) {
            var self = this;
            self._super();
            self.init();

            dataStorage.setLastResult(gameName, result);

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

            var retryMenuItem = self._retryMenuItem = new cc.MenuItemSprite(new cc.Sprite(imgMap.retry), new cc.Sprite(imgMap.retry), null, _.bind(self._rePlay, self));
            var homeMenuItem = self._homeMenuItem = new cc.MenuItemSprite(new cc.Sprite(imgMap.home), new cc.Sprite(imgMap.home), null, _.bind(self._returnHome, self));
            var weixinShareMenuItem = self._weixinShareMenuItem = new cc.MenuItemSprite(new cc.Sprite(imgMap.weixinShare), new cc.Sprite(imgMap.weixinShare), null, _.bind(self._shareWeixin, self));
            var weiboShareMenuItem = self._weiboShareMenuItem = new cc.MenuItemSprite(new cc.Sprite(imgMap.weiboShare), new cc.Sprite(imgMap.weiboShare), null, _.bind(self._shareWeibo, self));
            var linkMenuItem = self._linkMenuItem = new cc.MenuItemSprite(new cc.Sprite(imgMap.zhangzishi), new cc.Sprite(imgMap.zhangzishiHover), null, _.bind(self._jumpToOther, self));
            linkMenuItem.attr({x: center.x + 120 - 54, y: winSize.height - 390 - 13 + 15});

            var menu;
            if (isWeixin()) {
                menu = new cc.Menu(retryMenuItem, homeMenuItem, weixinShareMenuItem, linkMenuItem);
            } else {
                menu = new cc.Menu(retryMenuItem, homeMenuItem, weiboShareMenuItem, linkMenuItem);
            }
            menu.attr({ x: 0, y: 0, anchorX: 0, anchorY: 0 });
            bakeLayer.addChild(menu);

            var titleLabel = self._titleLabel = new cc.LabelBMFont("Score:" + result.score, resourceFileMap.common.resultLayer.titleFont);
            titleLabel.setPosition(center.x + 118 - 34 - 5, winSize.height - 175 + 26 + 48 + 10);
            titleLabel.color = cc.color(0, 37, 41, 255);
            bakeLayer.addChild(titleLabel);

            var textLabel = self._textLabel = new cc.LabelBMFont(getResultText(gameName, result), resourceFileMap.common.resultLayer.textFont);
            textLabel.attr({anchorX: 0.5, anchorY: 0.5});
            textLabel.setPosition(center.x + 120 - 20, winSize.height - 235);
            textLabel.color = cc.color(0, 37, 41, 255);
            bakeLayer.addChild(textLabel);

            var noShareTextLabel = self._noShareTextLabel = new cc.LabelBMFont("就不给你看分数~\n分享一下再给你看！", resourceFileMap.common.resultLayer.textFont);
            noShareTextLabel.attr({anchorX: 0.5, anchorY: 0.5});
            noShareTextLabel.setPosition(center.x + 120 - 20, winSize.height - 235);
            noShareTextLabel.color = cc.color(0, 37, 41, 255);
            bakeLayer.addChild(noShareTextLabel);

            if (dataStorage.whetherHasShared()) {
                self._switchToShared();
            } else {
                self._switchToNoShared();

                dataStorage.listenShared(function () {
                    self._switchToShared();
                    self._animate();
                });
            }

            self._animate();

            share.tryWeixinShare(null, true); //一展示结果就尝试一次分享到微信

            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                onTouchBegan: _.bind(self._removeShadowLayer, self)
            }, self);
        },

        _switchToShared: function () {
            this._bakeLayer.unbake();

            var winSize = cc.director.getWinSize();
            var center = cc.p(winSize.width / 2, winSize.height / 2);
            this._retryMenuItem.attr({ x: center.x - 323, y: 111 });
            this._homeMenuItem.attr({ x: center.x + 20, y: 111 });

            this._weixinShareMenuItem.attr({ x: center.x + 353, y: 111 });
            this._weiboShareMenuItem.attr({ x: center.x + 353, y: 111 });

            this._linkMenuItem.setVisible(true);
            this._titleLabel.setVisible(true);
            this._textLabel.setVisible(true);
            this._noShareTextLabel.setVisible(false);

            this._bakeLayer.bake();
        },
        _switchToNoShared: function () {
            this._bakeLayer.unbake();

            var winSize = cc.director.getWinSize();
            var center = cc.p(winSize.width / 2, winSize.height / 2);
            this._retryMenuItem.attr({ x: center.x - 323 + 260, y: 111 });
            this._homeMenuItem.attr({ x: center.x + 20 + 260, y: 111 });

            this._weixinShareMenuItem.attr({x: center.x + 120 - 54 + 15, y: winSize.height - 390 - 13 + 15});
            this._weiboShareMenuItem.attr({x: center.x + 120 - 54 + 15, y: winSize.height - 390 - 13 + 15});

            this._linkMenuItem.setVisible(false);
            this._titleLabel.setVisible(false);
            this._textLabel.setVisible(false);
            this._noShareTextLabel.setVisible(true);

            this._bakeLayer.bake();
        },

        onExit: function () {
            this._super();
            dataStorage.unListenShared();
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
                (new cc.MoveTo(0.3, this.x, 0)).easing(cc.easeIn(8))
            ));
        },
        _scaleToFillWindow: function (sprite) {
            sprite.scaleX = cc.director.getWinSize().width / sprite.width;
            sprite.scaleY = cc.director.getWinSize().height / sprite.height;
        },
        _rePlay: function () {
            if (this._shadowLayer) { this._removeShadowLayer(); return; } //尝试在shadow上阻止事件向下传递，但没成功，先用这种比较挫的标记方法。。。
            $.stats.myTrack("结果页重玩-" + require("../util/myDirector").getCurGame().name);
            require('../util/myDirector').enterAGame(dataStorage.getLastResult().gameName);
        },
        _returnHome: function () {
            $.stats.myTrack("结果页返回首页-" + require("../util/myDirector").getCurGame().name);
            if (this._shadowLayer) { this._removeShadowLayer(); return; }
            require('../util/myDirector').enterList();
        },
        _shareWeibo: function () {
            if (this._shadowLayer) { this._removeShadowLayer(); return; }
            dataStorage.markNeedJumpToResultPage(true);
            share.weiboShare();
        },
        _shareWeixin: function () {
            if (this._shadowLayer) { this._removeShadowLayer(); return; }
            var self = this;
            share.tryWeixinShare();
            (function(){
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
            })();
        },
        _jumpToOther: function () {
            if (this._shadowLayer) { this._removeShadowLayer(); return; }
            dataStorage.markNeedJumpToResultPage(true);
            $.stats.myTrack("结果页涨姿势链接-" + require("../util/myDirector").getCurGame().name);
            //向其他地方导流
            window.location.href = "http://events.we4media.com/bdck/mobile-flip/?nsukey=gre04mvq50qZwsOPu%2FwkUGqICYExaE%2BP5DV7EZU0gLnfwoZyzUh%2B5mH%2BT0WpZINW5quHDc1xFl%2BspcLKI2861Q%3D%3D";
        }
    });
});
