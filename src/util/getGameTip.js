/**
 * @author lvsheng
 * @date 2015/1/9
 */
define([], function () {
    var map = {
        gather: "爱情就像鬼，听过没见过？\n来神翻译瞧瞧呀！\n快速点击落下来的“心”，\n帮助屌丝赢取女神获得爱情吧！",
        hit: "打！打！打个大导演！\n潜！潜！我让你潜演员！\n是时候给那些搅乱娱乐圈的导演一点\ncolour see see了！\n" +
            "给你30秒的时间，\n" +
            "别误伤女演员哟~",
        pipeline: "没有女友怕什么！\n点击屏幕帮助技术宅给机器人女友组装\n上头部吧~\n头部和身体要对准了才能安装成功，\n注意契合点，\n" +
            "安错3个就失败了！",
        bunt: "下面问题来了：\n你能在多短的时间内撕赢蓝翔挖掘机?\n快速点击屏幕右下角按钮即可击退蓝翔!",
        find: "只因为在人群中多看了她一眼，\n看你能不能在千万个范冰冰中\n尽可能多地找到凤姐的脸！\n限时30秒，\n时间紧迫，抓紧挑战！",
        avoid: "零零后正在侵占地球，\n快帮凹凸曼躲过零零后的袭击吧！\n在凹凸曼撞到零零后前\n点击屏幕跳跃躲避，眼要紧，手要快！"
    };

    return function (gameName) {
        return map[gameName];
    };
});
