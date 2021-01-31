/**
 * CubicLine.js
 * 自定义立方 线数据
 * 
 * CCC 2021-1-23 22:24:02 创建
 */

const CubicNode = require("./CubicNode");

class CubicLine {
    _data = [];
    _root = null;
    _prefab = null;

    _face = null;
    _row = 0;
    nodes = {};

    constructor() {
        let root = arguments[0];
        let prefab = arguments[1];
        let data = arguments[2];
        let face = arguments[3];
        let row = arguments[4];

        this._root = root;
        this._prefab = prefab
        this._data = data;
        this._face = face;
        this._row = row;

        this.init();
    }

    init() {
        console.log('Cubic Line Init');

        for (let i = 0; i < this._data.length; i++) {
            const nodeData = this._data[i];
            this.initNode(nodeData, i);
        }
    }

    initNode(lindeData, col) {
        let node = this.newNode(lindeData, col);
        this.nodes[col] = node;
    }

    newNode(data, col) {
        return new CubicNode(this._root, this._prefab, data, this, col);
    }

    render() {
        for (let i in this.nodes) {
            let node = this.nodes[i];
            node.render();
        }
    }

    isEmpty() {

        return false
    }

    forEach(callback) { }

    get _cubic() {
        return this._face._cubic;
    }
    get(x) {
        let node = this.nodes[x];
        let obj = { active: false };
        if (node) {
            obj = node;
        }
        return obj;
    }
}
module.exports = CubicLine;