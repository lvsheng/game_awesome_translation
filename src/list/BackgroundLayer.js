define([
    '../util/resourceFileMap'
], function (resourceFileMap) {
    return cc.Layer.extend({
        ctor: function () {
            this._super();
            this.init();

            this._backgroundSprite = new cc.Sprite(resourceFileMap.list.bg);
            var winSize = cc.director.getWinSize();
            this._backgroundSprite.attr({ anchorX: 0.5, anchorY: 1, x: winSize.width / 2, y: winSize.height });

            this._scaleToFillWindow(this._backgroundSprite);
            this.addChild(this._backgroundSprite);

            var listBg = new cc.Sprite(resourceFileMap.list.listBg);
            listBg.attr({anchorX: 1, anchorY: 0, x: winSize.width, y: 0});
            this.addChild(listBg);

            var logo = new cc.Sprite(resourceFileMap.list.logo);
            logo.attr({anchorX: 0, anchorY: 1, x: 0, y: winSize.height});
            this.addChild(logo);

            var person = new cc.Sprite(resourceFileMap.list.person);
            person.attr({anchorX: 0, anchorY: 0, x: 0, y: 0});
            this.addChild(person);


            var listContainer = new cc.Sprite(resourceFileMap.list.listContainer);
            listContainer.attr({anchorX: 1, anchorY: 1, x: winSize.width, y: winSize.height});
            this.addChild(listContainer);

            this.bake();
        },

        _scaleToFillWindow: function (sprite) {
            sprite.scaleX = cc.director.getWinSize().width / sprite.width;
            sprite.scaleY = cc.director.getWinSize().height / sprite.height;
        }
    });
});
