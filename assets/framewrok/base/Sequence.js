/**
 * Sequence.js
 * 动作队列
 * 
 * CCC  2021-1-17 11:25:49  创建
 * 
 */
let GFSequence = cc.Class({
    
    extends: gf.Class,

    name : 'GFSequence',

    ctor() {
        let array = arguments[0];
        this._sequence = array || [];
    },

    /**
     * 添加队列信息
     * @param {Function} callback 回调函数
     * @param {Object} context 上下文
     */
    then(callback, context) {
        let a = callback;
        if (context) {
            a = callback.bind(context);
        }
        this._sequence.push(a);
        return this;
    },

    run() {
        this.resolve();
        return this;
    },

    stop() {
        this._sequence = [];
    },

    getCurrentTask() {
        return this._sequence.shift();
    },

    resolve() {
        let cur = this.getCurrentTask()
        if (typeof cur === 'function') {
            cur(this.resolve.bind(this));
        }
    }

});
gf.Seq = module.exports = GFSequence;