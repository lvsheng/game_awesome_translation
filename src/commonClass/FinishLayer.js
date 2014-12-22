/**
 * 一个小游戏结束后展示结果的层
 * 会展示成绩，并带有重玩、下个游戏、回首页、分享等按钮及相关功能
 * 出现时有动画
 * @author lvsheng
 * @date 2014/12/22
 */
define([], function () {
    return cc.Layer.extend({
        /**
         * @param result 应包括分数、成就、提示文案等
         */
        ctor: function (result) {
            this._super();
            this.init();

            //TODO: 使用文案、分数等生成展示内容。展示面板及其上按钮、相关功能。
            alert("游戏结束。你的分数是：" + result.score);
        }
    });
});
