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
        alert('judge');
        showWidthHeight();

        var element = document.documentElement;

        if (isHorizontal()) {
            //取消旋转
            element.style.width = window.innerWidth + 'px';
            element.style.height = window.innerHeight + 'px';
            element.style.right = "0px";
            element.className = "";
            window.rotatedTouchPositionTransformer.setRotated(false);
        }
        else {
            //旋转
            element.style.width = window.innerHeight + "px";
            element.style.height = window.innerWidth + "px";
            element.style.right = "-" + window.innerWidth + "px";
            element.className = "rotate";
            window.rotatedTouchPositionTransformer.setRotated(true);
        }

        if (!launchHalf) { //launch一半时不再再次run
            launchHalf = true;
            cc.game.run("gameCanvas");
        }
    }

    //function launchListener () {
    //    window.addEventListener("resize", judgeHorizontal);
    //    window.removeEventListener("resize", launchListener);
    //}
    //window.addEventListener('resize', launchListener);
    var isFirstResize = true;
    window.addEventListener("resize", function () {
        showWidthHeight();
        if (isFirstResize) { //第一次resize应为judgeHorizontal中对cc.game.run的调用所致，故忽略
            isFirstResize = false;
            return;
        }

        judgeHorizontal();
    });
    judgeHorizontal();

    function showWidthHeight () {
        alert('w:' + window.innerWidth + '\n' +
                'h:' + window.innerHeight
        );
    }
});
