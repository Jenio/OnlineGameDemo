/**
 * GFEnum.js
 * 
 * CCC  2021-1-8 10:06:57   创建
 * 框架枚举类
 * 
 */

//----------------------------定义----------------------
// 节点zIndex 类型
let eZIndexType;
let eSysEventType;






//----------------------------实现----------------------
eZIndexType = cc.Enum({
    BACKGROUND: 100,
    SCENE: 200,
    FRONTGROUND: 300,
    VIEW: 400,
    FUNCTION: 500,
    DIALOG: 600,
    TIPS: 700,
    WAIT: 800,
    SYSTEM: 900,
})

eSysEventType = cc.Enum({
    VIEW_CLOSE: 'system_event_view_close'
})
let GFEnum = cc.Class({

    ctor() {
        this.eZIndexType = eZIndexType;
        this.eSysEventType = eSysEventType;
    },
})

gf.Enum = module.exports = new GFEnum();