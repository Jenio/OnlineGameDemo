/**
 * LoadingView.js
 * 
 * CCC  2021-1-12 17:42:25  创建
 * 预加载界面
 */
cc.Class({
    extends: gf.BaseView,

    properties: {
        progressBar: cc.ProgressBar,

        _loaded: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var url = window.location.href;
        var loc = url.substring(url.lastIndexOf('?') + 1, url.length);
        console.log("url=" + url + ",loc=" + loc);
        IData.User.setUserId(loc);

        this._total = 1;
        gf.Res.preloadViewPrefab(this.resourcesLoaded, this);
    },

    resourcesLoaded() {
        this._loaded++;

        if (this._loaded === this._total) {
            this.roomInit();
        }
    },


    roomInit() {
        gf.Online.init(
            () => {
                console.log('user in room', this);
                gf.View.open('RoomView').then(this.close.bind(this));
            },
            () => {
                console.log('user in lobby', this);
                gf.View.open('MatchView').then(this.close.bind(this));
            }
        );
    },

    start() {

    },

    // update (dt) {},
});
