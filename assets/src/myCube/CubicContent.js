/**
 * CubicContent.js
 * 
 * CCC  2021-1-31 18:02:27  创建
 * 立方节点，临时存放 消除栏
 */
class CubicContent {

    _content;

    constructor() {
        this._array = new gf.List();
        let node = arguments[0];
        this._content = node;

        if (!cc.isValid(node)) cc.warn("CubicContent parent is not a valid");
    }


    accept(CubicNode) {
        console.log(`CubicContent ${CubicNode}`)
        this._array.push(CubicNode);
        let length = this._array.length;
        let node = CubicNode._node;
        let content = this._content;
        let width = gf.Const.CubicNodeWidth;

        let originWorldSpace = node.convertToWorldSpaceAR(cc.v2());
        let resultNodeSpace = content.convertToNodeSpaceAR(originWorldSpace);
        let x = width * length - width / 2;
        let y = 0;
        node.position = resultNodeSpace;
        node.parent = content;
        node.runAction(
            cc.sequence(
                cc.moveTo(.2, x, y),
                cc.callFunc(()=>{
                    this.checkClear();
                    gf.Event.emit('animate_end');
                })
            )
        )
        CubicNode._picked = true;
    }

    render() {
        let width = gf.Const.CubicNodeWidth;
        let i = 1;
        
        this._array.foreach((CubicNode) => {
            let node = CubicNode._node;
            let x = width * i - width / 2;
            node.runAction(
                cc.moveTo(.2, x, 0)
            )
            ++i;
        })
    }

    clear() { }

    clearGroup(group) {
        for (let i = 0; i < group.length; i++) {
            let temp = group[i];
            temp._cleared = true;
            temp._node.active = false;
            // 计算分数
        }
        this.render();
    }

    checkClear() {
        let obj = {};
        this._array.foreach((element) => {
            let _data = element._data;
            if (obj[_data]) {
                obj[_data]++;
            } else {
                obj[_data] = 1;
            }
        })

        for (const i in obj) {
            if (Object.hasOwnProperty.call(obj, i)) {
                const element = obj[i];
                if (element === 3) {
                    let clearGroup = this._array.clear((CubicNode) => {
                        return CubicNode._data == i;
                    })
                    this.clearGroup(clearGroup)
                }
            }
        }
    }
}
module.exports = CubicContent;
