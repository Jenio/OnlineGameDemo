/****************************************************************************
 
 ****************************************************************************/

 // window may be undefined when first load engine from editor
 var _global = typeof window === 'undefined' ? global : window;

 /**
  * 游戏框架的主要命名空间，框架代码中所有的类，函数，属性和常量都在这个命名空间中定义。
  */
 _global.gf = _global.gf || {};

 /**
  * 游戏框架接口数据空间命名定义。
  * @module IData
  * @main IData
  */
 _global.IData = _global.IData || {};