/**
 * GFStack.js
 * 
 * CCC  2021-1-8 11:40:58   创建
 * 堆栈
 * 
 */
let GFStack = cc.Class({
    extends: cc.Component,

    properties: {
        isEmpty: {
            get() {
                return !this._content || this._content.length === 0;
            },
        },
        peak: {
            get() {
                return this._content.length <= 0 ? null : this._content[this._content.length - 1];
            }
        }
    },

    ctor() {
        this._content = [];
    },

    push(element) {
        this._content.push(element);
    },

    pop() {
        this._content.pop();
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
});
gf.Stack = module.exports = GFStack;