/**
 * TestViewB.js
 *
 *  CCC  2021-1-8 16:49:56   创建
 *  测试视图A
 */

cc.Class({
    extends: gf.BaseView,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    playOpeningEffect() {
        this.node.x = 100;
        this.node.stopAllActions();
        this.node.runAction(
            cc.moveTo(1, 0, this.node.y)
        )
    },

    start() {
    },

    // update (dt) {},
});
