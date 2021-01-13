/**
 * BaseData.js
 * 
 * CCC  2021-1-13 15:44:47  创建
 * 框架 数据基础类
 * 
 */
let GFBaseData = cc.Class({

    extends: gf.Class,

    name: 'GFBaseData',

    ctor() {
        this._Data = {};
    },

    reset() {
        this._Data = {};
    },

    get(key) {
        if (typeof key !== 'string') return;
        var data = this._Data[key];
        return data;
    },

    set(key, value) {
        this._Data[key] = value;
    },
    // update (dt) {},
});
gf.BaseData = module.exports = GFBaseData;