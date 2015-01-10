/**
 * 用户点击分享按钮时执行的动作
 * @author lvsheng
 * @date 2015/1/6
 */
define([
    './getResultText',
    './getGameTitle',
    './dataStorage'
], function (getResultText, getGameTitle, dataStorage) {
    var sharedContent = {
        url: 'http://tb1.bdstatic.com/tb/zt/weixingame/awesome_translation/index.html',
        content: '',
        weixinImgUrl: '',
        weiboImgUrl: 'http://tieba.baidu.com/tb/zt/weixingame/awesome_translation/res/share/poster.jpg',
        _position: 'whole' //'whole'|gameName|gameName-result
    };
    var SHARE_CONTENT_MAP = {
        wholeGame: {
            content: [
                "贴吧神翻译-学渣好得意，谁玩谁流弊！"
            ].join(''),
            weixinImgUrl: 'http://tb1.bdstatic.com/tb/zt/weixingame/awesome_translation/res/share/whole.jpg'
        },
        game: {
            gather: {
                content: [
                    "我在“贴吧神翻译-谁玩谁流弊”玩“" + getGameTitle("gather") + "”！敢不敢来挑战我？"
                ].join(''),
                weixinImgUrl: 'http://tb1.bdstatic.com/tb/zt/weixingame/awesome_translation/res/share/gather.png'
            },
            hit: {
                content: [
                    "我在“贴吧神翻译-谁玩谁流弊”玩“" + getGameTitle("hit") + "”！敢不敢来挑战我？"
                ].join(''),
                weixinImgUrl: 'http://tb1.bdstatic.com/tb/zt/weixingame/awesome_translation/res/share/hit.png'
            },
            pipeline: {
                content: [
                    "我在“贴吧神翻译-谁玩谁流弊”玩“" + getGameTitle("pipeline") + "”！敢不敢来挑战我？"
                ].join(''),
                weixinImgUrl: 'http://tb1.bdstatic.com/tb/zt/weixingame/awesome_translation/res/share/pipeline.png'
            },
            bunt: {
                content: [
                    "我在“贴吧神翻译-谁玩谁流弊”玩“" + getGameTitle("bunt") + "”！敢不敢来挑战我？"
                ].join(''),
                weixinImgUrl: 'http://tb1.bdstatic.com/tb/zt/weixingame/awesome_translation/res/share/bunt.png'
            },
            find: {
                content: [
                    "我在“贴吧神翻译-谁玩谁流弊”玩“" + getGameTitle("find") + "”！敢不敢来挑战我？"
                ].join(''),
                weixinImgUrl: 'http://tb1.bdstatic.com/tb/zt/weixingame/awesome_translation/res/share/find.png'
            },
            avoid: {
                content: [
                    "我在“贴吧神翻译-谁玩谁流弊”玩“" + getGameTitle("avoid") + "”！敢不敢来挑战我？"
                ].join(''),
                weixinImgUrl: 'http://tb1.bdstatic.com/tb/zt/weixingame/awesome_translation/res/share/avoid.png'
            }
        },
        gameResult: {
            gather: {
                weixinImgUrl: 'http://tb1.bdstatic.com/tb/zt/weixingame/awesome_translation/res/share/gather.png'
            },
            hit: {
                weixinImgUrl: 'http://tb1.bdstatic.com/tb/zt/weixingame/awesome_translation/res/share/hit.png'
            },
            pipeline: {
                weixinImgUrl: 'http://tb1.bdstatic.com/tb/zt/weixingame/awesome_translation/res/share/pipeline.png'
            },
            bunt: {
                weixinImgUrl: 'http://tb1.bdstatic.com/tb/zt/weixingame/awesome_translation/res/share/bunt.png'
            },
            find: {
                weixinImgUrl: 'http://tb1.bdstatic.com/tb/zt/weixingame/awesome_translation/res/share/find.png'
            },
            avoid: {
                weixinImgUrl: 'http://tb1.bdstatic.com/tb/zt/weixingame/awesome_translation/res/share/avoid.png'
            }
        }
    };

    var title = "贴吧神翻译 谁玩谁流弊！";
    function shareFriend(onFail) {
        if (!window.WeixinJSBridge) { return; }
        window.WeixinJSBridge.invoke('sendAppMessage',{
            "appid": '',
            "img_url": sharedContent.weixinImgUrl,
            "img_width": "200",
            "img_height": "200",
            "link": sharedContent.url,
            "desc": sharedContent.content,
            "title": title
        }, onFail);
    }
    function shareTimeline(callback) {
        if (!window.WeixinJSBridge) { return; }
        window.WeixinJSBridge.invoke('shareTimeline',{
            "img_url": sharedContent.weixinImgUrl,
            "img_width": "200",
            "img_height": "200",
            "link": sharedContent.url,
            "title": sharedContent.content
        }, function () {
            callback && callback();
        });
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
            window.justAfterWeixinShareOnHorizontal = isHorizontal();
            shareFriend();
            $.stats.myTrack("微信分享给好友-" + sharedContent._position);
        });
        // 分享到朋友圈
        window.WeixinJSBridge.on('menu:share:timeline', function(argv){
            window.justAfterWeixinShareOnHorizontal = isHorizontal();
            shareTimeline();
            dataStorage.markHasShared();
            $.stats.myTrack("微信分享到朋友圈-" + sharedContent._position);
        });
        // 分享到微博
        window.WeixinJSBridge.on('menu:share:weibo', function(argv){
            window.justAfterWeixinShareOnHorizontal = isHorizontal();
            shareWeibo();
            $.stats.myTrack("微信分享到微博-" + sharedContent._position);
        });
        function isHorizontal () { return window.innerWidth > window.innerHeight; }
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
        /**
         * @param onFail
         * @param [auto] 标志非用户主动点击、而是程序自动调用。用于统计标志
         */
        tryWeixinShare: function (onFail, auto) {
            shareTimeline(onFail);

            if (!auto) {
                $.stats.myTrack("分享到微信按钮-" + sharedContent._position);
            }
        },
        weiboShare: function () {
            $.stats.myTrack("微博分享-" + sharedContent._position);
            dataStorage.markHasShared();
            window.location.href =
                'http://service.weibo.com/share/share.php'
                + '?url=' + encodeURIComponent(sharedContent.url)
                + '&title=' + encodeURIComponent(sharedContent.content.replace("贴吧神翻译", "#贴吧神翻译#"))
                + '&pic=' + encodeURIComponent(sharedContent.weiboImgUrl)
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
                sharedContent._position = "whole";
            } else if (type === 'game') {
                sharedContent = _.extend(sharedContent, SHARE_CONTENT_MAP.game[gameName]);
                sharedContent._position = gameName;
            } else if (type === 'gameResult') {
                sharedContent = _.extend(sharedContent, {
                    weixinImgUrl: SHARE_CONTENT_MAP.gameResult[gameName].weixinImgUrl,
                    content: this._getResultShareContent(gameName, gameResult)
                });
                sharedContent._position = gameName + "-result";
            }
        },

        _getResultShareContent: function (gameName, gameResult) {
            var resultText = getResultText(gameName, gameResult);
            if (gameName === 'avoid') {
                resultText = resultText.replace("你", "我").replace(/\n/g, ' ');
            } else {
                resultText = resultText.replace("你", "").replace(/\n/g, ' ');
            }
            var removedIndex = resultText.lastIndexOf("快");
            if (removedIndex === -1) { removedIndex = resultText.lastIndexOf("赶"); }
            --removedIndex; //跳过\n
            resultText = resultText.substring(0, removedIndex);
            var lastChar = resultText.charAt(resultText.length - 1);
            if (lastChar === "，" || lastChar === ",") { resultText = resultText.substring(0, resultText.length - 1); }//统一结尾
            return "我在“贴吧神翻译-谁玩谁流弊”玩“" + getGameTitle(gameName) + "”！"
                + resultText + "，敢不敢来挑战我？";
        }
    };

    //for debug
    //localStorage.removeItem("hasShared");
});
