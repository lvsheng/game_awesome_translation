define([], function () {
    return {
        _score: 0,
        getScore: function () {
            return this._score;
        },
        hitOneSuccessful: function () {
            ++this._score;
        },
        resetScore: function () {
            this._score = 0;
        }
    };
});
