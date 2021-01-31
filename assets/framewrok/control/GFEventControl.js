/**
 * GFEventControl.js
 * 
 * CCC  2021-1-31 19:10:45  创建
 * 全局事件管理
 */
let GFEvent = cc.Class({
    extends: cc.EventTarget,

    on(type, callback, target) {
        this._super(type, callback, target);
    },

    emit(type, callback, target) {
        this._super(type, callback, target);
    },

    once(type, callback, target) {
        this._super(type, callback, target);
    },

    off(type, callback, target) {
        this._super(type, callback, target);
    },

});
gf.Event = module.exports = new GFEvent();