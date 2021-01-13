/**
 * GFQueue.js
 * 
 * CCC  2021-1-8 10:38:45   创建
 * 队列
 * 
 */

let GFQueue = cc.Class({
    extends: gf.Class,

    properties: {
        isEmpty: {
            get() {
                return !this._content || this._content.length === 0;
            },
        },
        head: {
            get() {
                return this._content[0];
            }
        },
        length: {
            get() {
                return this._content.length;
            },
        }
    },
    /**
     * 
     * @param {Number} size 最大长度
     */
    ctor() {
        let size = arguments[0];
        this._content = [];

        if (typeof size === 'number') {
            this._max = size;
        }
    },

    inqueue(element) {
        this._content.push(element);
        if (this.length > this._max) {
            return this.dequeue();
        }
    },

    dequeue() {
        return this._content.shift();
    },

    put(element) {
        return this.inqueue(element);
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

    forceGet(condition) {
        if (typeof condition === 'function') {
            for (let i = 0; i < this.length; ++i) {
                if (condition(this._content[i])) {
                    let result = this._content.splice(i, 1);
                    return result[0];
                }
            }
        }
    },

})

gf.Queue = module.exports = GFQueue;