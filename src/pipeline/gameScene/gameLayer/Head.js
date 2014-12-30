/**
 * @author lvsheng
 * @date 2014/12/22
 */
define([
    '../../../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    var DISTANCE = 80;
    return cc.Sprite.extend({
        ctor: function(){
            var HEAD_X = cc.director.getWinSize().width / 3;
            this._super(resourceFileMap.pipeline.head);
            this.attr({ x: HEAD_X, y: 342 });
        },
        /**
         * 尝试安装自己到流水线的身子上
         * @param pipeline
         * @returns {boolean} 是否安装成功
         */
        tryAssemble: function (pipeline) {
            var bodyList = pipeline.getBodyList();
            for (var i = 0, assembled = false; !assembled && i < bodyList.length; ++i) {
                if (this._positionIsFit(bodyList[i])) {
                    this._assemble(bodyList[i]);
                    assembled = true;
                }
            }
            if (!assembled) { this._drop(); }

            return assembled;
        },
        _positionIsFit: function (body) { return Math.abs(body.x - this.x) <= DISTANCE; },
        _assemble: function (body) {
            body.addHead(this);
            var bodyUpperBound = body.y + body.height * body.anchorY;
            var selfUnderBound = this.y - this.height * this.anchorY;
            this.runAction(new cc.MoveBy( 0.2, 0, bodyUpperBound - selfUnderBound - 30 ));
        },
        _drop: function () {
            var self = this;
            self.runAction(new cc.Sequence(
                new cc.MoveTo(0.2, self.x, -(self.height * self.anchorY)),
                new cc.CallFunc(function() { self._remove(); })
            ));
        },
        _remove: function () { this.parent.removeChild(this); }
    });
});
