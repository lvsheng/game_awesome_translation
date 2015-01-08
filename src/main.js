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
    var isFirstStart = true;
    cc.game.onStart = function(){
        launchHalf = false;
        //showWidthHeight('before\n');
        cc.view.enableRetina(false); //默认retina开启，会导致canvas过大，在旋转状态下会导致首次显示不正常（具体原因未知）
        cc.view.setDesignResolutionSize(1180, 640, cc.ResolutionPolicy.FIXED_HEIGHT);
        //showWidthHeight('after\n');
        //就是在这里把canvas的宽高扩大了将近3倍~
        cc.view.resizeWithBrowserSize(true);
        cc._loaderImage = null;

        //尝试手动触发一次resize
        //if (isFirstStart) {
        //    isFirstStart = false;
        //    var event = document.createEvent('HTMLEvents');
        //    event.initEvent('resize', true, true);
        //    window.dispatchEvent(event);
        //    return;
        //}
        //手机上还是无效~

        //canvas的尺寸已经乱了，强制搞一下试试
        //var canvas = document.getElementById("gameCanvas");
        //if (isHorizontal()) {
        //    //未旋转
        //    canvas.width = window.innerWidth;
        //    canvas.height = window.innerHeight;
        //}
        //else {
        //    //旋转
        //    canvas.width = window.innerHeight;
        //    canvas.height = window.innerWidth;
        //}
        //强制之后，内容是展示了，不过里面的内容太大，应该是cocos里面已经用了太大的canvas尺寸。。

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
        //alert('resize event, window: ' + window.innerWidth + ', ' + window.innerHeight);
        //showWidthHeight('resize');
        if (isFirstResize) { //第一次resize应为judgeHorizontal中对cc.game.run的调用所致，故忽略
            isFirstResize = false;
            return;
        }

        judgeHorizontal();
    });
    judgeHorizontal();

    window.showWidthHeight = function (key) {
        //alert('w:' + window.innerWidth + '\n' +
        //    'h:' + window.innerHeight
        //);
        alert(
            (key ? key : '') +
            'canvas, w:' + document.getElementById("gameCanvas").width + '\n' +
            'h:' + document.getElementById("gameCanvas").height
        );
    }
});
