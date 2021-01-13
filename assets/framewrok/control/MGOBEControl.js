/**
 * MGOBEControl.js
 * 
 * CCC  2021-1-12 14:24:06  创建
 * 腾讯云 联机对战引擎
 * 
 */

/**
 * 随机产生 openId
 */
const mockOpenId = () => {
    let str = Date.now().toString(36);

    for (let i = 0; i < 7; i++) {
        str += Math.ceil(Math.random() * (10 ** 4)).toString(36);
    }

    return str;
};
/** openId 是确认玩家身份的Id */
// kjv2ljo86yf3hz1qw8v19i59l4ls
// "q1ypl3ql" "rYUZQNOd"

const gameInfo = {
    gameId: 'obg-4yzf7o6x',
    secretKey: 'b5566947aad462431d2c529c94243348642428c4',
    // openId: mockOpenId(),
    openId: 'default',
    // 默认匹配 Code
    matchCode: "match-2s4fvwhq",
};

const config = {
    url: '4yzf7o6x.wxlagame.com',
    reconnectMaxTimes: 5,
    reconnectInterval: 1000,
    resendInterval: 1000,
    resendTimeout: 10000,
};

let _MRoom;
let _gameId;
let MGOBEControl = cc.Class({
    extends: gf.Class,

    properties: {

    },

    ctor() {
    },

    init(inRoomCallback, notInRoomCallback) {
        // 如果已经初始化，直接回调成功
        if (this.isInited()) {
            this.getRoomInfo(inRoomCallback, notInRoomCallback);
        }
        MGOBE.DebuggerLog.enable = !cc.sys.isNative;
        MGOBE.DebuggerLog.enable = false;

        let openId = IData.User.getUserId();
        openId = openId ? openId : mockOpenId();

        Object.assign(gameInfo, { openId });
        // 实例化 Room 对象
        MGOBE.Listener.init(gameInfo, config, event => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                _MRoom = new MGOBE.Room();
                _gameId = gameInfo.gameId;

                MGOBE.Listener.add(_MRoom);
                // 设置默认广播
                this.setBroadcastCallbacks(_MRoom);
                this.getRoomInfo(inRoomCallback, notInRoomCallback);

            } else {
                console.log('初始化失败', event);
            }
        });
    },

    isInited() {
        return !!MGOBE.Player && !!MGOBE.Player.id;
    },

    setBroadcastCallbacks(room) {
        if (!room) {
            return;
        }
        // 默认回调函数
        const generateDefaultCallback = (tag) => (event) => {
            console.log('==================> MGOBE Message' + tag);
            console.log(`==================> emit : ${tag}`);
            console.log(`==================> data : `, event);
        };

        const defaultCallbacks = {
            onJoinRoom: () => generateDefaultCallback("onJoinRoom"),
            onLeaveRoom: () => generateDefaultCallback("onLeaveRoom"),
            onChangeRoom: () => generateDefaultCallback("onChangeRoom"),
            onDismissRoom: () => generateDefaultCallback("onDismissRoom"),
            onStartFrameSync: () => generateDefaultCallback("onStartFrameSync"),
            onStopFrameSync: () => generateDefaultCallback("onStopFrameSync"),
            onRecvFrame: () => generateDefaultCallback("onRecvFrame"),
            onChangeCustomPlayerStatus: () => generateDefaultCallback("onChangeCustomPlayerStatus"),
            onRemovePlayer: () => generateDefaultCallback("onRemovePlayer"),
            onRecvFromClient: () => generateDefaultCallback("onRecvFromClient"),
            onRecvFromGameSvr: () => generateDefaultCallback("onRecvFromGameSvr"),
            onAutoRequestFrameError: () => generateDefaultCallback("onAutoRequestFrameError"),
        };

        // 给 room 实例设置广播回调函数
        Object.keys(defaultCallbacks).forEach((key) => {
            const callback = defaultCallbacks[key];
            room[key] = callback;
        });
    },

    getRoomInfo(inRoomCallback, notInRoomCallback) {
        if (!_MRoom) return;
        return new Promise((res, rej) => {
            _MRoom.getRoomDetail(event => {
                if (event.code === 0) {
                    if (typeof inRoomCallback === 'function') {
                        inRoomCallback();
                    }
                    res(event.data.roomInfo);
                }
                if (event.code === 20011) {
                    if (typeof notInRoomCallback === 'function') {
                        notInRoomCallback();
                    }
                }
            });
        })
    },
    createRoom() { },

    leaveRoom(callback) {
        _MRoom.leaveRoom({}, event => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                console.log(`退出房间成功`);
                if (typeof callback === 'function') {
                    callback(event);
                }
            } else {
                console.log(`退出房间失败，错误码：${event.code}`);
            }
        });
    },

    quiteRoom() { },

    matchPlayers(callback) {
        this.lockSubmit = true;
        // this.timer = setInterval(() => console.log(`正在随机匹配，请稍等。`), 1000);
        console.log(`正在随机匹配，请稍等，默认超时时间为 10 秒。`);

        // 注意：这里没有使用匹配属性，如果匹配规则中有设置匹配属性，这里需要做调整
        const matchAttributes = [];

        const playerInfo = {
            name: "是我本人",
            customPlayerStatus: 0,
            customProfile: "",
            matchAttributes,
        };

        const matchPlayersPara = {
            matchCode: gameInfo.matchCode,
            playerInfo,
        };

        _MRoom.initRoom();
        _MRoom.matchPlayers(matchPlayersPara, event => {
            this.lockSubmit = false;
            clearInterval(this.timer);

            if (event.code === MGOBE.ErrCode.EC_OK) {
                console.log(`随机匹配成功，房间ID：${event.data.roomInfo.id}`);
                if (typeof callback === 'function') {
                    callback(event);
                }
            } else {
                console.log(`随机匹配失败，错误码：${event.code}`);
            }
        });
    },


    // update (dt) {},
});
gf.Online = module.exports = new MGOBEControl();