/**
 * @author lvsheng
 * @date 2015/1/3
 */
define([
    '../util/resourceFileMap'
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
            buttonMenu.height = 107; //cc.Menu的高度默认为占满整个屏幕的高，这里强制改为按钮的高

            var elementMap = this._animateElementMap = {};
            this.addChild(elementMap['board'] = new cc.Sprite(resourceFileMap.home.board), 1);
            this.addChild(elementMap['title'] = new cc.Sprite(resourceFileMap.home.title), 5);
            this.addChild(elementMap['leftPerson'] = new cc.Sprite(resourceFileMap.home.leftPerson), 6);
            this.addChild(elementMap['rightPerson'] = new cc.Sprite(resourceFileMap.home.rightPerson), 2);
            this.addChild(elementMap['ribbon'] = new cc.Sprite(resourceFileMap.home.ribbon), 4);
            this.addChild(elementMap['button'] = buttonMenu, 7);
            this.addChild(elementMap['horn'] = new cc.Sprite(resourceFileMap.home.horn), 3);
            this.addChild(elementMap['pen'] = new cc.Sprite(resourceFileMap.home.pen), 3);

            this._startAnimation();

            //TODO: for test
            startCallback();
        },
        _startAnimation: function () {
            var layer = this;
            var winSize = cc.director.getWinSize();
            var center = cc.p(winSize.width / 2, winSize.height / 2);
            var outerDistance = 500;
            var elementMap = this._animateElementMap;
            var startPositionMap = {
                board: cc.p(center.x, winSize.height + elementMap.board.height * elementMap.board.anchorY),
                title: cc.p(center.x, winSize.height + elementMap.title.height * elementMap.title.anchorY),
                leftPerson: cc.p(-outerDistance, 640 - 212.5),
                rightPerson: cc.p(winSize.width + outerDistance, 640 - 212.5),
                ribbon: cc.p(center.x, -outerDistance),
                button: cc.p(center.x, -elementMap.button.height / 2)
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
            elementMap.horn.setOpacity(0);
            elementMap.pen.setPosition(penPosition);
            elementMap.pen.setOpacity(0);

            var keys = [
                "board",
                "title",
                "leftPerson",
                "rightPerson",
                "ribbon",
                "button"
            ];
            var actionFuncMap = {};
            actionFuncMap.board = function(){
                var time = 0.2;
                elementMap.board.runAction(new cc.Spawn(
                    (new cc.MoveTo(time, endPositionMap.board)).easing(cc.easeIn(7)),
                    new cc.CallFunc(actionFuncMap[keys.shift()])
                ))
            };
            //快、节奏
            actionFuncMap.title = function(){
                elementMap.title.runAction(new cc.Sequence(
                    (new cc.MoveTo(0.5, endPositionMap.title)).easing(cc.easeIn(6)),
                    new cc.CallFunc(actionFuncMap[keys.shift()])
                ));
            };
            actionFuncMap.leftPerson = function(){
                elementMap.leftPerson.runAction(new cc.Sequence(
                    (new cc.MoveTo(0.3, endPositionMap.leftPerson)).easing(cc.easeOut(10)),
                    new cc.CallFunc(actionFuncMap[keys.shift()])
                ));
            };
            actionFuncMap.rightPerson = function(){
                elementMap.rightPerson.runAction(new cc.Sequence(
                    (new cc.MoveTo(0.3, endPositionMap.rightPerson)).easing(cc.easeOut(10)),
                    new cc.CallFunc(actionFuncMap[keys.shift()])
                ));
            };
            actionFuncMap.ribbon = function(){
                var time = 0.5;
                var showDecorationAction = new cc.FadeIn(time);
                elementMap.ribbon.runAction(new cc.Sequence(
                    (new cc.MoveTo(0.3, endPositionMap.ribbon)).easing(cc.easeIn(15)).easing(cc.easeElasticOut(0.8)),
                    //new cc.Spawn(
                    new cc.CallFunc(function(){
                        elementMap.horn.runAction(showDecorationAction.clone());
                        elementMap.pen.runAction(showDecorationAction.clone());
                    }),
                    new cc.DelayTime(time),
                    new cc.CallFunc(actionFuncMap[keys.shift()])
                    //)
                ));
            };
            actionFuncMap.button = function(){
                var button = elementMap.button;
                button.setPosition(center.x, winSize.height + button.height / 2);
                button.runAction(new cc.Sequence(
                    (new cc.MoveTo(0.3, center.x, button.height / 2)).easing(cc.easeQuadraticActionOut(10)),
                    (new cc.MoveTo(0.05, endPositionMap.button)).easing(cc.easeQuadraticActionIn(10)).easing(cc.easeIn(15)),
                    new cc.Spawn(
                        //new cc.CallFunc(function (){
                        //    button.runAction(new cc.Sequence(
                        //        new cc.TintTo(0.5, 255, 200, 200),
                        //        new cc.TintTo(0.5, 255, 255, 255)
                        //    ))
                        //}),
                        new cc.CallFunc(function(){
                            var distance = 30;
                            layer.runAction(new cc.Sequence(
                                new cc.MoveBy(0.05, 0, distance),
                                (new cc.MoveBy(1, 0, -distance)).easing(cc.easeElasticOut(0.1)),
                                new cc.CallFunc(function(){
                                    layer.bake();
                                })
                            ));
                        })
                    )
                ));
            };

            actionFuncMap[keys.shift()]();
        }
    });
});
