/**
 * SelectLevelView.js
 * 选择关卡界面
 * 
 * CCC  2021-1-16 23:32:03  创建
 * 
 */

cc.Class({
    extends: gf.BaseView,

    properties: {
        lbl_level: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let level = 2;
        this.lbl_level.string = level;
    },

    onClickStartLevel() {
        gf.View.open('GameMainView');
        this.close();
    },
});
