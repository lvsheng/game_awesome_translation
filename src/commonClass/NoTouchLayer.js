/**
 * 产生一个空的层来挡住用户的触摸事件
 * 用于暂停场景后阻止其触摸事件的响应（Cocos2d-x在pause之后触摸事件仍然有效）
 *
 * 本层里会响应触摸并吞噬触摸操作，使比它优先级低的层无法接收到触摸分发。但优先级低于MenuLayer(-128)
 *
 * @author lvsheng
 * @date 2014/12/22
 */
define([], function () {
    //TODO: 应注意将菜单层露在上面
});
