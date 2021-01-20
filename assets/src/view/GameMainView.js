/**
 * SelectLevelView.js
 * 选择关卡界面
 * 
 * CCC  2021-1-16 23:32:03  创建
 * 
 */

cc.Class({
    extends: gf.BaseView,

    properties: {
        lbl_level_hint: cc.Node,
        lbl_level: cc.Label,

        Nodes: [cc.Node],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._hintOriginPositon = this.lbl_level_hint.position;
        this._hintOriginScale = this.lbl_level_hint.scale;

        this._lblOriginPosition = this.lbl_level.node.position;
        this._lblOriginScale = this.lbl_level.node.scale;
    },

    onEnable() {
        this.lbl_level.node.position = this._lblOriginPosition;
        this.lbl_level.node.scale = this._lblOriginScale;

        this.lbl_level_hint.position = this._lblOriginPosition;
        this.lbl_level_hint.scale = this._lblOriginScale;

        
    },

    onDisable() {
        console.log('SelectLevelView onDisable');
        this.node.stopAllActions();
    },

    seqTest() {
        let p = new Seq((res, rej) => {
            console.log('Seq init')
            setTimeout(() => {
                res('p result')
            }, 2);
        }, '动画1');
        let thenResult = p.then((e) => {
            console.log(e)
        })
        console.log(thenResult);
    },

    promiseTest() {
        let p = new Promise((res, rej) => {
            console.log('Seq init')
            setTimeout(() => {
                res('p result')
            }, 2000);
        }, '动画1');
        let thenResult = p.then((e) => {
            console.log('then1');
        }).then((e) => {
            console.log('then2');
        })
        console.log(thenResult);
    },

    sequenceTest() {


        let node = this.Nodes[4];
        let a = function (end) {
            node.runAction(
                cc.sequence(
                    cc.moveBy(1, 300, 0),
                    cc.callFunc(end)
                )
            )
        };
        new gf.Seq()
            .then(this.runNode0, this)
            .then(this.runNode1, this)
            .then(this.runNode2, this)
            .then(this.runNode3, this)
            .then(a)
            .run();
    },

    runNode0(res) {
        this.Nodes[0].runAction(
            cc.sequence(
                cc.moveBy(1, 200, 0),
                cc.callFunc(() => {
                    res();
                })
            )
        )
    },
    runNode1(res) {
        this.Nodes[1].runAction(
            cc.sequence(
                cc.moveBy(1, 200, 0),
                cc.callFunc(() => {
                    res();
                })
            )
        )
    },
    runNode2(res) {
        this.Nodes[2].runAction(
            cc.sequence(
                cc.moveBy(1, 200, 0),
                cc.callFunc(() => {
                    res();
                })
            )
        )
    },
    runNode3(res) {
        this.Nodes[3].runAction(
            cc.sequence(
                cc.moveBy(1, 200, 0),
                cc.callFunc(() => {
                    res();
                })
            )
        )
    },
});
