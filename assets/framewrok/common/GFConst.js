/**
 * GFConst.js
 * 
 * CCC  2021-1-8 10:01:07   创建
 * 框架常量
 * 
 */

let GFConst = cc.Class({
    extends: gf.Class,

    properties : {
        Version: '1.0.0',
        CubicNodeWidth: 0,
        CubicNodeHeight: 0,
    },
})

gf.Const = module.exports = new GFConst();