cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        let delayTime = 2;
        if (!cc.sys.isNative) {
            delayTime = 0;
        }
        this.scheduleOnce(this.nextScene, delayTime);
    },

    nextScene: function () {
        cc.director.loadScene("UpdateScene");
    },
});
