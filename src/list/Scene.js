/**
 * 单例
 * @author lvsheng
 * @date 2015/1/3
 */
define([
    '../gameUtil/resourceFileMap',
    '../gameUtil/resourceFileList',
    '../gameUtil/pauseGame',
    '../gameUtil/preload',

    './ListLayer',
    './BackgroundLayer',

    '../bunt/GameScene',
    '../avoid/GameScene',
    '../gather/GameScene',
    '../pipeline/gameScene/GameScene',
    '../hit/GameScene'
], function (resourceFileMap, resourceFileList, pauseGame, preload, ListLayer, BackgroundLayer, Bunt, Avoid, Gather, Pipeline, Hit) {
    var instance;
    var ListScene =  cc.Scene.extend({
        _curGame: {
            name: '',
            sceneClass: null,
            sceneInstance: null
        },

        _GAME_CLASS_MAP: {
            'bunt': Bunt,
            'avoid': Avoid,
            'gather': Gather,
            'pipeline': Pipeline,
            'hit': Hit
        },

        onEnter: function () {
            var self = this;
            self._super();

            self.addChild(new BackgroundLayer());
            self.addChild(new ListLayer(_.bind(self.enterAGame, self)));
        },

        //管理当前进行着的游戏的数据
        getCurGame: function () { return this._curGame; },

        enterAGame: function  (name) {
            var self = this;
            var SceneClass = self._GAME_CLASS_MAP[name];
            pauseGame.resumeGame(); //应对前面在结束上一个小游戏时的pause()

            preload(resourceFileList[name].concat(resourceFileList['common']), function () {
                self._curGame = { name: name, sceneClass: SceneClass, sceneInstance: new SceneClass() };
                cc.director.runScene(self._curGame.sceneInstance);
            }, cc.game);
        }
    });

    return { getInstance: function(){ return instance ? instance : (instance = new ListScene()); } };
});
