/**
 * MatchView.js
 * 
 * CCC  2021-1-13 11:16:43  创建
 * 匹配界面
 * 
 */

cc.Class({
    extends: gf.BaseView,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onEnable() {
    },


    onClickMatchGames() {
        gf.Online.matchPlayers(
            (event) => {
                console.log('匹配结果：', event);
                gf.View.open('RoomView').then(this.close.bind(this));
            }
        );
    },
    // update (dt) {},
});
