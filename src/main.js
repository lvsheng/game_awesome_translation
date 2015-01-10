/**
 * 游戏入口
 */
require([
    './util/resourceFileList',
    './util/preload',
    './util/share',
    './util/myDirector',
    './util/dataStorage'
], function (resourceFileList, preload, share, myDirector, dataStorage) {
    $.stats.myTrack("进入到main.js");
    share.setShareResult('wholeGame');

    var launchHalf = false; //为true时表示是已经cc.game.run()了，但onStart还没有被执行，不能再次cc.game.run()
    cc.game.onStart = function(){
        launchHalf = false;
        cc.view.setDesignResolutionSize(1180, 640, cc.ResolutionPolicy.FIXED_HEIGHT);
        cc.view.resizeWithBrowserSize(true);

        if (dataStorage.whetherNeedJumpToResultPage()) {
            if (!dataStorage.getLastResult().gameName) {
                console.error("error~ in main.js, dataStorage.whetherNeedJumpToResultPage() === true but !dataStorage.getLastResult().gameName");
                myDirector.enterHome();
            } else {
                myDirector.enterResult(dataStorage.getLastResult().gameName, dataStorage.getLastResult().result, true);
            }
            dataStorage.markNeedJumpToResultPage(false);
        } else {
            myDirector.enterHome();
        }
    };

    function isHorizontal () { return window.innerWidth > window.innerHeight; }
    function judgeHorizontal () {
        //真正对页面的旋转在index.html已做，这里认为每次resize之后index.html中已正确旋转。
        if (isHorizontal()) {
            //取消旋转
            window.rotatedTouchPositionTransformer.setRotated(false);
        }
        else {
            //旋转
            window.rotatedTouchPositionTransformer.setRotated(true);
        }

        if (!launchHalf) { //launch一半时不再再次run
            launchHalf = true;
            cc.game.run("gameCanvas");
        }
    }

    var isFirstResize = true;
    window.addEventListener("resize", function () {
        if (isFirstResize) { //第一次resize应为judgeHorizontal中对cc.game.run的调用所致，故忽略
            isFirstResize = false;
            return;
        }

        if (window.justAfterWeixinShareOnHorizontal) {
            window.justAfterWeixinShareOnHorizontal = false;
            return;
        }

        judgeHorizontal();

        $.stats.myTrack("window.resize事件");
    });
    judgeHorizontal();
});
