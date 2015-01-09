/**
 * 用户点击分享按钮时执行的动作
 * @author lvsheng
 * @date 2015/1/6
 */
define([
], function () {
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
                    "我在“贴吧神翻译-谁玩谁流弊”玩“爱情had found”游戏！敢不敢来挑战我？"
                ].join(''),
                imgUrl: 'http://tieba.baidu.com/tb/zt/weixingame/awesome_translation/res/share/gather.png'
            },
            hit: {
                content: [
                    "我在“贴吧神翻译-谁玩谁流弊”玩“打个大导演”游戏！敢不敢来挑战我？"
                ].join(''),
                imgUrl: 'http://tieba.baidu.com/tb/zt/weixingame/awesome_translation/res/share/hit.png'
            },
            pipeline: {
                content: [
                    "我在“贴吧神翻译-谁玩谁流弊”玩“我的机器人女友”游戏！敢不敢来挑战我？"
                ].join(''),
                imgUrl: 'http://tieba.baidu.com/tb/zt/weixingame/awesome_translation/res/share/pipeline.png'
            },
            bunt: {
                content: [
                    "我在“贴吧神翻译-谁玩谁流弊”玩“撕逼强，找蓝翔！”游戏！敢不敢来挑战我？"
                ].join(''),
                imgUrl: 'http://tieba.baidu.com/tb/zt/weixingame/awesome_translation/res/share/bunt.png'
            },
            find: {
                content: [
                    "我在“贴吧神翻译-谁玩谁流弊”玩“鉴婊师训练营”游戏！敢不敢来挑战我？"
                ].join(''),
                imgUrl: 'http://tieba.baidu.com/tb/zt/weixingame/awesome_translation/res/share/find.png'
            },
            avoid: {
                content: [
                    "我在“贴吧神翻译-谁玩谁流弊”玩“凹凸曼大战零零后”游戏！敢不敢来挑战我？"
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
        if (!window.WeixinJSBridge) { return; }
        window.WeixinJSBridge.invoke('sendAppMessage',{
            "appid": '',
            "img_url": sharedContent.imgUrl,
            "img_width": "200",
            "img_height": "200",
            "link": sharedContent.url,
            "desc": sharedContent.content,
            "title": sharedContent.content
        }, onFail);
    }
    function shareTimeline(onFail) {
        if (!window.WeixinJSBridge) { return; }
        window.WeixinJSBridge.invoke('shareTimeline',{
            "img_url": sharedContent.imgUrl,
            "img_width": "200",
            "img_height": "200",
            "link": sharedContent.url,
            "desc": sharedContent.content,
            "title": sharedContent.content
        }, onFail);
    }
    function shareWeibo(onFail) {
        if (!window.WeixinJSBridge) { return; }
        window.WeixinJSBridge.invoke('shareWeibo',{
            "content": sharedContent.content,
            "url": sharedContent.url
        }, onFail);
    }

    function bindWeixin() {
        // 发送给好友
        window.WeixinJSBridge.on('menu:share:appmessage', function(argv){
            shareFriend();
            $.stats.myTrack("微信分享给好友");
        });
        // 分享到朋友圈
        window.WeixinJSBridge.on('menu:share:timeline', function(argv){
            shareTimeline();
            $.stats.myTrack("微信分享到朋友圈");
        });
        // 分享到微博
        window.WeixinJSBridge.on('menu:share:weibo', function(argv){
            shareWeibo();
            $.stats.myTrack("微信分享到微博");
        });
    }
    if (window.WeixinJSBridge) {
        //防止本文件执行时事件已经触发过，这里手动调用一次
        bindWeixin();
    } else {
        // 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
        document.addEventListener('WeixinJSBridgeReady', bindWeixin, false);
    }

    return {
        //其实本来应该在本模块中判断是否为微信环境、然后自动选择平台进行分享的。但加阴影层需要屏蔽底部层的事件、可是时间比较紧，没搞出来T_T
        tryWeixinShare: function (onFail) {
            shareTimeline(onFail);
        },
        weiboShare: function () {
            $.stats.myTrack("微博分享");
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
