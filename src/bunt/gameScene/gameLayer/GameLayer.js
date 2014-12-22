/**
 * 负责游戏中的所有逻辑
 * 正常结束时输出玩家在游戏中的分数、成就
 *
 * 实例被创建后即进入游戏过程，
 * 游戏玩到结束时会调用pauseGame停止游戏并通知所属的游戏场景
 * 除游戏结束外，也会随着场景的pause而暂停、随着场景的切换而被强制结束
 */
define(['./Cars'], function (Cars) {
    return cc.Layer.extend({
        _cars: null,

        ctor: function () {
            this._super();
            this.init();

            this.cars = new Cars();
            alert("game layer constructed")
        }
    });
});
