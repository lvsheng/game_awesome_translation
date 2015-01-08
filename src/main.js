/**
 * 游戏入口
 */
require([
    'util/resourceFileList',
    'util/preload',
    'util/share',
    './home/HomeScene',
    './list/Scene'
], function (resourceFileList, preload, share, HomeScene, ListScene) {
    var launchHalf = false; //为true时表示是已经cc.game.run()了，但onStart还没有被执行，不能再次cc.game.run()
    cc.game.onStart = function(){
        launchHalf = false;
        //showWidthHeight('before\n');
        cc.view.setDesignResolutionSize(1180, 640, cc.ResolutionPolicy.FIXED_HEIGHT);
        //showWidthHeight('after\n');
        //就是在这里把canvas的宽高扩大了将近3倍~
        cc.view.resizeWithBrowserSize(true);
        cc._loaderImage = null;

        preload(resourceFileList['home'], function () {
            //alert("run home:");
            //showWidthHeight('preload home done');
            cc.director.runScene(new HomeScene());
        }, this);
    };

    function isHorizontal () { return window.innerWidth > window.innerHeight; }
    function judgeHorizontal () {
        //showWidthHeight('judge');

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
            //alert("document.size" + window.screen.width + ', ' + window.screen.height);
            //alert("window.size" + window.innerWidth + ', ' + window.innerHeight);
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

    var isFirstResize = true;
    window.addEventListener("resize", function () {
        if (isFirstResize) { //第一次resize应为judgeHorizontal中对cc.game.run的调用所致，故忽略
            isFirstResize = false;
            return;
        }

        judgeHorizontal();
    });
    judgeHorizontal();

    window.showWidthHeight = function (key) {
        alert(
            (key ? key : '') +
            'canvas, w:' + document.getElementById("gameCanvas").width + '\n' +
            'h:' + document.getElementById("gameCanvas").height
        );
    };

    share.setShareResult('wholeGame');
});
