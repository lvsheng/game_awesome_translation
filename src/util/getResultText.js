/**
 * @author lvsheng
 * @date 2015/1/9
 */
define([], function () {
    var generatorMap = {
        gather: function (result) {
            var info = '你以';

            if (result.minReactTime && result.averageReactTime) {
                info += "平均" + result.minReactTime/1000 + "s的反应时间，";
            }
            info += result.rightRate + "%的正确率\n";
            info += "在" + result.time + "s内";
            info += "成功收集了" + result.gather + "颗心,\n";

            if (result.winning) {
                info += "终于成功挽救了单身狗，使他与女神相遇了！"
            } else {
                info += [
                    "但还不足以挽留住女神~"
                ].join('\n');
            }
            return info;
        },
        hit: function (result) {
            return "你成功打掉了" + result.amount + "个地鼠";
        },
        pipeline: function (result) {
            return '你在' + result.time + 's内成功装配成功了' + result.assemble + '个机器人女友！';
        },
        bunt: function (result) {
            return _.template([
                "<% if (!winning) { %>",
                "<% } %>",
                "以<%= rate %>下/秒的手速狂点了<%= hitCount %>下，",
                "<% if (winning) { %>",
                "终于赢了~",
                "<% } else { %>",
                "你坚持了<%= time %>s却还是输了..",
                "<% } %>"
            ].join(''))(result);
        },
        find: function (result) {
            return "你在" + result.time + "s内成功找到" + result.amount + "个凤姐，鉴婊能力超强~！";
        },
        avoid: function (result) {
            var info;
            if (result.winning) {
                info = "这绝对是一个值得纪念的时刻！\n" +
                "你成功避开了总共" + result.passedAmount + "个00后，\n" +
                "拯救了" + result.passedWave + "波奥特曼，\n" +
                "赢得了最终的胜利！"
            } else if (result.remainedWave === 0) {
                info = "共成功避开了" + result.passedAmount + "个00后！\n" +
                "拯救完最后一波奥特曼就可以取得最后的胜利！";
            } else  if (result.passedWave > 1) {
                info = "共成功避开了" + result.passedAmount + "个00后！\n" +
                "再拯救" + (result.remainedWave + 1) + "波奥特曼就可以取得最后的胜利";
            } else if (result.passedAmount < 3) {
                info = "呃... 你只避开了" + result.passedAmount + "个00后，\n" +
                "再接再厉~！";
            } else {
                info = "成功避开了" + result.passedAmount + "个00后！\n" +
                "不过还是输了~";
            }

            return info;
        }
    };

    return function (gameName, result) {
        return generatorMap[gameName](result);
    };
});
