const CubicFace = require("./CubicFace");

/**
 * Cubic.js
 * 自定义 立方数据
 * 
 * CCC  2021-1-23 22:22:06  创建
 * 
 */
class Cubic {

    _data = [];
    _root = null;
    _prefab = null;

    

    _inited = false;
    faces = {};
    constructor() {
        let root = arguments[0];
        let prefab = arguments[1];
        let data = arguments[2];

        this._root = root;
        this._prefab = prefab
        if (data) {
            this._data = data;
            this._inited = true;
            this.initWithBaseFace(data);
        }
    }

    init(data) {
        this._data = data;
        this._inited = true;
        this.initWithBaseFace(data);
    }

    initWithBaseFace(data) {
        // 生成面数据，并初始化
        this.initFace(data, 0);
    }

    initFace(faceData, layer) {
        let face = this.newFace(faceData, layer);
        this.faces[layer] = face;
    }

    newFace(data, layer) {
        return new CubicFace(this._root, this._prefab, data, this, layer);
    }

    render() {
        for (let i in this.faces) {
            let face = this.faces[i];
            face.render();
        }
    }

    isEmpty() {
        // return this._data.length === 0;
        return false;
    }

    forEach(callback) {

    }

    get(x, y, z) {
        let face = this.faces[z];
        let obj = { active: false };
        if (face) {
            obj = face.get(x, y);
        }
        return obj;
    }
}
module.exports = Cubic;