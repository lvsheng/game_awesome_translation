/**
 * 菜单层
 * 具体包括：
 * 一个暂停按钮、暂停时出现的左边栏（左边栏上有重玩、继续、回首页、分享等功能键）及相关功能
 *
 * @author lvsheng
 * @date 2014/12/22
 */
define([
    'require',
    '../gameUtil/resourceFileMap',
    '../gameUtil/pauseGame',
    '../gameUtil/share',
    '../list/Scene'
], function (require, resourceFileMap, pauseGame, share) {
    return cc.Layer.extend({
        ctor: function () {
            var self = this;
            self._super(); self.init();

            self._paused = false;

            var pauseMenuItem = new cc.MenuItemSprite(
                new cc.Sprite(resourceFileMap.common.leftBar.pause),
                new cc.Sprite(resourceFileMap.common.leftBar.pauseActive),
                null,
                _.bind(self.pauseGame, self),
                null
            );
            pauseMenuItem.attr({ x: 87.5, y: 532.5 });
            var pauseMenu = new cc.Menu(pauseMenuItem);
            pauseMenu.attr({ x: 0, y: 0, anchorX: 0, anchorY: 0 });
            self.addChild(pauseMenu);

            var leftBar = self._leftBar = new cc.Sprite(resourceFileMap.common.leftBar.bg);
            leftBar.attr({ x: -leftBar.width, y: 0, anchorX: 0, anchorY: 0 });
            self.addChild(leftBar);

            var restoreMenuItem = new cc.MenuItemSprite(
                new cc.Sprite(resourceFileMap.common.leftBar.resume),
                new cc.Sprite(resourceFileMap.common.leftBar.resumeActive),
                null,
                _.bind(self.resumeGame, self)
            );
            restoreMenuItem.attr({ x: 87.5, y: 532.5 });

            var retryMenuItem = new cc.MenuItemSprite(
                new cc.Sprite(resourceFileMap.common.leftBar.retry),
                new cc.Sprite(resourceFileMap.common.leftBar.retryActive),
                null,
                _.bind(self._retry, self)
            );
            retryMenuItem.attr({ x: 87.5, y: 402.5 });

            var homeMenuItem = new cc.MenuItemSprite(
                new cc.Sprite(resourceFileMap.common.leftBar.home),
                new cc.Sprite(resourceFileMap.common.leftBar.homeActive),
                null,
                _.bind(self._returnHome, self)
            );
            homeMenuItem.attr({ x: 87.5, y: 265.5 });

            var shareMenuItem = new cc.MenuItemSprite(
                new cc.Sprite(resourceFileMap.common.leftBar.wechat),
                new cc.Sprite(resourceFileMap.common.leftBar.wechatActive),
                null,
                _.bind(self._share, self)
            );
            shareMenuItem.attr({ x: 87.5, y: 119.5 });

            var leftMenu = new cc.Menu(
                restoreMenuItem,
                retryMenuItem,
                homeMenuItem,
                shareMenuItem
            );
            leftMenu.attr({ x: 0, y: 0, anchorX: 0, anchorY: 0 });
            leftBar.addChild(leftMenu);
        },

        isMenuLayer: true, //用于pauseGame作为不暂停的判定条件

        _retry: function () {
            var mainScene = require('../list/Scene').getInstance();
            var curGame = mainScene.getCurGame();
            mainScene.enterAGame(curGame.name);
        },
        _returnHome: function () {
            cc.director.runScene(require('../list/Scene').getInstance());
        },
        _share: function () {
            share();
        },

        pauseGame: function () {
            this._showLeftMenu();
            pauseGame.pauseGame();
            self._paused = true;
        },
        resumeGame: function () {
            if (self._paused) {
                this._hideLeftMenu();
                pauseGame.resumeGame();
                self._paused = false;
            }
        },
        _showLeftMenu: function () { this._leftBar.runAction(new cc.MoveTo(0.2, 0, 0)); },
        _hideLeftMenu: function () { this._leftBar.runAction(new cc.MoveTo(0.2, -this._leftBar.width, 0)); }
    });
});
