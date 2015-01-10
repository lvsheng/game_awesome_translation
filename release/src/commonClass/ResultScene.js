/**
 * @author lvsheng
 * @date 2015/1/10
 */
define([
    '../util/resourceFileMap',
    '../commonClass/ResultLayer',

    '../games/avoid/BackgroundLayer',
    '../games/bunt/BackgroundLayer',
    '../games/find/BackgroundLayer',
    '../games/gather/BackgroundLayer',
    '../games/hit/BackgroundLayer',
    '../games/pipeline/BackgroundLayer'
], function (resourceFileMap, ResultLayer, avoidBackgroundLayer, buntBackgroundLayer, findBackgroundLayer, gatherBackgroundLayer, hitBackgroundLayer, pipelineBackgroundLayer) {
    return cc.Scene.extend({
        ctor: function (gameName, result) {
            this._super();
            this._gameName = gameName;
            this._result = result;
        },
        onEnter: function () {
            var self = this;
            self._super();
            var gameName = this._gameName, result = this._result;

            var layerClassMap = {
                avoid: avoidBackgroundLayer,
                bunt: buntBackgroundLayer,
                find: findBackgroundLayer,
                gather: gatherBackgroundLayer,
                hit: hitBackgroundLayer,
                pipeline: pipelineBackgroundLayer
            };

            self.addChild(new layerClassMap[gameName]());
            self.addChild(new ResultLayer(gameName, result));
        }
    });
});
