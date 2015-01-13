//调用方：
//调用前要判断是不是有全局变量

var g_sharedContent = {
    appid: '',
    url: 'tieba.baidu.com/tb/zt/weixingame/awesome_translation/index.html?v=1501131933',
    content: '',
    weixinImgUrl: 'http://tb1.bdstatic.com/tb/zt/weixingame/awesome_translation/res/share/whole.jpg',
    weiboImgUrl: 'http://tb1.bdstatic.com/tb/zt/weixingame/awesome_translation/res/share/poster.jpg',
    title: "贴吧神翻译 谁玩谁流弊！",
    callback: function () {},
    _position: 'whole' //'whole'|gameName|gameName-result
};

function shareFriend() {
    WeixinJSBridge.invoke('sendAppMessage',{
        "appid": "",
        "img_url": g_sharedContent.weixinImgUrl,
        "img_width": "200",
        "img_height": "200",
        "link": g_sharedContent.url,
        "desc": g_sharedContent.content,
        "title": g_sharedContent.title
    }, function(res) {
        g_sharedContent.callback();
    });
}
function shareTimeline() {
    WeixinJSBridge.invoke('shareTimeline',{
        "appid": g_sharedContent.appid,
        "img_url": g_sharedContent.weixinImgUrl,
        "img_width": "200",
        "img_height": "200",
        "link": g_sharedContent.url,
        "desc": g_sharedContent.content,
        "title": g_sharedContent.content
    }, function(res) {
        g_sharedContent.callback();
    });
}
function shareWeibo() {
    WeixinJSBridge.invoke('shareWeibo',{
        "content": g_sharedContent.content,
        "url": g_sharedContent.url
    }, function(res) {
        g_sharedContent.callback();
    });
}
document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
    // 发送给好友
    WeixinJSBridge.on('menu:share:appmessage', function(argv){
        window.justAfterWeixinShareOnHorizontal = isHorizontal();
        shareFriend();
        g_dataStorage.markHasShared();
        $.stats.myTrack("微信分享给好友-" + g_sharedContent._position);
    });
    // 分享到朋友圈
    WeixinJSBridge.on('menu:share:timeline', function(argv){
        window.justAfterWeixinShareOnHorizontal = isHorizontal();
        shareTimeline();
        g_dataStorage.markHasShared();
        $.stats.myTrack("微信分享到朋友圈-" + g_sharedContent._position);
    });
    // 分享到微博
    WeixinJSBridge.on('menu:share:weibo', function(argv){
        window.justAfterWeixinShareOnHorizontal = isHorizontal();
        shareWeibo();
        g_dataStorage.markHasShared();
        $.stats.myTrack("微信分享到微博-" + g_sharedContent._position);
    });
    function isHorizontal () { return window.innerWidth > window.innerHeight; }
}, false);
