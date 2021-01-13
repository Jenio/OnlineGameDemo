/**
 * Close.js
 * 
 * CCC  2021-1-8 16:51:28   创建
 * 关闭脚本
 */
cc.Class({
    extends: cc.Component,
    
    onLoad () {
        this.node.on('touchend', this.onClick, this);
    },

    onClick() {
        let event = new cc.Event(gf.Enum.eSysEventType, true);
        this.node.dispatchEvent(event);
    },
    // update (dt) {},
});
