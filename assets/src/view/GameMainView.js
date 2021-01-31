const Cubic = require("../myCube/Cubic");
const CubicContent = require("../myCube/CubicContent");
/**
 * GameMainView.js
 * 选择关卡界面
 * 
 * CCC  2021-1-16 23:32:03  创建
 * 
 */

var _excuteStack = new gf.Stack();
cc.Class({
    extends: gf.BaseView,

    properties: {
        root: cc.Node,
        cubicNodePrefab: cc.Node,
        cubicContent: cc.Node,
        lbl_level_hint: cc.Node,
        lbl_level: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._super();
        this._hintOriginPositon = this.lbl_level_hint.position;
        this._hintOriginScale = this.lbl_level_hint.scale;

        this._lblOriginPosition = this.lbl_level.node.position;
        this._lblOriginScale = this.lbl_level.node.scale;

        gf.Event.on('pick_node', this.onNodePicked, this);
        gf.Event.on('animate_end', this.onAnimateEnd, this);
        this._cubic = new Cubic(this.root, this.cubicNodePrefab);
        this._cubicContent = new CubicContent(this.cubicContent);
        this.gameInit();

        gf.Const.CubicNodeWidth = this.cubicNodePrefab.width;
        gf.Const.CubicNodeHeight = this.cubicNodePrefab.height;
    },

    onEnable() {
        this.lbl_level.node.position = this._lblOriginPosition;
        this.lbl_level.node.scale = this._lblOriginScale;

        this.lbl_level_hint.position = this._hintOriginPositon;
        this.lbl_level_hint.scale = this._hintOriginScale;

    },

    gameInit() {
        let baseFaceData = [
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [15, 1, 1, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,],
            [1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 11,],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12,],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 13,],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11,],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12,],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 13,],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11,],
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12,],
            [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 13,],
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 14,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 15,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 15,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 14,],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14,],
        ]
        _excuteStack.clear();
        this._cubic.init(baseFaceData);
        this._cubic.render();


    },

    onNodePicked(CubicNode) {
        if (this._animationing) return;
        let operate = {
            tag: 'pick',
            position: CubicNode.position,
            data : CubicNode._data
        }
        _excuteStack.push(operate);
        console.log('onNodePicked')
        this._cubicContent.accept(CubicNode);
        this._animationing = true;
    },

    onAnimateEnd() {
        this._animationing = false;
        this._cubic.render();
    },

    cancelExcute() {

    },

    onDisable() {
        console.log('SelectLevelView onDisable');
        this.node.stopAllActions();
    },

});
