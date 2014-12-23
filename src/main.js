/**
 * 游戏入口
 */
require([
    './gameUtil/resourceFileList',
    './mainScene'
], function (resourceFileList, mainScene) {
    cc.game.onStart = function(){
        cc.view.setDesignResolutionSize(1180, 640, cc.ResolutionPolicy.FIXED_HEIGHT);
        cc.view.resizeWithBrowserSize(true);
        cc._loaderImage = null;

        cc.LoaderScene.preload(resourceFileList['main'], function () {
            cc.director.runScene(mainScene.getInstance());
        }, this);
    };
    cc.game.run("gameCanvas");

    //TODO: 用户旋转屏幕的处理、对水平屏幕的要求。旋转处理时应先暂停游戏、不能影响游戏（比如bunt游戏中就是根据屏幕宽度来判断胜负的）
    //TODO: bug to fix: 在android下刚进入页面时点得快了可能使屏幕放大
    //TODO: 有些浏览器下无法横屏？
});
