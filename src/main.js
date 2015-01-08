/**
 * 游戏入口
 */
require([
    'util/resourceFileList',
    'util/preload',
    './home/HomeScene',
    './list/Scene'
], function (resourceFileList, preload, HomeScene, ListScene) {
    cc.game.onStart = function(){
        cc.view.setDesignResolutionSize(1180, 640, cc.ResolutionPolicy.FIXED_HEIGHT);
        cc.view.resizeWithBrowserSize(true);
        cc._loaderImage = null;

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
            body.style.transform = "rotate(0deg)";
            body.style.webkitTransform = "rotate(0deg)";
        }
        else {
            body.style.width = window.innerHeight + "px";
            body.style.height = window.innerWidth + "px";
            body.style.right = "-" + window.innerWidth + "px";
            body.style.transform = "rotate(90deg)";
            body.style.webkitTransform = "rotate(90deg)";
        }

        cc.game.run("gameCanvas");
    }

    window.addEventListener("resize", judgeHorizontal);
    judgeHorizontal();
});
