/**
 * CubicFace.js
 * 自定义 立方 面 数据
 * 
 * CCC  2021-1-23 22:24:47  创建
 * 
 */

const CubicLine = require("./CubicLine");

class CubicFace {
    _data = [];
    _root = null;
    _prefab = null;

    _cubic = null;
    _layer = 0;
    lines = {};
    constructor() {
        let root = arguments[0];
        let prefab = arguments[1];
        let data = arguments[2];
        let cubic = arguments[3];
        let layer = arguments[4];

        this._root = root;
        this._prefab = prefab
        this._data = data;
        this._cubic = cubic;
        this._layer = layer;

        this.init();
    }

    init() {
        for (let i = 0; i < this._data.length; ++i) {
            let lineData = this._data[i];
            this.initLine(lineData, i);
        }
    }

    initLine(lindeData, row) {
        let line = this.newLine(lindeData, row);
        this.lines[row] = line;
    }

    newLine(data, row) {
        return new CubicLine(this._root, this._prefab, data, this, row);
    }

    render() {
        for (let i in this.lines) {
            let line = this.lines[i];
            line.render();
        }
    }
    isEmpty() { }
    forEach(callback) {

    }

    get(x, y) {
        let line = this.lines[y];
        let obj = { active: false };
        if (line) {
            obj = line.get(x);
        }
        return obj;
    }

}
module.exports = CubicFace;