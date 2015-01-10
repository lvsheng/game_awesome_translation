/**
 * 暂停当前正在进行的游戏场景
 * @author lvsheng
 * @date 2014/12/22
 */
define([
    'require',
    '../util/myDirector'
], function (require) {
    return {
        pauseGame: function () {
            this._handleRecursively(require("../util/myDirector").getCurGame().sceneInstance, 'pause');

            //增加遮罩层以屏幕用户触摸事件
            //TODO
        },
        resumeGame: function () {
            this._handleRecursively(require("../util/myDirector").getCurGame().sceneInstance, 'resume');

            //增加遮罩层以屏幕用户触摸事件
            //TODO
        },
        _handleRecursively: function (node, type) {
            function handle (handleNode) {
                if (handleNode && !handleNode.isMenuLayer && !handleNode.isResultLayer) {
                    if (type === 'pause') {
                        handleNode.pause();
                    } else if (type === 'resume') {
                        handleNode.resume();
                    }
                    _.forEach(handleNode.children, handle);
                }
            }
            handle(node);
        }
    };
});
