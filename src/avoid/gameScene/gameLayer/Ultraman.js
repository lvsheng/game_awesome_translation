/**
 * @author lvsheng
 * @date 2014/12/24
 */
define([
    '../../../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    return cc.Sprite.extend({
        _direction: '', //'left'|'right'
        _speed: 0,
        _gameLayer: null,
        _leftX: 0,
        _rightX: 0,
        _flyY: 209,
        _innerCrashRect: cc.rect(42, 18, 103, 96),

        ctor: function (direction, speed, gameLayer) {
            this._super(resourceFileMap.avoid.ultraman);

            this._direction = direction;
            this._speed = speed;
            this._gameLayer = gameLayer;
            this._leftX = -(this.width / 2);
            this._rightX = cc.director.getWinSize().width + this.width / 2;

            this._fly();
        },
        _fly: function () {
            var self = this;
            var time = (self._rightX - self._leftX) / self._speed;
            var moveAction = null;

            self.attr({ y: self._flyY });
            if (self._direction === 'right') {
                self.attr({ x: self._leftX }); //图片默认是向左的，向右时flip一下
                moveAction = new cc.MoveTo(time, self._rightX, self.y);
            } else if (self._direction === 'left') {
                self.attr({ x: self._rightX, flippedX: true });
                moveAction = new cc.MoveTo(time, self._leftX, self.y);
            }

            self.runAction(new cc.Sequence(
                moveAction,
                new cc.CallFunc(function () {
                    //安全飞过
                    self._gameLayer.removeAUltraman(self);
                }))
            );
        },
        jump: function () {
            var distance = 700;
            var height = 300;
            var time = distance / this._speed;
            this.runAction(new cc.JumpBy(time, {x: 0, y: 0}, height, 1));
        },
        getDirection: function () { return this._direction; },
        isJumping: function () { return this.y - this._flyY > 50; },
        getInnerCrashRect: function () { return this._innerCrashRect; }
    });
});
