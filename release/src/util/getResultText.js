/**
 * @author lvsheng
 * @date 2015/1/9
 */
define([], function () {
    var generatorMap = {
        gather: function (result) {
            var info;
            if (result.winning) {
                info = _.template([
                    "通过你坚持不懈的",
                    "<%=gather%>个爱心收集，",
                    "屌丝终于和女神",
                    "幸福地生活在了一起！",
                    "赶紧补充姿势，",
                    "让世界充满爱！"
                ].join('\n'))(result);
            } else {
                info = _.template([
                    "寻爱之路好幸苦，",
                    "屌丝垂泪低头lu，",
                    "赶紧补充姿势，",
                    "让世界充满爱！"
                ].join('\n'))(result);
            }

            return info;
        },
        hit: function (result) {
            return _.template([
                "你已成功打倒了<%=amount%>个大导演，",
                "误伤了<%=loverAmount%>个女演员，",
                "快继续补充姿势，",
                "娱乐圈的规则将因你而改写！"
            ].join('\n'))(result);
        },
        pipeline: function (result) {
            return _.template([
                "你已经送给了技术宅",
                "<%=assemble%>个机器人女友，",
                "快再补充点姿势，",
                "要不怎么跟技术宅玩耍！"
            ].join('\n'))(result);
        },
        bunt: function (result) {
            var info = "";
            if (result.winAmount > 0) {
                info = _.template([
                    "你以<%= rate %>下/秒的手速",
                    "点击了<%= time %>秒，",
                    "在蓝翔挖掘机撕逼战中",
                    "赢得了第<%= winAmount %>轮的胜利！",
                    "赶紧补充姿势，",
                    "再战蓝翔！"
                ].join('\n'))(result);
            } else {
                info = _.template([
                    "你在<%= time %>秒内点击了<%= hitCount %>下",
                    "却还是输了，",
                    "赶紧补充姿势，",
                    "再战蓝翔！"
                ].join('\n'))(result);
            }
            return info;
        },
        find: function (result) {
            return _.template("在<%= fanbingbingAmount %>个范冰冰里面找到<%= hitCount %>个\n凤姐的脸都不算事儿！\n快来补充姿势，\n争当专业鉴婊师！")(result);
        },
        avoid: function (result) {
            return _.template([
                "<%= passedAmount %>个凹凸曼在你的协助下",
                "躲过了<%= turn %>轮零零后的攻击，",
                "赶紧补充姿势，",
                "把零零后的侵占计划",
                "扼杀在摇篮！"
            ].join('\n'))(result);
        }
    };

    return function (gameName, result) {
        return generatorMap[gameName](result);
    };
});