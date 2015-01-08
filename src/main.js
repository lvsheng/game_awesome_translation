/**
 * 游戏入口
 */
require([
    'util/resourceFileList',
    'util/preload',
    './home/HomeScene',
    './list/Scene'
], function (resourceFileList, preload, HomeScene, ListScene) {
    var launchHalf = false; //为true时表示是已经cc.game.run()了，但onStart还没有被执行，不能再次cc.game.run()
    cc.game.onStart = function(){
        cc.view.setDesignResolutionSize(1180, 640, cc.ResolutionPolicy.FIXED_HEIGHT);
        cc.view.resizeWithBrowserSize(true);
        cc._loaderImage = null;

        launchHalf = false;
        preload(resourceFileList['home'], function () {
            cc.director.runScene(new HomeScene());
        }, this);
    };

    function isHorizontal () { return window.innerWidth > window.innerHeight; }
    function judgeHorizontal () {
        var body = document.body;

        if (isHorizontal()) {
            body.style.width = window.innerWidth + 'px';
            body.style.height = window.innerHeight + 'px';
            body.style.right = "0px";
            body.className = "";
        }
        else {
            body.style.width = window.innerHeight + "px";
            body.style.height = window.innerWidth + "px";
            body.style.right = "-" + window.innerWidth + "px";
            body.className = "rotate"
        }

        if (!launchHalf) { //launch一半时不再再次run
            launchHalf = true;
            cc.game.run("gameCanvas");
        }
    }

    window.addEventListener("resize", judgeHorizontal);
    judgeHorizontal();
});
