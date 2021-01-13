/**
 * TestViewA.js
 *
 *  CCC  2021-1-8 16:49:56   创建
 *  测试视图A
 */

cc.Class({
    extends: gf.BaseView,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    onClickClose() {
        this.close();
        gf.View.open('TestViewB');

    },

    close() {
        this._super();
        console.log('close view : TestViewA')
        gf.View.close(this.node);
    },
    // update (dt) {},
});
