define([], function () {
    return {
        _score: 0,
        _loverAmount: 0,
        getResult: function () {
            return {
                score: this._score,
                amount: this._score,
                loverAmount: this._loverAmount
            }
        },
        hitOneSuccessful: function () {
            ++this._score;
        },
        hitLover: function () {
            ++this._loverAmount;
        },
        reset: function () {
            this._score = 0;
            this._loverAmount = 0;
        }
    };
});
