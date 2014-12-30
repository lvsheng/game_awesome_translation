/**
 * @author lvsheng
 * @date 2014/12/22
 */
define([
    '../../../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    var DISTANCE = 150;
    var ASSEMBLE_TIME = 0.005;
    return cc.Sprite.extend({
        ctor: function (pipeline) {
            var HEAD_X = cc.director.getWinSize().width / 3;
            this._super(resourceFileMap.pipeline.head);
            this.attr({ x: HEAD_X, y: 342 });
            this._assemblingOrDropping = false;
            this._pipeline = pipeline;
            this._assembleOrDropDoneCallback = function(){};
        },
        /**
         * 尝试安装自己到流水线的身子上
         * @returns {boolean} 是否安装成功
         * @param assembleOrDropDoneCallback
         */
        tryAssemble: function (assembleOrDropDoneCallback) {
            var bodyList = this._pipeline.getBodyList();
            var assembled = false;
            this._assembleOrDropDoneCallback = assembleOrDropDoneCallback;

            if (!this._assemblingOrDropping) {
                for (var i = 0; !assembled && i < bodyList.length; ++i) {
                    if (this._positionIsFit(bodyList[i])) {
                        this._assemble(bodyList[i]);
                        assembled = true;
                    }
                }
                if (!assembled) { this._drop(); }
                this._assemblingOrDropping = true; //若!assembled前面if中drop。若assembled，前面for循环里assemble
            }

            return assembled;
        },
        _positionIsFit: function (body) {
            var bodyPositionOnHeadDropped = body.x - this._pipeline.getSpeed() * ASSEMBLE_TIME;
            return !body.hasHead() && Math.abs(bodyPositionOnHeadDropped - this.x) <= DISTANCE;
        },
        _assemble: function (body) {
            body.addHead(this);
            var bodyUpperBound = body.y + body.height * body.anchorY;
            var selfUnderBound = this.y - this.height * this.anchorY;
            this.runAction(new cc.Sequence(
                new cc.MoveBy(ASSEMBLE_TIME, 0, bodyUpperBound - selfUnderBound - 30),
                new cc.CallFunc(this._assembleOrDropDoneCallback)
            ));
        },
        _drop: function () {
            var self = this;
            self.runAction(new cc.Sequence(
                new cc.MoveTo(0.4, self.x, -(self.height * self.anchorY)).easing(cc.easeIn(1.8)),
                new cc.CallFunc(function() { self._assembleOrDropDoneCallback(); self._remove(); })
            ));
        },
        _remove: function () { this.parent.removeChild(this); }
    });
});
