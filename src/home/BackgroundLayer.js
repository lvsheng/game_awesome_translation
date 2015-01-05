define([
    '../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    return cc.Layer.extend({
        ctor: function () {
            this._super();
            this.init();

            this._backgroundSprite = new cc.Sprite(resourceFileMap.home.bg);
            var winSize = cc.director.getWinSize();
            this._backgroundSprite.attr({ anchorX: 0.5, anchorY: 1, x: winSize.width / 2, y: winSize.height });

            this.scheduleOnce(function(){
                //这几句话如果直接执行，此时拿到的sprite的width是0。。。不清楚为什么？异步渲染的估计。。。但神奇的是其他背景层中没有遇到这个问题。。。
                this._scaleToCoverWindow(this._backgroundSprite);
                this.addChild(this._backgroundSprite);
            });
        },

        _scaleToCoverWindow: function (sprite) {
            //先试着以等高进行缩放
            var scale = cc.director.getWinSize().height / sprite.height;
            //水平方向有黑边、换以等宽进行缩放
            if (sprite.width * scale < cc.director.getWinSize().width) { scale = cc.director.getWinSize().width / sprite.width; }

            sprite.scale = scale;
        }
    });
});
