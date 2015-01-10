/**
 * @author lvsheng
 * @date 2015/1/9
 */
define([], function () {
    /**
     * 判断当前是否在微信中
     */
    return function (){
        var ua = navigator.userAgent.toLowerCase();
        return ua.match(/MicroMessenger/i) == "micromessenger";
    }
});
