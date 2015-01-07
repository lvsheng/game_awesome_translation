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
        },
        /**
         * @param size 规模，所生成方阵为几乘几的
         */
        generate: function (size) {
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
                    } else {
                        sprite = new cc.Sprite(resourceFileMap.find.fanbingbing);
                    }
                    sprite.attr({anchorX: 0, anchorY: 0, x: x, y: y});
                    this._scaleTo(sprite, imgWidth, imgHeight);
                    this.addChild(sprite);
                }
            }
        },
        whetherFind: function (position) {
            if (this._endding) { return false; }
            return cc.rectContainsPoint(this._fengjieRect, position);
        },
        preEnd: function (endCallback) {
            this._endding = true;
            this.children[0].runAction(new cc.Sequence(
                new cc.FadeOut(0.8),
                new cc.CallFunc(endCallback)
            ));
            for (var i = 1; i < this.children.length; ++i) {
                this.children[i].runAction(new cc.Sequence(
                    new cc.FadeOut(0.8)
                ))
            }
        },
        _scaleTo: function (sprite, width, height) {
            sprite.scaleY = height / sprite.height;
            sprite.scaleX = width / sprite.width;
        }
    });
});
