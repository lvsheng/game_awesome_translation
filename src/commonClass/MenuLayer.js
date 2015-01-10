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
    '../util/resourceFileMap',
    '../util/pauseGame',
    '../util/share',
    '../util/isWeixin',
    '../util/myDirector'
], function (require, resourceFileMap, pauseGame, share, isWeixin) {
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

            self.bake();

            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                onTouchBegan: _.bind(self._removeShadowLayer, self)
            }, self);
        },

        isMenuLayer: true, //用于pauseGame作为不暂停的判定条件

        _retry: function () {
            if (this._shadowLayer) { this._removeShadowLayer(); return; }
            $.stats.myTrack("侧边栏重玩-" + require("../util/myDirector").getCurGame().name);
            require('../util/myDirector').reloadCurrentScene();
        },
        _returnHome: function () {
            if (this._shadowLayer) { this._removeShadowLayer(); return; }
            $.stats.myTrack("侧边栏返回首页-" + require("../util/myDirector").getCurGame().name);
            require('../util/myDirector').enterList();
        },

        pauseGame: function () {
            $.stats.myTrack("暂停游戏-" + require("../util/myDirector").getCurGame().name);
            this._showLeftMenu();
            pauseGame.pauseGame();
            self._paused = true;
        },
        resumeGame: function () {
            if (this._shadowLayer) { this._removeShadowLayer(); return; }
            $.stats.myTrack("恢复游戏-" + require("../util/myDirector").getCurGame().name);
            if (self._paused) {
                this._hideLeftMenu();
                pauseGame.resumeGame();
                self._paused = false;
            }
        },
        _showLeftMenu: function () {
            this.unbake();
            this._leftBar.runAction(new cc.MoveTo(0.2, 0, 0));
        },
        _hideLeftMenu: function () {
            var self = this;
            self._leftBar.runAction(new cc.Sequence(
                new cc.MoveTo(0.2, -self._leftBar.width, 0),
                new cc.CallFunc(function(){
                    self.bake()
                })
            ));
        },

        _share: function () {
            if (this._shadowLayer) { this._removeShadowLayer(); return; }
            $.stats.myTrack("侧边栏分享-" + require("../util/myDirector").getCurGame().name);
            if (isWeixin()) {
                this._shareWeixin();
            } else {
                this._shareWeibo();
            }
        },
        _shareWeibo: function () {
            share.weiboShare();
        },
        _shareWeixin: function () {
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
        _removeShadowLayer: function () {
            if (this._shadowLayer) {
                this.removeChild(this._shadowLayer);
                this._shadowLayer = null;
            }
        }
    });
});
