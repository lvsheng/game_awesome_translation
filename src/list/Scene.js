/**
 * 单例
 * @author lvsheng
 * @date 2015/1/3
 */
define([
    '../util/share',
    './ListLayer',
    './BackgroundLayer'
], function (share, ListLayer, BackgroundLayer) {
    return cc.Scene.extend({
        onEnter: function () {
            var self = this;
            self._super();
            $.stats.myTrack("游戏列表页");

            share.setShareResult("wholeGame");

            self.addChild(self._bgLayer = new BackgroundLayer());
            self.addChild(self._listLayer = new ListLayer());
        }
    });
});
