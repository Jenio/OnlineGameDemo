/**
 * CubicNode.js
 * 自定义 立方 节点
 * 
 * CCC 2021-1-23 22:23:19   创建
 * 
 */
class CubicNode {
    _data = [];
    _root = null;
    _prefab = null;

    _node = null;
    _line = null;
    _col = 0;

    _picked = false;
    _cleared = false;

    constructor() {
        let root = arguments[0];
        let prefab = arguments[1];
        let data = arguments[2];
        let line = arguments[3];
        let col = arguments[4];

        this._root = root;
        this._prefab = prefab
        this._data = data;
        this._line = line;
        this._col = col;

        this.init();
    }

    get _cubic() {
        return this._line._face._cubic;
    }

    get x() {
        return this._col;
    }
    get y() {
        return this._line._row;
    }

    get z() {
        return this._line._face._layer;
    }

    get position() {
        let x = this.x;
        let y = this.y;
        let z = this.z;
        return { x, y, z };
    }

    get top() {
        return this._cubic.get(this.x, this.y - 1, this.z);
    }

    get topLeft() {
        return this._cubic.get(this.x - 1, this.y - 1, this.z);
    }

    get topRight() {
        return this._cubic.get(this.x + 1, this.y, this.z);
    }

    get bottom() {
        return this._cubic.get(this.x, this.y + 1, this.z);
    }

    get BottomLeft() {
        return this._cubic.get(this.x - 1, this.y, this.z);
    }

    get BottomRight() {
        return this._cubic.get(this.x + 1, this.y + 1, this.z);

    }

    get upLeft() {
        return this._cubic.get(this.x - 1, this.y - 1, this.z + 1);
    }

    get upTopRight() {
        return this._cubic.get(this.x, this.y - 1, this.z + 1);
    }

    get upBottomRight() {
        return this._cubic.get(this.x, this.y, this.z + 1);
    }

    get downRight() {
        return this._cubic.get(this.x + 1, this.y + 1, this.z - 1);

    }

    get downTopLeft() {
        return this._cubic.get(this.x, this.y, this.z - 1);

    }

    get downBottomLeft() {
        return this._cubic.get(this.x, this.y + 1, this.z - 1);

    }

    get active() {
        return !!this._data && !this._picked && !this._cleared;
    }

    get valid() {
        let noUp = !this.upBottomRight.active && !this.upLeft.active && !this.upTopRight.active;
        let noLeft = !this.topLeft.active && !this.BottomLeft.active;
        let noRight = !this.topRight.active && !this.BottomRight.active;
        return noUp && (noLeft || noRight);
    }

    render() {
        console.log('Cubic Node Render');
        let node = this._node;
        if (this._data) {
            if (!this._cleared && !this._picked) {

                if (!cc.isValid(node)) {
                    node = cc.instantiate(this._prefab);
                    this._node = node;
                    node.parent = this._root;
                    node.active = true;
                    node.on('touchend', this.touchEnd, this);
                }
                let width = node.width;
                let height = node.height;

                if (this._picked) {
                    node.zIndex = cc.macro.MAX_ZINDEX;
                } else {
                    node.x = this.x * width - width / 2;
                    node.y = - this.y * height + height / 2 + this.x * height / 2;
                    node.zIndex = this.x + this.y + this.z;
                }

                let bg = node.getChildByName('bg');
                let lbl_num = node.getChildByName('num').getComponent(cc.Label);

                lbl_num.string = this._data;
                if (this.valid) {
                    bg.color = new cc.Color(255, 25 * this.y, 25 * this.y);
                } else {
                    bg.color = cc.Color.GRAY;
                }
            }
        }
    }

    picked() {
        this._picked = true;
        return this._node;
    }

    touchEnd(e) {
        if (this._cleared || this._picked) return;
        if (!this.valid) return;
        console.log(e, this.valid);
        gf.Event.emit('pick_node', this);

    }

    init(data) { }

    isEmpty() { }

}

module.exports = CubicNode;