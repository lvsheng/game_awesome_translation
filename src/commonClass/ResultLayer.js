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

            var menu;
            if (isWeixin()) {
                menu = new cc.Menu(retryMenuItem, homeMenuItem, weixinShareMenuItem);
            } else {
                menu = new cc.Menu(retryMenuItem, homeMenuItem, weiboShareMenuItem);
            }
            menu.attr({ x: 0, y: 0, anchorX: 0, anchorY: 0 });
            bakeLayer.addChild(menu);

            var titleLabel = new cc.LabelBMFont(score, resourceFileMap.common.resultLayer.titleFont);
            titleLabel.setPosition(center.x + 118, winSize.height - 175);
            titleLabel.color = cc.color(0, 37, 41, 255);
            bakeLayer.addChild(titleLabel);

            var textLabel = new cc.LabelBMFont(getResultText(gameName, result), resourceFileMap.common.resultLayer.textFont);
            textLabel.attr({anchorX: 0.5, anchorY: 1});
            textLabel.setPosition(center.x + 120, winSize.height - 221);
            textLabel.color = cc.color(0, 37, 41, 255);
            bakeLayer.addChild(textLabel);

            self._animate();
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
            var mainScene = require('../list/Scene').getInstance();
            var curGame = mainScene.getCurGame();
            mainScene.enterAGame(curGame.name);
        },
        _returnHome: function () {
            cc.director.runScene(require('../list/Scene').getInstance());
        },
        _shareWeibo: function () {
            share.weiboShare();
        },
        _shareWeixin: function () {
            var self = this;
            share.tryWeixinShare(function(){
                //TODO: 看这里能不能被执行到~
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
            });
        }
    });
});
