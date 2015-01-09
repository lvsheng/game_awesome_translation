/**
 * @author lvsheng
 * @date 2015/1/9
 */
define([], function () {
    var map = {
        gather: "爱情had found",
        hit: "打个大导演",
        pipeline: "我的机器人女友",
        bunt: "撕逼强,找蓝翔",
        find: "鉴婊师训练营",
        avoid: "凹凸曼大战零零后"
    };

    return function (gameName) {
        return map[gameName];
    };
});
