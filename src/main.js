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

    var running = false;
    function runAndCancelInform () {
        if (running) {
            var curGame = mainScene.getInstance().getCurGame().sceneInstance;
            if (curGame && _.isFunction(curGame.resumeGame)) { curGame.resumeGame(); }
        } else {
            running = true;
            cc.game.run("gameCanvas");

            //TODO: bug to fix: 在android下刚进入页面时点得快了可能使屏幕放大
            //TODO: 有些浏览器下无法横屏？
        }
        document.getElementById("gameCanvas").style.display = "block";
        document.getElementById("j_horizontal_needed").style.display = "none";
    }
    function stopAndInformNeedHorizontal () {
        if (running) {
            var curGame = mainScene.getInstance().getCurGame().sceneInstance;
            if (curGame && _.isFunction(curGame.pauseGame)) { curGame.pauseGame(); }
        }
        document.getElementById("gameCanvas").style.display = "none";
        document.getElementById("j_horizontal_needed").style.display = "block";
    }

    function isHorizontal () { return window.innerWidth > window.innerHeight; }
    function judgeHorizontal () {
        if (isHorizontal()) { runAndCancelInform(); }
        else { stopAndInformNeedHorizontal(); }
    }

    window.addEventListener("resize", judgeHorizontal);
    judgeHorizontal();
});
