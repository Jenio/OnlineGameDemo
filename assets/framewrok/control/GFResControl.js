/**
 * GFResControl.js
 * 
 * CCC  2021-1-8 16:00:34   创建
 * 框架 资源管理
 * 
 */

// 最近关闭的窗口
let _arrRecentClosedViews = new gf.Queue(10);
// 视图预制体缓存
let _arrViewPrefabsCache = {};
let GFResControl = cc.Class({

    extends: gf.Class,

    ctor() {

    },

    reset() {
        let list = _openingViewReference.clear();
        for (let i = 0; i < list.length; ++i) {
            list[i].destroy();
        }
    },

    preloadViewPrefab(callback, context) {
        cc.loader.loadResDir('view', cc.Prefab, (err, res) => {
            if (err) {
                cc.error(err);
                return;
            }

            for (let i = 0; i < res.length; ++i) {
                let prefab = res[i];
                _arrViewPrefabsCache[prefab.name] = prefab;
            }

            callback.apply(context);
        })
    },

    /**
     * 获取视图资源
     * @param {String} pathStr 视图路径
     * @param {Function} callback 回调方法
     */
    getViewCache(pathStr, callback) {
        let node = _arrRecentClosedViews.forceGet((node) => {
            return node.path === pathStr;
        });

        if (cc.isValid(node)) {
            // node.active = true;
            callback(node);
            return;
        }

        let prefab = _arrViewPrefabsCache[pathStr];
        if (cc.isValid(prefab) && prefab instanceof cc.Prefab) {
            let newNode = cc.instantiate(prefab);
            newNode.path = pathStr;
            callback(newNode);
            return;
        }

        cc.loader.loadRes(pathStr, cc.Prefab, (err, res) => {
            if (err) {
                cc.error(err);
                return;
            }
            let newNode = cc.instantiate(res);
            newNode.path = pathStr;
            callback(newNode);
            return;
        })

    },

    /**
     * 缓存视图节点
     * @param {cc.Node} node 视图节点
     */
    storeViewCache(node) {
        if (node instanceof cc.Node) {
            this._storeNode(node);
        }
        if (node instanceof Array) {
            for (let i = 0; i < node.length; ++i) {
                let temp = node[i];
                if (temp instanceof cc.Node) {
                    this._storeNode(temp);
                }
            }
        }
    },
    /**
     * 缓存视图节点 - 私有
     * @param {cc.Node} node 视图节点
     */
    _storeNode(node) {
        if (!node instanceof cc.Node) return;
        node.parent = null;
        let needClear = _arrRecentClosedViews.put(node);
        if (cc.isValid(needClear)) {
            needClear.destroy();
        }

    },
})

gf.Res = module.exports = new GFResControl();