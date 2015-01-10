/**
 * @author lvsheng
 * @date 2014/12/22
 */
define([
    '../../../util/resourceFileMap'
], function (resourceFileMap) {
    var FIT_DISTANCE = 20;
    var ASSEMBLE_TIME = 0.13;
    return cc.Sprite.extend({
        ctor: function (pipeline) {
            var HEAD_X = cc.director.getWinSize().width / 3;
            this._super(resourceFileMap.pipeline.head);
            //this.attr({ x: HEAD_X, y: 342 });
            //this.attr({ x: HEAD_X, anchorY: 0, y: 342 - this.height / 2 });
            //this.attr({ x: HEAD_X, anchorY: 0.4, y: 342 - this.height * 0.4 });
            this.attr({ x: HEAD_X, anchorY: 0.4, y: 342 });
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
                if (!assembled) {
                    this._drop(this._getNearestBodyDistance());
                }
                this._assemblingOrDropping = true; //若!assembled前面if中drop。若assembled，前面for循环里assemble
            }

            return assembled;
        },
        /**
         * @returns {int} 没有时返回0，为正时表示向右偏，为负时表示向左偏
         * @private
         */
        _getNearestBodyDistance: function () {
            var bodyList = this._pipeline.getBodyList();
            if (bodyList.length === 0) {
                return 0;
            }
            else {
                var nearestDistance = this._getBodyDistance(bodyList[0]);
                for (var i = 1; i < bodyList.length; ++i) {
                    if (Math.abs(this._getBodyDistance(bodyList[i])) < Math.abs(nearestDistance)) {
                        nearestDistance = this._getBodyDistance(bodyList[i]);
                    }
                }
                return nearestDistance;
            }
        },
        _positionIsFit: function (body) {
            return !body.hasHead() && Math.abs(this._getBodyDistance(body)) <= FIT_DISTANCE;
        },
        _getBodyDistance: function (body) {
            var bodyPositionOnHeadDropped = body.x - this._pipeline.getSpeed() * ASSEMBLE_TIME;
            return bodyPositionOnHeadDropped - this.x;
        },
        _assemble: function (body) {
            body.addHead(this);
            var bodyUpperBound = body.y + body.height * body.anchorY;
            var selfUnderBound = this.y - this.height * this.anchorY;
            this.runAction(new cc.Sequence(
                new cc.MoveBy(ASSEMBLE_TIME, 0, bodyUpperBound - selfUnderBound - 25),
                new cc.CallFunc(this._assembleOrDropDoneCallback)
            ));
        },
        /**
         * @param offset 距最近的body的偏移
         * @private
         */
        _drop: function (offset) {
            var self = this;
            var moveTime = 0.4;
            self.runAction(new cc.Sequence(
                new cc.MoveTo(moveTime, self.x, -(self.height * self.anchorY)).easing(cc.easeIn(1.8)),
                new cc.CallFunc(function() { self._assembleOrDropDoneCallback(); self._remove(); })
            ));

            var rotateBy;
            if (Math.abs(offset) < 80) {
                if (offset > 0) { rotateBy = -180; }
                else if (offset < 0) { rotateBy = 180; }
            }
            if (rotateBy) {
                //self.runAction(new cc.Sequence(
                //    new cc.DelayTime(ASSEMBLE_TIME),
                //    (new cc.RotateBy(moveTime - ASSEMBLE_TIME, rotateBy)).easing(cc.easeSineIn())
                    //(new cc.RotateBy(moveTime - ASSEMBLE_TIME, rotateBy))
                //));
            }
        },
        _remove: function () { this.parent.removeChild(this); }
    });
});
