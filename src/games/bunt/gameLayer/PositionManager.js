/**
 * @author lvsheng
 * @date 2014/12/22
 */
define([], function () {
    return cc.Node.extend({
        _STEP_DISTANCE: 24,
        END_WIDTH: 480, //设计的分辨率为1180.考虑到iphone4为960，这里使用其一半480。TODO:不过其实这个值不对，因为整个游戏窗口应该会绽放的。应该推算出缩放的比例再来
        _offset: 0,
        _onWinnerArise: function(){},

        ctor: function(onWinnerArise){ this._super(); this.init(); this._onWinnerArise = onWinnerArise; },

        getOffset: function(){ return this._offset; },
        toRight: function(){ this._offset += this._STEP_DISTANCE; this._judgeWinner(); },
        toLeft: function(){
            this._offset -= this._STEP_DISTANCE; this._judgeWinner();
            //TODO: for debug
            this._offset -= 5 * this._STEP_DISTANCE; this._judgeWinner();
        },
        restore: function () { this._offset = 0; },

        _judgeWinner: function(){
            var winner;
            if (this._offset <= -(this.END_WIDTH)) { winner = 'right'; }
            else if (this._offset >= this.END_WIDTH) { winner = 'left'; }

            if (winner) { this._onWinnerArise(winner); }
        }
    });
});
