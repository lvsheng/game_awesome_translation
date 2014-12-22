/**
 * 游戏入口
 */
require([
    './gameUtil/resourceFileList',
    './mainScene'
], function (resourceFileList, mainScene) {
    cc.game.onStart = function(){
        cc.view.setDesignResolutionSize(960, 640, cc.ResolutionPolicy.FIXED_HEIGHT);
        cc.view.resizeWithBrowserSize(true);
        cc._loaderImage = null;

        cc.LoaderScene.preload(resourceFileList['main'], function () {
            cc.director.runScene(mainScene.getInstance());
        }, this);
    };
    cc.game.run("gameCanvas");

    //TODO: 用户旋转屏幕的处理、对水平屏幕的要求
});
