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

            var spriteBatchNode = this._spriteBatchNode = new cc.SpriteBatchNode(resourceFileMap.find.fanbingbing, 100);
            this.addChild(spriteBatchNode);

            this._matrixSpriteList = [];

            this.bake();
        },
        /**
         * @param size 规模，所生成方阵为几乘几的
         */
        generate: function (size) {
            this._removeOldMatrixSprites();
            this._currentSize = size;
            var imgWidth = this._conf.width / size;
            var imgHeight = this._conf.height / size;
            var fengjiePosition = {
                iRow: Math.round(Math.random() * (size-1)),
                iCol: Math.round(Math.random() * (size-1))
            };
            for (var iRow = 0; iRow < size; ++iRow) {
                var y = this._conf.startY + iRow * imgHeight;
                for (var iCol = 0; iCol < size; ++iCol) {
                    var x = this._conf.startX + iCol * imgWidth;
                    var sprite;
                    if (iRow === fengjiePosition.iRow && iCol === fengjiePosition.iCol) {
                        sprite = new cc.Sprite(resourceFileMap.find.fengjie);
                        this._fengjieRect = cc.rect(x, y, imgWidth, imgHeight);
                        this.addChild(sprite);
                    } else {
                        //sprite = new cc.Sprite(resourceFileMap.find.fanbingbing);
                        sprite = new cc.Sprite(this._spriteBatchNode.getTexture());
                        this._spriteBatchNode.addChild(sprite);
                    }
                    sprite.attr({anchorX: 0, anchorY: 0, x: x, y: y});
                    this._scaleTo(sprite, imgWidth, imgHeight);

                    this._matrixSpriteList.push(sprite);
                }
            }
        },
        _removeOldMatrixSprites: function () {
            for (var i = 0; i < this._matrixSpriteList.length; ++i) {
                this.removeChild(this._matrixSpriteList[i]);
                this._spriteBatchNode.removeChild(this._matrixSpriteList[i]);
            }
            this._matrixSpriteList = [];
        },
        whetherFind: function (position) {
            if (this._endding) { return false; }
            return cc.rectContainsPoint(this._fengjieRect, position);
        },
        preEnd: function (endCallback) {
            var self = this;
            self.unbake(); //开始放动画，故取消bake
            self._endding = true;

            function doIt () {
                if (self._matrixSpriteList.length === 0) {
                    endCallback();
                } else {
                    self._matrixSpriteList[0].runAction(new cc.Sequence(
                        new cc.DelayTime(0.0005),
                        new cc.Spawn(
                            new cc.MoveBy(0.01, self._conf.width / self._currentSize, 0),
                            new cc.FadeOut(0.01),
                            new cc.CallFunc(function () {
                                var removed = self._matrixSpriteList.shift();
                                self.removeChild(removed);
                                self._spriteBatchNode.removeChild(removed);
                                doIt();
                            })
                        )
                    ))
                }
            }
            doIt();
        },
        _scaleTo: function (sprite, width, height) {
            sprite.scaleY = height / sprite.height;
            sprite.scaleX = width / sprite.width;
        }
    });
});
