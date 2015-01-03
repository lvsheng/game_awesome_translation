/**
 * 游戏入口
 */
require([
    './gameUtil/resourceFileList',
    './gameUtil/preload',
    './home/HomeScene'
], function (resourceFileList, preload, HomeScene) {
    cc.game.onStart = function(){
        cc.view.setDesignResolutionSize(1180, 640, cc.ResolutionPolicy.FIXED_HEIGHT);
        cc.view.resizeWithBrowserSize(true);
        cc._loaderImage = null;

        preload(resourceFileList['main'], function () {
            cc.director.runScene(new HomeScene());
        }, this);
    };

    var running = false;
    function runAndCancelInform () {
        if (running) {
            //do nothing. (now should be paused state)
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
            var curGame = HomeScene.getInstance().getCurGame().sceneInstance;
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
