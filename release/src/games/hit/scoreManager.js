define([], function () {
    return {
        _mouseAmount: 0,
        _loverAmount: 0,
        getResult: function () {
            return {
                score: this._mouseAmount,
                amount: this._mouseAmount,
                loverAmount: this._loverAmount
            }
        },
        hitOneSuccessful: function () {
            ++this._mouseAmount;
        },
        hitLover: function () {
            ++this._loverAmount;
        },
        reset: function () {
            this._mouseAmount = 0;
            this._loverAmount = 0;
        }
    };
});
