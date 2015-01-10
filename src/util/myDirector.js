/**
 * @author lvsheng
 * @date 2015/1/10
 */
define([
    '../util/pauseGame',
    '../util/preload',
    '../util/share',

    '../util/resourceFileList',

    '../home/HomeScene',
    '../list/Scene',

    '../commonClass/ResultScene',
    './dataStorage',

    '../games/bunt/GameScene',
    '../games/avoid/GameScene',
    '../games/gather/GameScene',
    '../games/pipeline/GameScene',
    '../games/hit/GameScene',
    '../games/find/GameScene'
], function (pauseGame, preload, share, resourceFileList, HomeScene, ListScene, ResultScene, dataStorage, Bunt, Avoid, Gather, Pipeline, Hit, Find) {
    return {
        _curGame: {
            name: '',
            sceneClass: null,
            sceneInstance: null
        },
        _curSceneType: '', //''|'home'|'list'|'game'|'result'

        _GAME_CLASS_MAP: {
            'bunt': Bunt,
            'avoid': Avoid,
            'gather': Gather,
            'pipeline': Pipeline,
            'hit': Hit,
            'find': Find
        },

        enterHome: function () {
            this._curSceneType = 'home';
            preload(resourceFileList['home'], function () {
                cc.director.runScene(new HomeScene());
            }, this);
        },
        enterList: function () {
            this._curSceneType = 'list';
            preload(resourceFileList['list'], function(){
                cc.director.runScene(new ListScene());
            });
        },
        enterAGame: function  (gameName) {
            this._curSceneType = 'game';
            var self = this;
            var SceneClass = self._GAME_CLASS_MAP[gameName];
            pauseGame.resumeGame(); //应对前面在结束上一个小游戏时的pause()

            preload(
                resourceFileList[gameName].concat(resourceFileList['common']).concat(resourceFileList[gameName + 'Background']),
                function () {
                    share.setShareResult("game", gameName);
                    self._curGame = { name: gameName, sceneClass: SceneClass, sceneInstance: new SceneClass() };
                    cc.director.runScene(self._curGame.sceneInstance);
                },
                cc.game
            );
        },
        enterResult: function (gameName, result) {
            this._curSceneType = 'result';
            preload(resourceFileList[gameName + 'Background'], function () {
                cc.director.runScene(new ResultScene(gameName, result));
            });
        },
        reloadCurrentScene: function () {
            switch (this._curSceneType) {
                case 'home':
                    this.enterHome();
                    break;
                case 'list':
                    this.enterList();
                    break;
                case 'game':
                    this.enterAGame(this.getCurGame().name);
                    break;
                case 'result':
                    this.enterResult(dataStorage.getLastResult().gameName, dataStorage.getLastResult().result); //认为前面进入结果页时一定已存入dataStorage
                    break;
                default :
                    break;
            }
        },

        //管理当前进行着的游戏的数据
        getCurGame: function () { return this._curGame; }
    };
});
