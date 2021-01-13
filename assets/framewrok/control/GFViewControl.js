var _openingViewReference = new gf.List();
let GFViewControl = cc.Class({
    extends: gf.Class,

    ctor() { },

    reset() {
        let list = _openingViewReference.clear();
        for (let i = 0; i < list.length; ++i) {
            list[i].destroy();
        }
    },

    open(viewStr, eZIndexType) {
        return new Promise((res, rej) => {
            if (typeof viewStr !== 'string') {
                cc.warn('@GFViewControl#open:ViewStr 不是字符串')
                rej();
            }
            function viewLoaded(node) {
                let canvas = cc.find('Canvas');
                node.parent = canvas;
                node.zIndex = eZIndexType;
                node.x = 0;
                node.y = 0;
                _openingViewReference.push(node);
                cc.log('---------------- open view :', viewStr);
                let comp = node.getComponent('BaseView');
                if (cc.isValid(comp)) {
                    comp._isOpen = true;
                    comp.playOpeningEffect();
                }
                res();
            }
            gf.Res.getViewCache(viewStr, viewLoaded);
        })
    },

    close(node) {
        if (node instanceof cc.Node) {
            _openingViewReference.delete(node);
            this._closeView(node);
        }

        if (typeof node === 'string') {
            let nodes = _openingViewReference.clear((node) => {
                return node.path === node;
            });
            for (let i = 0; i < nodes.length; ++i) {
                let temp = nodes[i];
                this._closeView(temp);
            }
        }
    },

    _closeView(node) {
        let comp = node.getComponent('BaseView');
        if (cc.isValid(comp) && comp._isOpen) {
            comp._isOpen = false;
            comp.playClosingEffect()
                .then(
                    () => {
                        gf.Res.storeViewCache(node);
                    }
                );
        }
    },
})
gf.View = module.exports = new GFViewControl();