/**
 * @author lvsheng
 * @date 2014/12/22
 */
define([
    '../../../util/resourceFileMap'
], function (resourceFileMap) {
    return cc.Sprite.extend({
        _hitCount: 0,
        ctor: function(x, lifeTime, onOut){
            var self = this;
            self._super(resourceFileMap.pipeline.body);

            self._head = null;
        },
        setBodyPosition: function (x) { this.x = x; this._head && (this._head.x = x); },
        addHead: function (head) { this._head = head; },
        hasHead: function () { return !!this._head; },
        remove: function () {
            this.parent.removeChild(this);
            this._head && this._head.parent.removeChild(this._head);
        },
        /**
         * @param [callback]
         */
        blink: function (callback) {
            var action = new cc.Sequence(
                new cc.Blink(0.5, 9),
                new cc.DelayTime(0.5)
            );
            if (this._head) { this._head.runAction(action.clone()); }
            this.runAction(new cc.Sequence(
                action.clone(),
                new cc.CallFunc(callback)
            ));
        }
    });
});
