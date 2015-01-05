/**
 * @author lvsheng
 * @date 2015/1/3
 */
define([
    '../gameUtil/resourceFileMap'
], function (resourceFileMap) {
    return cc.Layer.extend({
        ctor: function(startCallback){
            this._super(); this.init();

            var buttonMenu = new cc.Menu(new cc.MenuItemSprite(
                new cc.Sprite(resourceFileMap.home.button),
                new cc.Sprite(resourceFileMap.home.button),
                null,
                function(){alert('hello')},
                null
            ));

            debugger;
            this.scheduleOnce(startCallback);

            this.addChild(this._board = new cc.Sprite(resourceFileMap.home.board));
            this.addChild(this._title = new cc.Sprite(resourceFileMap.home.title));
            this.addChild(this._leftPerson = new cc.Sprite(resourceFileMap.home.leftPerson));
            this.addChild(this._rightPerson = new cc.Sprite(resourceFileMap.home.rightPerson));
            this.addChild(this._ribbon = new cc.Sprite(resourceFileMap.home.ribbon));
            this.addChild(this._buttonMenu = buttonMenu);
            this.addChild(this._horn = new cc.Sprite(resourceFileMap.home.horn));
            this.addChild(this._pen = new cc.Sprite(resourceFileMap.home.pen));

            this._startAnimation();
        },
        _startAnimation: function () {
            var winSize = cc.director.getWinSize();
            var center = cc.p(winSize.width / 2, winSize.height / 2);
            var outerDistance = 500;
            var startPositionMap = {
                board: cc.p(center.x, winSize + outerDistance),
                title: cc.p(center.x, winSize + outerDistance),
                leftPerson: cc.p(-outerDistance, 640 - 212.5),
                rightPerson: cc.p(outerDistance, 640 - 212.5),
                ribbon: cc.p(center.x, -outerDistance),
                button: cc.p(center.x, -outerDistance)
            };
            var endPositionMap = {
                board: cc.p(center.x, 640 - 175.5),
                title: cc.p(center.x, 640 - 260.5),
                leftPerson: cc.p(center.x - (590 - 252), 640 - 212.5),
                rightPerson: cc.p(center.x + (913.5 - 590), 640 - 212.5),
                ribbon: cc.p(center.x, 640 - 333.5),
                button: cc.p(center.x, -outerDistance)
            };
            var hornPosition = cc.p(center.x - 165, 640 - 188);
            var penPosition = cc.p(center.x + 196.5, 640 - 172.5);


        }
    });
});
