/**
 * BaseView.js
 * 
 * CCC  2021-1-8 11:38:22   创建
 * 框架 视图基类
 * 
 */

let GFBaseView = cc.Class({
    extends: cc.Component,

    properties: {
        _isOpen: false,
    },

    ctor() {
        this
        this.node
    },
    onLoad() {
        this.node.on(gf.Enum.eSysEventType.VIEW_CLOSE, this.onSystemCloseView, this);
    },

    playOpeningEffect() {
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(1));
    },

    playClosingEffect() {
        return new Promise((res, rej) => {
            this.node.runAction(
                cc.sequence(
                    cc.fadeOut(1),
                    cc.callFunc(() => {
                        res();
                    })
                )
            );
        })
    },
    // update (dt) {},

    onSystemCloseView(event) {
        event.bubbles = false;
        this.close();
    },

    close() {
        console.log('------> base view closed:', this.node.name);
        gf.View.close(this.node);
    },
});
gf.BaseView = module.exports = GFBaseView;