cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.scheduleOnce(this.nextScene, 2);
    },

    nextScene: function () {
        cc.director.loadScene("UpdateScene");
    },
});
