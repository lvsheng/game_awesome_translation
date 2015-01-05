/**
 * 一个小游戏结束后展示结果的层
 * 会展示成绩，并带有重玩、下个游戏、回首页、分享等按钮及相关功能
 * 出现时有动画
 * @author lvsheng
 * @date 2014/12/22
 */
define([
    'require',
    '../gameUtil/resourceFileMap',
    '../list/_listScene'
], function (require, resourceFileMap) {
    return cc.Layer.extend({
        isResultLayer: true,
        ctor: function (title, text) {
            var self = this;
            self._super();
            self.init();
            var imgMap = resourceFileMap.common.resultLayer;
            var winSize = cc.director.getWinSize();
            var center = cc.p(winSize.width / 2, winSize.height / 2);

            var bg = new cc.Sprite(imgMap.bg);
            bg.setPosition(center);
            self._scaleToFillWindow(bg);
            self.addChild(bg);

            var dialog = new cc.Sprite(imgMap.dialog);
            dialog.setPosition(center.x - 46, winSize.height - 242);
            self.addChild(dialog);

            var logo = new cc.Sprite(imgMap.logo);
            logo.setPosition(center.x + 375, winSize.height - 414.5);
            self.addChild(logo);

            var retryMenuItem = new cc.MenuItemSprite(new cc.Sprite(imgMap.retry), new cc.Sprite(imgMap.retry), null, _.bind(self._rePlay, self));
            retryMenuItem.attr({ x: center.x - 323, y: 111 });
            var homeMenuItem = new cc.MenuItemSprite(new cc.Sprite(imgMap.home), new cc.Sprite(imgMap.home), null, _.bind(self._returnHome, self));
            homeMenuItem.attr({ x: center.x + 20, y: 111 });
            var shareMenuItem = new cc.MenuItemSprite(new cc.Sprite(imgMap.share), new cc.Sprite(imgMap.share), null, _.bind(self._share, self));
            shareMenuItem.attr({ x: center.x + 353, y: 111 });

            var menu = new cc.Menu(retryMenuItem, homeMenuItem, shareMenuItem);
            menu.attr({ x: 0, y: 0, anchorX: 0, anchorY: 0 });
            self.addChild(menu);

            self._animate();
        },

        _animate: function () {
            var winSize = cc.director.getWinSize();
            this.y = winSize.height;
            this.runAction(new cc.Sequence(
                new cc.MoveTo(0.4, this.x, 0).easing(cc.easeBounceOut(7))
            ));
        },
        _scaleToFillWindow: function (sprite) {
            sprite.scaleX = cc.director.getWinSize().width / sprite.width;
            sprite.scaleY = cc.director.getWinSize().height / sprite.height;
        },
        _rePlay: function () {
            var mainScene = require('../list/_listScene').getInstance();
            var curGame = mainScene.getCurGame();
            mainScene.enterAGame(curGame.name);
        },
        _returnHome: function () {
            cc.director.runScene(require('../list/_listScene').getInstance());
        },
        _share: function () {
            //TODO
            cc.director.pause();
            alert("TODO...");
            cc.director.resume();
        }
    });
});
