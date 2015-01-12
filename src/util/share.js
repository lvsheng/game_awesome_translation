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

    return {
        //其实本来应该在本模块中判断是否为微信环境、然后自动选择平台进行分享的。但加阴影层需要屏蔽底部层的事件、可是时间比较紧，没搞出来T_T
        /**
         * @param [auto] 标志非用户主动点击、而是程序自动调用。用于统计标志
         */
        tryWeixinShare: function (auto) {
            shareTimeline();

            if (!auto) {
                $.stats.myTrack("分享到微信按钮-" + window.g_sharedContent._position);
            }
        },
        weiboShare: function () {
            $.stats.myTrack("微博分享-" + window.g_sharedContent._position);
            dataStorage.markHasShared();
            window.location.href =
                'http://service.weibo.com/share/share.php'
                + '?url=' + encodeURIComponent(window.g_sharedContent.url)
                + '&title=' + encodeURIComponent(window.g_sharedContent.content.replace("贴吧神翻译", "#贴吧神翻译#"))
                + '&pic=' + encodeURIComponent(window.g_sharedContent.weiboImgUrl)
                + '&appkey=2285628874&ralateUid=1673450172';
        },

        /**
         * @param type 'wholeGame'|'game'|'gameResult'
         * @param [gameName]
         * @param [gameResult] {Object} 对象中具体字段自定义
         */
        setShareResult: function (type, gameName, gameResult) {
            if (type === 'wholeGame') {
                window.g_sharedContent = _.extend(window.g_sharedContent, SHARE_CONTENT_MAP.wholeGame);
                window.g_sharedContent._position = "whole";
            } else if (type === 'game') {
                window.g_sharedContent = _.extend(window.g_sharedContent, SHARE_CONTENT_MAP.game[gameName]);
                window.g_sharedContent._position = gameName;
            } else if (type === 'gameResult') {
                window.g_sharedContent = _.extend(window.g_sharedContent, {
                    weixinImgUrl: SHARE_CONTENT_MAP.gameResult[gameName].weixinImgUrl,
                    content: this._getResultShareContent(gameName, gameResult)
                });
                window.g_sharedContent._position = gameName + "-result";
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
});
