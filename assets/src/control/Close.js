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

    onClick(e) {
        let event = new cc.Event.EventCustom(gf.Enum.eSysEventType.VIEW_CLOSE, true);
        this.node.dispatchEvent(event);
    },
    // update (dt) {},
});
