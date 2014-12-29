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
    '../mainScene'
], function (require, resourceFileMap, pauseGame) {
    return cc.Layer.extend({
        ctor: function () {
            var self = this;
            self._super(); self.init();

            var pauseMenuItem = new cc.MenuItemSprite(
                new cc.Sprite(resourceFileMap.common.leftBar.pause),
                new cc.Sprite(resourceFileMap.common.leftBar.pauseActive),
                null,
                function () { showLeftMenu(); pauseGame.pause(); },
                null
            );
            pauseMenuItem.attr({ x: 87.5, y: 532.5 });
            var pauseMenu = new cc.Menu(pauseMenuItem);
            pauseMenu.attr({ x: 0, y: 0, anchorX: 0, anchorY: 0 });
            self.addChild(pauseMenu);

            var leftBar = new cc.Sprite(resourceFileMap.common.leftBar.bg);
            leftBar.attr({ x: -leftBar.width, y: 0, anchorX: 0, anchorY: 0 });
            self.addChild(leftBar);

            var restoreMenuItem = new cc.MenuItemSprite(
                new cc.Sprite(resourceFileMap.common.leftBar.resume),
                new cc.Sprite(resourceFileMap.common.leftBar.resumeActive),
                null,
                function () { hideLeftMenu(); pauseGame.resume(); }
            );
            restoreMenuItem.attr({ x: 87.5, y: 532.5 });

            var leftMenu = new cc.Menu(
                restoreMenuItem
            );
            leftMenu.attr({ x: 0, y: 0, anchorX: 0, anchorY: 0 });
            leftBar.addChild(leftMenu);

            function showLeftMenu () { leftBar.runAction(new cc.MoveTo(0.2, 0, 0)); }
            function hideLeftMenu () { leftBar.runAction(new cc.MoveTo(0.2, -leftBar.width, 0)); }
        },

        isMenuLayer: true, //用于pauseGame作为不暂停的判定条件

        _rePlay: function () {
            var mainScene = require('../mainScene').getInstance();
            var curGame = mainScene.getCurGame();
            mainScene.enterAGame(curGame.name, curGame.sceneClass);
        }
    });
});
