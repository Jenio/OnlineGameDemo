/**
 * DataUser.js
 * 
 * CCC  2021-1-13 15:51:40  创建
 * 用户数据
 * 
 */

let DataUser = cc.Class({

    extends: gf.BaseData,

    getUserId() {
        this.get('user_id');
    },

    setUserId(value) {
        this.set('user_id', value);
    }
    // update (dt) {},
});
IData.User = new DataUser();