/**
 * @author lvsheng
 * @date 2014/12/24
 */
define([
    '../../../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    return cc.Sprite.extend({
        _moveRangeMargin: 0, //左右移动时，锚点离屏幕多远就停下来反向
        _moveRangeLeft: 0,
        _moveRangeRight: 0,
        _crashRangeWidth: 0, //可被撞击的范围的宽度
        _crashRangeHeight: 0,
        _moveDirection: '', //'left' | 'right
        _speed: 0, //px为单位

        ctor: function () {
            this._super(resourceFileMap.avoid.teenager);

            var borderMargin = 250; //可被撞击的边界离窗口两边的最近距离
            this._moveRangeMargin = borderMargin + this._crashRangeWidth / 2; //锚点离窗口两边的最近距离
            this._moveRangeLeft = this._moveRangeMargin;
            this._moveRangeRight = cc.director.getWinSize().width - this._moveRangeMargin;
            this._crashRangeWidth = 252;
            this._crashRangeHeight = this.height;
            this._speed = 108;

            //TODO: 后面有必要时，看把anchorX放在女孩身体中央，这样翻转时看起来可能效果好些。然后_crashRangeWidth分成left与right
            this.attr({ anchorX: 0.42, x: this._moveRangeRight, anchorY: 0, y: 0 }); //anchor放在男孩女孩中间

            this._startMove();

            //TODO: for debug
            window.teenager = this;
        },

        _startMove: function () {
            var self = this;
            var oneTripTime = (self._moveRangeRight - self._moveRangeLeft) / self._speed;
            self._moveDirection = 'left';
            self.runAction(new cc.RepeatForever(new cc.Sequence(
                new cc.MoveTo(oneTripTime, self._moveRangeLeft, self.y), //认为一定是从_moveRangeRight开始移动的
                new cc.CallFunc(function(){
                    self._moveDirection = 'right';
                    self.flippedX = true;
                    self.anchorX = 1 - self.anchorX; //flip只是让绘制的内容翻转、不影响位置与anchor。这里把anchor跟随做翻转
                }),
                new cc.MoveTo(oneTripTime, self._moveRangeRight, self.y),
                new cc.CallFunc(function(){
                    self._moveDirection = 'left';
                    self.anchorX = 1 - self.anchorX;
                    self.flippedX = false;
                })
            )));
        },

        //判断奥特曼是否与自己相撞
        ifCrash: function (ultraman) {

        },

        /**
         * 找到向自己冲过来的最近的奥特曼
         * @param ultramans
         * @return {Object} 奥特曼
         * @param [noJump]
         */
        comingClosest: function (ultramans, noJump) {
            var self = this;
            var tempArr = _.filter(ultramans, function (each) {
                //coming
                return (each.getDirection() === 'left' && each.x > self.x) || (each.getDirection() === 'right' && each.x < self.x);
            });
            if (noJump) { tempArr = _.filter(tempArr, function (each) { return !each.isJumping(); }) }
            if (tempArr.length > 0) {
                //找最近
                return _.min(tempArr, function (each) { return Math.abs(each.x - self.x); });
            } else {
                return null;
            }
        },
        /**
         * 找到向自己冲过来并且不在跳跃状态的最近的奥特曼
         * @param ultramans
         * @return {Object} 奥特曼
         */
        comingNoJumpCloset: function (ultramans) { return this.comingClosest(ultramans, true); },

        stopMove: function () { this.stopAllActions(); }
    });
});
