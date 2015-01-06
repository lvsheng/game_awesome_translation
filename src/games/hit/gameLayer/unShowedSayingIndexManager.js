define([
    '../../../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    /**
     * 用来给各Hole共享
     * @type {{uncle: Array, lover: Array}}
     */
    return {
        _saying_amount: null,

        _unShowedSayingIndex: {
            uncle: null,
            lover: null
        },
        init: function (sayingAmount) {
            var self = this;
            var hasBeenInitialed = self._saying_amount !== null; //因为会被各个hole实例多次初始化，加个判断
            if (hasBeenInitialed) {
                return;
            }

            self._unShowedSayingIndex.uncle = 0;
            self._unShowedSayingIndex.lover = 0;
            self._saying_amount = sayingAmount;
        },
        /**
         * @param type 'uncle' | 'lover'
         */
        get: function (type) {
            var self = this;
            var resultIndex = self._unShowedSayingIndex[type]++;

            if (resultIndex >= self._saying_amount) {
                resultIndex = Math.round(Math.random() * (self._saying_amount - 1));
            }

            return resultIndex;
        }
    };
});
