/**
 * 用户点击分享按钮时执行的动作
 * @author lvsheng
 * @date 2015/1/6
 */
define([], function () {
    var weiboTopic = "#贴吧神翻译#";
    var sharedContent = {
        url: 'http://tieba.baidu.com/tb/zt/weixingame/awesome_translation/index.html',
        content: '',
        imgUrl: ''
    };
    var SHARE_CONTENT_MAP = {
        wholeGame: {
            content: [
                "贴吧神翻译-学渣好得意，谁玩谁流弊！"
            ].join(''),
            imgUrl: 'http://tieba.baidu.com/tb/zt/weixingame/awesome_translation/res/share/whole.jpg'
        },
        game: {
            gather: {
                content: [
                    "我在玩“贴吧神翻译-谁玩谁流弊”中的“爱情had found”游戏！敢不敢来挑战我？"
                ].join(''),
                imgUrl: 'http://tieba.baidu.com/tb/zt/weixingame/awesome_translation/res/share/gather.png'
            },
            hit: {
                content: [
                    "我在玩“贴吧神翻译-谁玩谁流弊”中的“打个大导演”游戏！敢不敢来挑战我？"
                ].join(''),
                imgUrl: 'http://tieba.baidu.com/tb/zt/weixingame/awesome_translation/res/share/hit.png'
            },
            pipeline: {
                content: [
                    "我在玩“贴吧神翻译-谁玩谁流弊”中的“我的机器人女友”游戏！敢不敢来挑战我？"
                ].join(''),
                imgUrl: 'http://tieba.baidu.com/tb/zt/weixingame/awesome_translation/res/share/pipeline.png'
            },
            bunt: {
                content: [
                    "我在玩“贴吧神翻译-谁玩谁流弊”中的“撕逼强，找蓝翔！”游戏！敢不敢来挑战我？"
                ].join(''),
                imgUrl: 'http://tieba.baidu.com/tb/zt/weixingame/awesome_translation/res/share/bunt.png'
            },
            find: {
                content: [
                    "我在玩“贴吧神翻译-谁玩谁流弊”中的“鉴婊师训练营”游戏！敢不敢来挑战我？"
                ].join(''),
                imgUrl: 'http://tieba.baidu.com/tb/zt/weixingame/awesome_translation/res/share/find.png'
            },
            avoid: {
                content: [
                    "我在玩“贴吧神翻译-谁玩谁流弊”中的“凹凸曼大战零零后”游戏！敢不敢来挑战我？"
                ].join(''),
                imgUrl: 'http://tieba.baidu.com/tb/zt/weixingame/awesome_translation/res/share/avoid.png'
            }
        },
        gameResult: {
            gather: {
                getContent: function (result) {

                },
                imgUrl: 'http://tieba.baidu.com/tb/zt/weixingame/awesome_translation/res/share/gather.png'
            },
            hit: {
                getContent: function (result) {

                },
                imgUrl: 'http://tieba.baidu.com/tb/zt/weixingame/awesome_translation/res/share/hit.png'
            },
            pipeline: {
                getContent: function (result) {

                },
                imgUrl: 'http://tieba.baidu.com/tb/zt/weixingame/awesome_translation/res/share/pipeline.png'
            },
            bunt: {
                getContent: function (result) {

                },
                imgUrl: 'http://tieba.baidu.com/tb/zt/weixingame/awesome_translation/res/share/bunt.png'
            },
            find: {
                getContent: function (result) {

                },
                imgUrl: 'http://tieba.baidu.com/tb/zt/weixingame/awesome_translation/res/share/find.png'
            },
            avoid: {
                getContent: function (result) {

                },
                imgUrl: 'http://tieba.baidu.com/tb/zt/weixingame/awesome_translation/res/share/avoid.png'
            }
        }
    };

    function shareFriend(onFail) {
        WeixinJSBridge.invoke('sendAppMessage',{
            "appid": '',
            "img_url": sharedContent.imgUrl,
            "img_width": "200",
            "img_height": "200",
            "link": sharedContent.url,
            "desc": sharedContent.content,
            "title": sharedContent.content
        }, onFail)
    }
    function shareTimeline(onFail) {
        WeixinJSBridge.invoke('shareTimeline',{
            "img_url": sharedContent.imgUrl,
            "img_width": "200",
            "img_height": "200",
            "link": sharedContent.url,
            "desc": sharedContent.content,
            "title": sharedContent.content
        }, onFail);
    }
    function shareWeibo(onFail) {
        WeixinJSBridge.invoke('shareWeibo',{
            "content": sharedContent.content,
            "url": sharedContent.url
        }, onFail);
    }

    // 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        //TODO: 验证是不是能绑定上这个事件（会不会事件触发之后本函数代码才执行）
        alert("on WeixinJSBridgeReady");

        // 发送给好友
        WeixinJSBridge.on('menu:share:appmessage', function(argv){
            shareFriend();
        });
        // 分享到朋友圈
        WeixinJSBridge.on('menu:share:timeline', function(argv){
            shareTimeline();
        });
        // 分享到微博
        WeixinJSBridge.on('menu:share:weibo', function(argv){
            shareWeibo();
        });
    }, false);

    return {
        tryWeixinShare: function (onFail) {
            shareTimeline(onFail);
        },
        weiboShare: function () {
            window.location.href =
                'http://service.weibo.com/share/share.php'
                + '?url=' + sharedContent.url
                + '&title=' + sharedContent.content
                + '&pic=' + sharedContent.imgUrl
                + '&appkey=2285628874&ralateUid=1673450172';
        },

        /**
         * @param type 'wholeGame'|'game'|'gameResult'
         * @param [gameName]
         * @param [gameResult] {Object} 对象中具体字段自定义
         */
        setShareResult: function (type, gameName, gameResult) {
            if (type === 'wholeGame') {
                sharedContent = _.extend(sharedContent, SHARE_CONTENT_MAP.wholeGame);
            } else if (type === 'game') {
                sharedContent = _.extend(sharedContent, SHARE_CONTENT_MAP.game[gameName]);
            } else if (type === 'gameResult') {
                sharedContent = _.extend(sharedContent, {
                    imgUrl: SHARE_CONTENT_MAP.gameResult[gameName].imgUrl,
                    content: SHARE_CONTENT_MAP.gameResult[gameName].getContent(gameResult)
                });
            }
        }
    };
});
