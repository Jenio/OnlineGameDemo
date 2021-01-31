/**
 * GFList.js
 * 
 * CCC  2021-1-8 14:35:46   创建
 * 框架列表
 * 
 */
let GFList = cc.Class({
    extends: gf.Class,

    properties: {
        length: {
            get() {
                return this._content.length;
            }
        },

    },

    ctor() {
        this._content = [];
    },

    push(element) {
        this._content.push(element);
    },

    pop() {
        return this._content.pop();
    },

    unshift(element) {
        this._content.unshift(element);
    },

    shift() {
        return this._content.shift();
    },

    delete(element) {
        let index = this._content.indexOf(element);

        if (index > -1) {
            return this._content.splice(index, 1);
        }
    },

    clear(condition) {
        let remove = [];
        if (typeof condition === 'function') {
            for (let i = 0; i < this.length;) {
                if (condition(this._content[i])) {
                    let item = this._content.splice(i, 1);
                    remove = remove.concat(item);
                } else {
                    ++i;
                }
            }
        } else {
            remove = this._content;
            this._content = [];
        }
        return remove;
    },

    foreach(callback) {
        for (let i = 0; i < this._content.length; ++i) {
            let temp = this._content[i];
            callback(temp);
        }
    }
});
gf.List = module.exports = GFList;