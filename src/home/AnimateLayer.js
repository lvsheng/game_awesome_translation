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
                startCallback,
                null
            ));

            var elementMap = this._animateElementMap = {};
            this.addChild(elementMap['board'] = new cc.Sprite(resourceFileMap.home.board));
            this.addChild(elementMap['title'] = new cc.Sprite(resourceFileMap.home.title));
            this.addChild(elementMap['leftPerson'] = new cc.Sprite(resourceFileMap.home.leftPerson));
            this.addChild(elementMap['rightPerson'] = new cc.Sprite(resourceFileMap.home.rightPerson));
            this.addChild(elementMap['ribbon'] = new cc.Sprite(resourceFileMap.home.ribbon));
            this.addChild(elementMap['button'] = buttonMenu);
            this.addChild(elementMap['horn'] = new cc.Sprite(resourceFileMap.home.horn));
            this.addChild(elementMap['pen'] = new cc.Sprite(resourceFileMap.home.pen));

            this._startAnimation();
        },
        _startAnimation: function () {
            var winSize = cc.director.getWinSize();
            var center = cc.p(winSize.width / 2, winSize.height / 2);
            var outerDistance = 500;
            var elementMap = this._animateElementMap;
            var startPositionMap = {
                board: cc.p(center.x, winSize.height + outerDistance),
                title: cc.p(center.x, winSize.height + outerDistance),
                leftPerson: cc.p(-outerDistance, 640 - 212.5),
                rightPerson: cc.p(winSize.width + outerDistance, 640 - 212.5),
                ribbon: cc.p(center.x, -outerDistance),
                button: cc.p(center.x, -outerDistance)
            };
            var endPositionMap = {
                board: cc.p(center.x, 640 - 175.5),
                title: cc.p(center.x, 640 - 260.5),
                leftPerson: cc.p(center.x - (590 - 252), 640 - 212.5),
                rightPerson: cc.p(center.x + (913.5 - 590), 640 - 212.5),
                ribbon: cc.p(center.x, 640 - 333.5),
                button: cc.p(center.x, 640 - 432.5)
            };
            var hornPosition = cc.p(center.x - 165, 640 - 188);
            var penPosition = cc.p(center.x + 196.5, 640 - 172.5);

            //起始位置
            for (var key in startPositionMap) {
                elementMap[key].setPosition(startPositionMap[key]);
            }
            elementMap.horn.setPosition(hornPosition);
            elementMap.horn.setVisible(false);
            elementMap.pen.setPosition(penPosition);
            elementMap.pen.setVisible(false);

            var time = 0.4;
            //TODO: 加延时、回调（里加比如展示喇叭等）、ease参数
            var keys = [
                "board",
                "title",
                "leftPerson",
                "rightPerson",
                "ribbon",
                "button"
            ];
            function moveInNextElement () {
                //var ease = cc.easeElasticOut(.6);
                var ease = cc.easeIn(2);
                var key = keys.shift();
                if (!key) { return }
                var el = elementMap[key];
                el.runAction(new cc.Sequence(
                    (new cc.MoveTo(time, endPositionMap[key])).easing(ease),
                    //(new cc.MoveTo(time, endPositionMap[key])),
                    new cc.CallFunc(moveInNextElement)
                ))
            }
            moveInNextElement();
        }
    });
});
