/**
 * 倒计时
 * @author lvsheng
 * @date 2014/12/22
 */
define([
    '../util/resourceFileMap'
], function (resourceFileMap) {
    return cc.Layer.extend({
        ctor: function (initTime) {
            var self = this;
            self._super();
            self.init();

            var winSize = cc.director.getWinSize();
            var center = cc.p(winSize.width / 2, winSize.height / 2);
            self._remainedTime = initTime || 30;

            var board = new cc.Sprite(resourceFileMap.common.countBoard);
            board.attr({anchorY: 1, y: winSize.height, x: 215});
            self.addChild(board);
            //alert("board path:" + resourceFileMap.common.countBoard);

            var label = new cc.LabelBMFont("", resourceFileMap.common.resultLayer.textFont);
            label.color = cc.color(255, 255, 255, 255);
            label.attr({anchorX: 0, anchorY: 0.5});
            label.setPosition(207, winSize.height - 61);
            label.scale = 1.5;
            //label.setPosition(center.x + 120 - 20, winSize.height - 235);
            self.addChild(label);

            self.bake();
            self.schedule(function (dt) {
                self._remainedTime -= dt;
                if (self._remainedTime < 0) { self._remainedTime = 0; }

                var newString = parseInt(self._remainedTime) + "'";
                var oldString = label.getString();
                if (newString !== oldString) {
                    self.unbake();
                    label.setString(parseInt(self._remainedTime) + "'", true);
                    self.bake();
                }
            });
        }
    });
});
