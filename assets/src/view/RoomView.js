/**
 * RoomView.js
 * 
 * CCC  2021-1-13 14:29:51  创建
 * 房间界面
 * 
 */
cc.Class({
    extends: gf.BaseView,

    properties: {

    },

    // onLoad () {},

    start() {

    },

    onClickLeavRoom() {
        gf.Online.leaveRoom(
            (event) => {
                console.log('离开结果：', event);
                gf.View.open('MatchView').then(this.close.bind(this));
            }
        )
    },

    onClickRoomInfo() {
        gf.Online.getRoomInfo().then((data) => console.log(data));
    }
    // update (dt) {},
});
