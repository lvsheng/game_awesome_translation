/**
 * 负责一个具体游戏中游戏规则的所有逻辑
 * （包括游戏内逻辑、用户操作、各种事件与调度，同时也包括计时、计分）
 *
 * 实例被创建即进入游戏过程，
 * 游戏玩到结束时会调用pauseGame停止游戏并通知所属的游戏场景
 * 正常结束后唯一输出为玩家在游戏中的分数、成就（通过回调回传给场景）
 * (非正常结束有暂停、场景被强制切换等）
 */
define([
    '../../../gameUtil/pauseGame',
    './Teenager'
], function (pauseGame, Teenager) {
    return cc.Layer.extend({
        /**
         * @param endCallback 回调函数。游戏结束时调用此函数进行处理
         */
        ctor: function (endCallback) {
            this._super(); this.init();

            this._endCallback = endCallback;
            this.addChild(new Teenager());
        }
    });
});
