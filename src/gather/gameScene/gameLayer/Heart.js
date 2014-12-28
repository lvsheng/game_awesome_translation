/**
 * @author lvsheng
 * @date 2014/12/22
 */
define([
    '../../../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    return cc.Sprite.extend({
        _hitCount: 0,
        /**
         * @param x
         * @param lifeTime
         * @param onHit
         * @param onOut
         */
        ctor: function(x, lifeTime, onHit, onOut){
            var self = this;
            var winHeight = cc.director.getWinSize().height;
            var winWidth = cc.director.getWinSize().width;
            self._super(resourceFileMap.gather.heart);

            self._onHit = onHit;
            self._onOut = onOut;

            self.attr({ x: x * winWidth, y: winHeight + self.height / 2});
            self.runAction(new cc.Sequence(
                new cc.MoveTo(lifeTime, x * winWidth, 0),
                new cc.CallFunc(function(){ onOut(self); })
            ));
        },
        judgeHit: function (position) {
            return cc.rectContainsPoint(this._getRect(this.x, this.y, this.width * 1.5, this.height * 5), position);
        },
        _getRect: function (centerX, centerY, width, height) {
            return new cc.Rect(centerX - width / 2, centerY - height / 2, width, height);
        }
    });
});
