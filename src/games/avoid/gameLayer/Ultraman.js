/**
 * @author lvsheng
 * @date 2014/12/24
 */
define([
    '../../../util/resourceFileMap'
], function (resourceFileMap) {
    return cc.Sprite.extend({
        _direction: '', //'left'|'right'
        _speed: 0,
        _gameLayer: null,
        _leftX: 0,
        _rightX: 0,
        _flyY: 209,
        _innerCrashRect: cc.rect(42, 18, 103, 96),
        _tryingJumpTeenager: false,

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
                    if (self._jumpOverTeenager()) { self._gameLayer.passAUltraman(); } //应对没跳完就飞出了的
                    self._gameLayer.removeAUltraman(self);
                }))
            );
        },
        jump: function () {
            var self = this;
            var distance = 700;
            var height = 300;
            var time = distance / self._speed;
            if (self.faceToTeenager()) { self._tryingJumpTeenager = true; }
            self.runAction(new cc.Sequence(
                new cc.JumpBy(time, {x: 0, y: 0}, height, 1),
                new cc.CallFunc(function(){
                    if (self._jumpOverTeenager()) { self._gameLayer.passAUltraman(); }
                    self._tryingJumpTeenager = false;
                }))
            );
        },
        _faceTo: function (target) {
            var d = this._direction;
            return d === 'right' && this.x < target.x || d === 'left' && this.x > target.x;
        },
        //在跳的过程中或刚跳完的一刹那判断这次跳跃是否成功跃过了00后
        _jumpOverTeenager: function () { return this._tryingJumpTeenager && !this.faceToTeenager(); },
        faceToTeenager: function () { return this._faceTo(this._gameLayer.getTeenager()); },
        getDirection: function () { return this._direction; },
        isJumping: function () { return this.y > this._flyY; },
        getInnerCrashRect: function () { return this._innerCrashRect; }
    });
});
