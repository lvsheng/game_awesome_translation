/**
 * 暂停当前正在进行的游戏场景
 * @author lvsheng
 * @date 2014/12/22
 */
define([
    '../mainScene'
], function (mainScene) {
    return function () {
        var curGameScene = mainScene.getCurGame().sceneInstance;
        curGameScene.pause();

        //增加遮罩层以屏幕用户触摸事件
        //TODO
    };
});
