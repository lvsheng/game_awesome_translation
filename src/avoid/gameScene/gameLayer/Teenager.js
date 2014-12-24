/**
 * @author lvsheng
 * @date 2014/12/24
 */
define([], function () {
    return cc.Sprite.extend({
        ctor: function () {
            this._super(); this.init();

            this._startMove();
        },

        _startMove: function () {

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
