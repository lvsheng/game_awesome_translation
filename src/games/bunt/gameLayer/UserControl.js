/**
 * @author lvsheng
 * @date 2014/12/22
 */
define([
    '../../../util/resourceFileMap'
], function (resourceFileMap) {
    return cc.Sprite.extend({
        _hitCount: 0,
        ctor: function(positionManager){
            var self = this;
            var winSize = cc.director.getWinSize();
            self._super(); self.init();
            self.setPosition(winSize.width - 88, winSize.height - 563);

            var button = new cc.Sprite(resourceFileMap.bunt.button);
            var button_hover = new cc.Sprite(resourceFileMap.bunt.button_hover);
            self.width = button.width;
            self.height = button.height;
            button.setPosition(self.width / 2);
            button.setPosition(self.height / 2);
            button_hover.setPosition(self.width / 2);
            button_hover.setPosition(self.height / 2);
            self.addChild(button);
            self.addChild(button_hover); //button_hover在button之上，出现时将其盖住

            //默认只展示button，点中时展示button_hover
            button_hover.visible = false;

            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE, //这里的ONE_BY_ONE指的是多个手指时
                swallowTouches: false,
                onTouchBegan: function (touch) {
                    if (self._hitSuccessful(touch.getLocation())) {
                        ++self._hitCount;
                        positionManager.toLeft();
                        button_hover.visible = true;
                    }
                    return true; //需return true，后续的touchEnd、touchMove事件才会继续触发
                },
                onTouchEnded: function () {
                    button_hover.visible = false;
                }
            }, self);
        },
        getHitCount: function(){ return this._hitCount; },
        _hitSuccessful: function (position) {
            var nodePosition = this.convertToNodeSpace(position);
            return nodePosition.x > 0 && nodePosition.x < this.width && nodePosition.y > 0 && nodePosition.y < this.height;
        }
    });
});
