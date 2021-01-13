/**
 * GFAdvertControl.js
 * CCC  2020-12-14 14:55:37
 * 广告控制器
 */
require("../AnyThinkAds/ATJSSDK");
require("../AnyThinkAds/ATRewardedVideoJSSDK");

// 聚合平台 APP KEY
const APP_KEY = "198638921a50750ba17a7e3449d40099";
// 聚合广告 平行人生 APP ID
const APP_ID = "a5fd6fce55c62a";
// // 测试id
// const APP_ID = "a5aa1f9deda26d";
// const APP_KEY = "4f7b9ac17decb9babec83aac078742c7";

var customMap = {
    "appCustomKey1": "appCustomValue1",
    "appCustomKey2": "appCustomValue2"
};
// 聚合 广告位ID
var customPlacementId = "";
if (cc.sys.os === cc.sys.OS_IOS) {
    customPlacementId = "b5b72b21184aa8";
} else if (cc.sys.os === cc.sys.OS_ANDROID) {
    customPlacementId = "b5fd6fd2554f7c";
    // // 测试id
    // customPlacementId = "b5b728e7a08cd4";

}
var placementCustomMap = {
    "placementCustomKey1": "placementCustomValue1",
    "placementCustomKey2": "placementCustomValue2"
};


const eAdSceneId = cc.Enum({
    PARTY_INVITE: 'f5fd81bf9b9060',         // 派对 获得邀请函
    PARTY_REFLOP: 'f5fd827a681efe',         // 派对 重新翻牌
    BAR_USE_DRUG: 'f5fd83185b42f8',         // 酒吧 醒酒药
    BAR_FREE_WINE: 'f5fd8532b0508d',        // 酒吧 免费酒水
    STOCK_RISE: 'f5fd8538ba0d77',           // 股市 股神指路
    CAR_SHOW_EXTENSION: 'f5fd85c4f17b92',   // 豪车秀 推广
    REBORNN_ENV: 'f5fd85cd319d40',          // 重生 选择家境
    HOSPITAL_HEALTHCARE: 'f5fd860112a704',  // 医院_免费保健
    HOSPITAL_MEDICALCARE: 'f5fd8603c331cc', // 医院_免费医疗
    ITEM_ADD_ENERGY: 'f5fd869daa6bad',      // 道具 增加精力
    BAR_DOUBLE_SALARY: 'f5fe148bc1e442',    // 酒吧 双倍工资
    WORK_DOUBLE_BONUS: 'f5fe14bb56a608',    // 工作 双倍分红
    STOCK_REFRESH_LIST: 'f5fe954d071dbb',   // 股市 列表刷新
    RELATION_GIFT: 'f5fed336e08620',        // 关系 刷新赠送次数
})
gf.eAdSceneId = eAdSceneId;

const ServerAdSceneIdMap = cc.Enum({
    'f5fd81bf9b9060': 1,        // 派对 获得邀请函
    'f5fd827a681efe': 2,        // 派对 重新翻牌
    'f5fd83185b42f8': 3,        // 酒吧 醒酒药
    'f5fd8532b0508d': 4,        // 酒吧 免费酒水
    'f5fd8538ba0d77': 5,        // 股市 股神指路
    'f5fd85c4f17b92': 6,        // 豪车秀 推广
    'f5fd85cd319d40': 7,        // 重生 选择家境
    'f5fd860112a704': 8,        // 医院_免费保健
    'f5fd8603c331cc': 9,        // 医院_免费医疗
    'f5fd869daa6bad': 10,       // 道具 增加精力
    'f5fe148bc1e442': 11,       // 酒吧 双倍工资
    'f5fe14bb56a608': 12,       // 工作 双倍分红
    'f5fe954d071dbb': 13,       // 股市 列表刷新
    'f5fed336e08620': 14,       // 关系 刷新赠送次数


})

/**
* @namespace gf
*/
var GFAdvertControl = cc.Class({
    extends: cc.Component,

    ctor() {
        //打开SDK的Debug log，强烈建议在测试阶段打开，方便排查问题
        ATJSSDK.setLogDebug(true);
        //设置自定义的Map信息，可匹配后台配置的广告商顺序的列表（App纬度）（可选配置）
        ATJSSDK.initCustomMap(customMap);
        //设置自定义的Map信息，可匹配后台配置的广告商顺序的列表（Placement纬度）（可选配置）
        ATJSSDK.setPlacementCustomMap(customPlacementId, placementCustomMap);
        // 获取GDPR等级
        var GDPRLevel = ATJSSDK.getGDPRLevel();
        // 初始化SDK
        ATJSSDK.initSDK(APP_ID, APP_KEY);
        // 针对欧盟地区初始化时做的处理
        ATJSSDK.getUserLocation(function (userLocation) {
            //如果处于欧盟地区且等级是UNKNOW时，就执行授权弹窗
            if (userLocation === ATJSSDK.kATUserLocationInEU) {
                if (ATJSSDK.getGDPRLevel() === ATJSSDK.UNKNOWN) {
                    ATJSSDK.showGDPRAuth();
                }
            }
        });


        ATRewardedVideoJSSDK.setAdListener(this);
        this.loadRewardedVideo();
    },

    placementID: function () {
        return customPlacementId;
    },

    loadRewardedVideo() {
        var setting = {};
        //如果需要通过开发者的服务器进行奖励的下发（部分广告平台支持服务器激励），则需要传递下面两个key
        //ATRewardedVideoJSSDK.userIdKey必传，用于标识每个用户;ATRewardedVideoJSSDK.userDataKey为可选参数，传入后将透传到开发者的服务器
        setting[ATRewardedVideoJSSDK.userIdKey] = "test_user_id";
        setting[ATRewardedVideoJSSDK.userDataKey] = "test_user_data";
        ATRewardedVideoJSSDK.loadRewardedVideo(this.placementID(), setting);
    },

    hasRewardedVideoReady() {
        return ATRewardedVideoJSSDK.hasAdReady(this.placementID());
    },

    checkRewardedVideoStatus() {
        return ATRewardedVideoJSSDK.checkAdStatus(this.placementID());
    },

    showRewardedVideo(callback, adSceneId) {
        // 后台统计 开始看广告
        let sceneId = ServerAdSceneIdMap[adSceneId];
        gf.DataGame.requestWatchAds(0, sceneId);
        this._callback = callback;
        this._adSceneId = sceneId;
        if (cc.sys.isNative) {
            if (this.hasRewardedVideoReady()) {
                ATRewardedVideoJSSDK.showAdInScenario(this.placementID(), adSceneId);
            } else {
                gf.View.showTips('当前暂无广告，请稍后再试！');
                this.loadRewardedVideo();
            }
        } else {
            // 非原生  直接奖励
            this.rewardCallback();
            // if (typeof callback === 'function') {
            //     callback();
            // }
            // // 后台统计 看完广告 args1:1
            // gf.DataGame.requestWatchAds(1, sceneId);
        }
    },


    //Callbacks
    onRewardedVideoAdLoaded: function (placementId) {
        ATJSSDK.printLog("AnyThinkRewardedVideoDemo::onRewardedVideoAdLoaded(" + placementId + ")");
    },

    onRewardedVideoAdFailed: function (placementId, errorInfo) {
        ATJSSDK.printLog("AnyThinkRewardedVideoDemo::onRewardedVideoAdFailed(" + placementId + ", " + errorInfo + ")");
    },

    onRewardedVideoAdPlayStart: function (placementId, callbackInfo) {
        ATJSSDK.printLog("AnyThinkRewardedVideoDemo::onRewardedVideoAdPlayStart(" + placementId + ", " + callbackInfo + ")");
    },

    onRewardedVideoAdPlayEnd: function (placementId, callbackInfo) {
        ATJSSDK.printLog("AnyThinkRewardedVideoDemo::onRewardedVideoAdPlayEnd(" + placementId + ", " + callbackInfo + ")");
    },

    onRewardedVideoAdPlayFailed: function (placementId, errorInfo, callbackInfo) {
        ATJSSDK.printLog("AnyThinkRewardedVideoDemo::onRewardedVideoAdPlayFailed(" + placementId + ", " + errorInfo + ", " + callbackInfo + ")");
    },

    onRewardedVideoAdClosed: function (placementId, callbackInfo) {
        ATJSSDK.printLog("AnyThinkRewardedVideoDemo::onRewardedVideoAdClosed(" + placementId + ", " + callbackInfo + ")");
        this.loadRewardedVideo();
        this.rewardCallback();
    },

    onRewardedVideoAdPlayClicked: function (placementId, callbackInfo) {
        ATJSSDK.printLog("AnyThinkRewardedVideoDemo::onRewardedVideoAdPlayClicked(" + placementId + ", " + callbackInfo + ")");
    },

    onReward: function (placementId, callbackInfo) {
        ATJSSDK.printLog("AnyThinkRewardedVideoDemo::onReward(" + placementId + ", " + callbackInfo + ")");
        // 后台统计 看完广告 args1:1
        gf.DataGame.requestWatchAds(1, this._adSceneId);
    },

    rewardCallback: function () {
        if (typeof this._callback === 'function') {
            this._callback();
            this._callback = null;
        }
    },

});

gf.Ad = module.exports = new GFAdvertControl();