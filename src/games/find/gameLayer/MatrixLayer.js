/**
 * @author lvsheng
 * @date 2015/1/7
 */
define([
    '../../../util/resourceFileMap'
], function (resourceFileMap) {
    return cc.Layer.extend({
        ctor: function () {
            this._super(); this.init();

            var winSize = cc.director.getWinSize();
            var center = cc.p(winSize.width / 2, winSize.height / 2);
            this._conf = {
                width: 576,
                height: 576,
                startX: center.x - 182,
                startY: 35
            };
            this._fengjieRect = cc.rect();

            var start = (new Date()).getTime();
            this._fanbingbingBakeLayerMap = {}; //key为size，值为bake的layer
            for ( var i = 2; i < 11; ++i) {
                this._fanbingbingBakeLayerMap[i] = this._getAFanbingbingBakeLayer(i);
            }
        },
        _getAFanbingbingBakeLayer: function (size) {
            var layer = new cc.Layer();
            var spriteBatchNode = new cc.SpriteBatchNode(resourceFileMap.find.fanbingbing, 100);
            layer.addChild(spriteBatchNode);
            var imgWidth = this._conf.width / size;
            var imgHeight = this._conf.height / size;
            for (var iRow = 0; iRow < size; ++iRow) {
                var y = this._conf.startY + iRow * imgHeight;
                for (var iCol = 0; iCol < size; ++iCol) {
                    var x = this._conf.startX + iCol * imgWidth;
                    var sprite = new cc.Sprite(spriteBatchNode.getTexture());
                    spriteBatchNode.addChild(sprite);
                    sprite.attr({anchorX: 0, anchorY: 0, x: x, y: y});
                    this._scaleTo(sprite, imgWidth, imgHeight);
                }
            }

            layer.bake();
            return layer;
        },
        /**
         * @param size 规模，所生成方阵为几乘几的
         */
        generate: function (size) {
            this.removeChild(this._fengjieLayer);
            this.removeChild(this._fanbingbingLayer);

            this.addChild(this._fanbingbingLayer = this._fanbingbingBakeLayerMap[size], 1);

            var imgWidth = this._conf.width / size;
            var imgHeight = this._conf.height / size;
            var fengjiePosition = {iRow: Math.round(Math.random() * (size-1)), iCol: Math.round(Math.random() * (size-1))};
            var x = this._conf.startX + fengjiePosition.iCol * imgWidth;
            var y = this._conf.startY + fengjiePosition.iRow * imgHeight;
            this._fengjieRect = cc.rect(
                x,
                y,
                imgWidth, imgHeight
            );
            var fengjieSprite = new cc.Sprite(resourceFileMap.find.fengjie);
            this._scaleTo(fengjieSprite, imgWidth, imgHeight);
            fengjieSprite.attr({anchorX: 0, anchorY: 0, x: x, y: y});
            var fengjieLayer = this._fengjieLayer = new cc.Layer();
            fengjieLayer.addChild(fengjieSprite);
            fengjieLayer.bake();
            this.addChild(fengjieLayer, 2);
        },
        whetherFind: function (position) {
            if (this._endding) { return false; }
            return cc.rectContainsPoint(this._fengjieRect, position);
        },
        preEnd: function (endCallback) {
            var self = this;
            var winSize = cc.director.getWinSize();
            self._endding = true;
            self.removeChild(self._fengjieLayer);
            self._fanbingbingLayer.runAction(new cc.Sequence(
                new cc.Blink(0.3, 3),
                new cc.DelayTime(0.5),
                new cc.CallFunc(function () {
                    endCallback();
                })
            ));
        },
        _scaleTo: function (sprite, width, height) {
            sprite.scaleY = height / sprite.height;
            sprite.scaleX = width / sprite.width;
        }
    });
});
