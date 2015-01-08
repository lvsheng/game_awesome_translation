/**
 * 参考cc.LoaderScene实现
 * @author lvsheng
 * @date 2015/1/1
 */
define([
    './resourceFileMap',
    './resourceFileList'
], function (resourceFileMap, resourceFileList) {
    var LoaderScene = cc.Scene.extend({
        _interval : null,
        _label : null,
        _className:"LoaderScene",
        ctor: function(){ this._super(); this.init(); },
        init : function(){
            var self = this;
            var bgLayer = self._bgLayer = new cc.Layer();
            bgLayer.setPosition(cc.visibleRect.bottomLeft);
            self.addChild(bgLayer, 0);

            cc.loader.load(resourceFileList.loading, {
                isCrossOrigin : false,
                cb: function(){
                    (function addBgSprite () {
                        var bgSprite = new cc.Sprite(resourceFileMap.loading.loadingBg);
                        bgSprite.setPosition(cc.visibleRect.center);
                        function scaleToFillWindow (sprite) {
                            sprite.scaleX = cc.director.getWinSize().width / sprite.width;
                            sprite.scaleY = cc.director.getWinSize().height / sprite.height;
                        }
                        scaleToFillWindow(bgSprite);
                        bgLayer.addChild(bgSprite);
                    })();
                    self._initStage(resourceFileMap.loading.loading1, resourceFileMap.loading.loading2, cc.visibleRect.center);
                }
            });

            (function addLabel () {
                var logoWidth = 246;
                var logoHeight = 272;
                var fontSize = 14, lblHeight = -logoHeight / 2 - 10;
                var label = self._label = new cc.LabelTTF("Loading... 0%", "Arial", fontSize);
                label.setPosition(cc.pAdd(cc.visibleRect.center, cc.p(0, lblHeight)));
                label.setColor(cc.color(114, 49, 28));
                //bgLayer.addChild(this._label, 10);
            })();
            return true;
        },
        _initStage: function (img1, img2, centerPos) {
            var self = this;

            var logo1Sprite = new cc.Sprite(img1);
            logo1Sprite.setScale(cc.contentScaleFactor());
            logo1Sprite.x = centerPos.x;
            logo1Sprite.y = centerPos.y;
            var logo1 = self._logo1 = new cc.Layer();
            logo1.addChild(logo1Sprite);
            logo1.bake();
            logo1.visible = false;

            var logo2Sprite = new cc.Sprite(img2);
            logo2Sprite.setScale(cc.contentScaleFactor());
            logo2Sprite.x = centerPos.x;
            logo2Sprite.y = centerPos.y;
            var logo2 = self._logo2 = new cc.Layer();
            logo2.addChild(logo2Sprite);
            logo2.bake();
            logo2.visible = false;

            self._bgLayer.addChild(logo1, 10);
            self._bgLayer.addChild(logo2, 10);
        },
        onEnter: function () {
            var self = this;
            cc.Node.prototype.onEnter.call(self);
            self.schedule(self._startLoading, 0.3);
            self.schedule(self._nextFrame, 0.2);
        },
        onExit: function () {
            cc.Node.prototype.onExit.call(this);
            var tmpStr = "Loading... 0%";
            this._label.setString(tmpStr);
        },
        initWithResources: function (resources, cb) {
            if(cc.isString(resources))
                resources = [resources];
            this.resources = resources || [];
            this.cb = cb;
        },
        _startLoading: function () {
            var self = this;
            self.unschedule(self._startLoading);
            var res = self.resources;
            cc.loader.load(res,
                function (result, count, loadedCount) {
                    var percent = (loadedCount / count * 100) | 0;
                    percent = Math.min(percent, 100);
                    self._label.setString("Loading... " + percent + "%");
                }, function () {
                    if (self.cb)
                        self.cb();
                });
        },
        _nextFrame: function(){
            if (!this._logo1 || !this._logo2) { return; }
            this._logo1.visible = this._logo2.visible = false;
            this._currentLogo = (this._currentLogo === this._logo1 ? this._logo2 : this._logo1);
            this._currentLogo.visible = true;
        }
    });

    return function(resources, cb){
        var loaderScene = new LoaderScene();
        loaderScene.initWithResources(resources, cb);
        cc.director.runScene(loaderScene);
    };
});
