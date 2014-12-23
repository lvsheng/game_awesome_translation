/**
 * 单例对象
 * 对应整个游戏入口的home页
 * 列出各子游戏的入口
 * 并负责管理当前进行着的游戏的数据，包括其名字、场景类、场景实例
 * @author lvsheng
 * @date 2014/12/22
 */
define([
    './gameUtil/resourceFileList',
    './bunt/gameScene/GameScene'
], function (resourceFileList, GameScene) {
    var instance = null;
    var MainScene = cc.Scene.extend({
        _curGame: {
            name: '',
            sceneClass: null,
            sceneInstance: null
        },

        onEnter: function () {
            this._super();

            //TODO:展示所有游戏。根据选择进入相应游戏
            //这里先就进入bunt这个
            this.enterAGame('bunt', GameScene);
        },

        //管理当前进行着的游戏的数据
        getCurGame: function () { return this._curGame; },

        enterAGame: function  (name, SceneClass) {
            var self = this;
            cc.director.resume(); //应对前面在结束上一个小游戏时的pause()
            cc.LoaderScene.preload(resourceFileList[name], function () {
                self._curGame = { name: name, sceneClass: SceneClass, sceneInstance: new SceneClass() };
                cc.director.runScene(self._curGame.sceneInstance);
            }, cc.game);
        }
    });

    //本文件加载执行时cocos还没有完成初始化(cc.game.run还没被执行)，还不能直接实例场景对象，故不直接返回实例，而是提供个getInstance方法
    return { getInstance: function(){ return instance ? instance : (instance = new MainScene()); } };
});
