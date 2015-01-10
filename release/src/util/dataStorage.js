/**
 * 包括对是否需要直接进入结果页、游戏结果、是否分享过数据的存储管理。
 * 具体操作为：存、取、监听变化（目前只对是否分享过做了初步的监听功能）
 * @author lvsheng
 * @date 2015/1/10
 */
define([], function () {
    return {
        setLastResult: function (gameName, result) {
            this._set("lastGameResult", { gameName: gameName, result: result });
        },
        /**
         * @returns {{gameName: string, result: {}} || null}
         */
        getLastResult: function () {
            return this._get("lastGameResult") || null;
        },

        markNeedJumpToResultPage: function (need) {
            this._set("needJumpToResultPage", need);
        },
        whetherNeedJumpToResultPage: function () {
            return this._get("needJumpToResultPage");
        },

        markHasShared: function () {
            this._set("hasShared", true);
            this._hasSharedCallback && this._hasSharedCallback();
        },
        whetherHasShared: function () {
            return this._get("hasShared");
        },
        /**
         * 当hasShared状态由false变为true时调用
         * 目前只允许有一个监听者
         * @param callback
         */
        listenShared: function (callback) {
            this._hasSharedCallback = callback;
        },
        unListenShared: function () {
            this._hasSharedCallback = null;
        },

        _cache: {},
        _set: function (key, value) {
            this._cache[key] = value;
            if ("JSON" in window && "localStorage" in window) {
                localStorage[key] = JSON.stringify(value);
            }
        },
        _get: function (key) {
            if ("JSON" in window && "localStorage" in window) {
                return localStorage[key] ? JSON.parse(localStorage[key]) : undefined;
            } else {
                return this._cache[key];
            }
        }
    };
});
