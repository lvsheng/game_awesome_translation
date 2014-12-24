/**
 * @author lvsheng
 * @date 2014/12/24
 */
define([
    '../../../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    return cc.Sprite.extend({
        _move_range_margin: 0, //左右移动时，锚点离屏幕多远就停下来反向
        _move_range_left: 0,
        _move_range_right: 0,
        _crashRangeWidth: 252, //可被撞击的范围的宽度
        _imageSprite: null,

        ctor: function () {
            this._super(); this.init();

            var borderMargin = 250; //可被撞击的边界离窗口两边的最近距离
            this._move_range_margin = borderMargin + this._crashRangeWidth / 2; //锚点离窗口两边的最近距离
            this._move_range_left = this._move_range_margin;
            this._move_range_right = cc.director.getWinSize().width - this._move_range_margin;
            this._oneTripTime = 4.5; //从一端走到另一端需要的时间

            this.addChild(this._imageSprite = new cc.Sprite(resourceFileMap.avoid.teenager));
            this._imageSprite.attr({anchorX: 0, anchorY: 0, x: 0, y: 0}); //只作为填充图片对待，完全覆盖住自己就好
            this.attr({
                anchorX: 0.42, //男孩女孩中间
                x: this._move_range_right,
                anchorY: 0,
                y: 0,
                width: this._imageSprite.width,
                height: this._imageSprite.height
            });

            this._startMove();
        },

        _startMove: function () {
            var self = this;
            self.runAction(new cc.RepeatForever(new cc.Sequence(
                new cc.MoveTo(self._oneTripTime, self._move_range_left, self.y), //认为一定是从_move_range_right开始移动的
                new cc.CallFunc(function(){ self.rotationY  = self._imageSprite.flippedX = true; }), //cocos中父元素flip子元素不受影响，故需都设置
                new cc.MoveTo(self._oneTripTime, self._move_range_right, self.y),
                new cc.CallFunc(function(){ self.flippedX = self._imageSprite.flippedX = false; })
            )));
        },

        //判断奥特曼是否与自己相撞
        ifCrash: function (ultraman) {

        },

        /**
         * 找到向自己冲过来的最近的奥特曼
         * @param ultramans
         * @return {Object} 奥特曼
         */
        comingClosest: function (ultramans) {

        },
        /**
         * 找到向自己冲过来并且不在跳跃状态的最近的奥特曼
         * @param ultramans
         * @return {Object} 奥特曼
         */
        comingNoJumpCloset: function (ultramans) {

        },

        stopMove: function () {

        }
    });
});
