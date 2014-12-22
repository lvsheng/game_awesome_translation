require([
    './gameUtil/resourceFileList',
    './bunt/gameScene/GameScene'
], function (resourceFileList, BuntGameScene) {
    cc.game.onStart = function(){
        cc.view.setDesignResolutionSize(960, 640, cc.ResolutionPolicy.FIXED_HEIGHT);
        cc.view.resizeWithBrowserSize(true);
        cc._loaderImage = null;

        //TODO:加主场景
        //这里测试先直接运行bunt这个游戏
        cc.LoaderScene.preload(resourceFileList['bunt'], function () {
            cc.director.runScene(new BuntGameScene());
        }, this);
    };
    cc.game.run("gameCanvas");
});
