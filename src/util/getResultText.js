/**
 * @author lvsheng
 * @date 2015/1/9
 */
define([], function () {
    var generatorMap = {
        gather: function (result) {
        },
        hit: function (result) {
        },
        pipeline: function (result) {
        },
        bunt: function (result) {
        },
        find: function (result) {
        },
        avoid: function (result) {
        }
    };

    return function (gameName, result) {
        return generatorMap[gameName](result);
    };
});
