/**
 * UpdateScene.js
 * Longer   2020-5-11 15:16:58
 * 热更新场景组件脚本
 */

cc.Class({
    extends: cc.Component,

    properties: {
        //包内manifest文件,在找不到本地manifest文件时,将会加载这个manifest文件,记得要把project.manifest文件拖到属性面板中
        packageManifest: {
            default: null,
            type: cc.Asset
        },
        sp_tips: cc.Node,
        txt_localVersion: cc.Label,
        txt_targetVersion: cc.Label,
        txt_tips: cc.Label,
        lbl_file: cc.Label,
        lbl_byte: cc.Label,
        pbar_file: cc.ProgressBar,
        pbar_byte: cc.ProgressBar,

        _updating: false,
        _canRetry: false,
        _storagePath: '',
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 如果不是原生环境,则直接切换到main场景,并且退出onLoad方法,意味着不会执行下面热更新的流程
        this.endUpdate();
        return;
        if(!cc.sys.isNative) {
        }
        
        console.info("搜索路径", jsb.fileUtils.getSearchPaths());
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'SIMGameHotUpdate');
        cc.log('远程资源的存储路径 -> : ' + this._storagePath);

        //设置自己的版本比较处理程序，versionA和B是字符串版本
        //如果返回值大于0，版本号大于B，
        //如果返回值为0，版本号为B，
        //如果返回值小于0，则versionA小于B。
        this.versionCompareHandle = function (versionA, versionB) {
            cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        };

        // Init with empty manifest url for testing custom manifest
        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);

        // 设置验证回调，但我们还没有md5检查功能，所以只打印一些消息
        // 如果验证通过，返回true，否则返回false
        this._am.setVerifyCallback(function (path, asset) {
            // 当资源被压缩时，我们不需要检查它的md5，因为zip文件已经被删除。
            var compressed = asset.compressed;
            // 检索正确的md5值。
            var expectedMD5 = asset.md5;
            // asset.path 是相对路径，path 是绝对路径。
            var relativePath = asset.path;
            // 这个资源文件的大小，但是这个值可能不存在。
            var size = asset.size;
            if (compressed) {
                //如果是压缩包,则检验先通过,因为后面解压失败的话也会触发检验失败
                // cc.log("Verification passed : " + relativePath);
                return true;
            }
            else {
                // cc.log("Verification passed : " + relativePath + ' (' + expectedMD5 + ')');
                return true;
            }
        });

        cc.log("热更新准备好了，请检查或直接更新。");
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            //当并发任务太多时，一些Android设备可能会减慢下载速度。
            //数值可能不准确，请多做测试，找出最适合你的游戏。
            this._am.setMaxConcurrentTask(2);
        }
        
        // this.pbar_byte.progress = 0;
        
        this.checkUpdate();
    },

    // update (dt) {},

    onDestroy () {
        if (this._updateListener) {
            this._am.setEventCallback(null);
            this._updateListener = null;
        }
    },

    checkCb: function (event) {
        cc.log('热更新检测Code: ' + event.getEventCode());
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                // this.txt_tips.string = "更新出错了~"
                this.updateTipsView("没找到本地manifest文件！是否重试？");
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                // this.txt_tips.string = "更新出错了~";
                this.updateTipsView("下载manifest文件失败！是否重试？");
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                // this.txt_tips.string = "更新出错了~";
                this.updateTipsView("下载或解析manifest文件失败！是否重试？");
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                //已经是最新版本,说明下载好了version.manifest文件,并且解析成功,将服务器版本号显示出来
                // this.txt_targetVersion.string = '目标版本：' + this._am.getRemoteManifest().getVersion();
                // this.txt_tips.string = "已经更新了最新的远程版本~";
                this.scheduleOnce(this.endUpdate.bind(this), 1.0);
                cc.log("--- 热更新完毕，准备启动游戏！ ---");
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                cc.log('检测到新版本：', event);
                cc.log('新版本文件总大小 ->', this._am.getTotalBytes());
                // this.txt_tips.string = "检测到有新的版本需要更新~";
                this.updateTipsView("检测到有新版本，是否进行更新？");
                // this.pbar_file.progress = 0;
                this.pbar_byte.progress = 0;
                break;
            default:
                // this.txt_tips.string = "更新错误：错误代码"+event.getEventCode();
                // cc.log("热更新检测返回代码"+event.getEventCode());
                return;
        }
        
        this._am.setEventCallback(null);
        this._checkListener = null;
        this._updating = false;
        cc.log('检测结束, 取消check的监听');
    },

    updateCb: function (event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                // this.txt_tips.string = "更新出错了~！"
                this.updateTipsView("没找到本地manifest文件！是否重试？");
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.pbar_byte.progress = event.getPercent();
                var nDByte = event.getDownloadedBytes();
                var nTByte = event.getTotalBytes();
                var strDHz = this.getHzString(nDByte);
                var strTHz = this.getHzString(nTByte);
                // this.lbl_file.string = "更新文件：" + event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                // this.lbl_byte.string = "更新大小：" + strDHz + ' / ' + strTHz;

                // event.getPercentByFile();
                var msg = event.getMessage();
                if (msg) {
                    // this.txt_tips.string = '正在更新文件：' + msg;
                    // cc.log(event.getPercent()/100 + '% : ' + msg);
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                // this.txt_tips.string = "更新出错了~！"
                this.updateTipsView("下载或解析manifest文件失败！是否重试？");
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                // this.txt_tips.string = "已经更新了最新的远程版本~";
                this.scheduleOnce(this.endUpdate.bind(this), 1.0);
                cc.log("--- 热更新完毕，准备启动游戏！ ---");
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                console.info('更新完成了：', event.getMessage());
                //已经是最新版本,说明下载好了version.manifest文件,并且解析成功,将服务器版本号显示出来
                // this.txt_localVersion.string = '本地版本：' + this._am.getRemoteManifest().getVersion();
                // this.txt_tips.string = '更新完成了';
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                // this.txt_tips.string = '更新失败了：' + event.getMessage();
                this.updateTipsView("下载或解析文件失败！是否重试？");
                this._updating = false;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                // this.txt_tips.string = '更新出错了：' + event.getMessage();
                this.updateTipsView('资源更新出错了: ' + event.getAssetId() + ', ' + event.getMessage() + "\n是否重试？");
                this._updating = false;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                // this.txt_tips.string = event.getMessage();
                break;
            default:
                break;
        }

        if (failed) {
            this._am.setEventCallback(null);
            this._updateListener = null;
            this._updating = false;
        }

        if (needRestart) {
            this._am.setEventCallback(null);
            this._updateListener = null;
            // this.pbar_byte.progress = 1;
            // this.pbar_file.progress = 1;
            var nByte = event.getTotalBytes();
            var strHz = this.getHzString(nByte);
            // this.lbl_file.string = "更新文件：" + event.getTotalFiles() + ' / ' + event.getTotalFiles();
            // this.lbl_byte.string = "更新大小：" + strHz + ' / ' + strHz;

            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            console.log(JSON.stringify(newPaths));
            Array.prototype.unshift.apply(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.audioEngine.stopAll();
            // this.txt_tips.string = "更新完毕，正在重启游戏...";
            this.scheduleOnce(function () {
                cc.game.restart();
            }, 1.0);
        }
    },

    checkUpdate: function () {
        if (this._updating) {
            // this.txt_tips.string = '正在检测更新中...';
            return;
        }
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            // Resolve md5 url
            var url = this.packageManifest.nativeUrl;
            if (cc.loader.md5Pipe) {
                url = cc.loader.md5Pipe.transformURL(url);
            }
            this._am.loadLocalManifest(url);
            // this.txt_localVersion.string = '本地版本：' + this._am.getLocalManifest().getVersion();
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            // this.txt_tips.string = '加载本地manifest文件失败...';
            return;
        }
        this._am.setEventCallback(this.checkCb.bind(this));

        this._am.checkUpdate();
        this._updating = true;
        cc.log("--- 开始检测热更新资源 ---");
    },

    hotUpdate: function () {
        if (this._am && !this._updating) {
            this._am.setEventCallback(this.updateCb.bind(this));

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                // Resolve md5 url
                var url = this.packageManifest.nativeUrl;
                if (cc.loader.md5Pipe) {
                    url = cc.loader.md5Pipe.transformURL(url);
                }
                this._am.loadLocalManifest(url);
                // this.txt_localVersion.string = '本地版本：' + this._am.getLocalManifest().getVersion();
            }

            // this.pbar_byte.node.active = true;
            // this.lbl_byte.node.active = true;
            // this.lbl_file.node.active = true;
            this._updating = true;
            this._failCount = 0;
            this._am.update();
        }
    },

    getHzString: function (nByte) {
        if (typeof nByte !== 'number') return "";

        var nKByte = Math.floor(nByte / 1024);
        var nMByte = Math.floor(nKByte / 1024);
        var nGByte = Math.floor(nMByte / 1024);
        var strHz = "";
        if (nGByte > 0) {
            strHz = nGByte + "GB";
        } else if (nMByte > 0) {
            strHz = nMByte + "MB";
        } else if (nKByte > 0) {
            strHz = nKByte + "KB";
        } else {
            strHz = nByte + "B";
        }

        return strHz;
    },

    updateTipsView: function (strTips) {
        console.log(strTips);
    },

    onClickConfirm: function () {
        // this.sp_tips.active = false;
        if (this._canRetry) {
            this._canRetry = false;
            //调用下载失败资源api
            this._am.downloadFailedAssets();
            cc.log('--- 重新下载失败的资源 ---');
        } else {
            this.hotUpdate();
        }
    },

    onClickCancel: function () {
        // this.sp_tips.active = false;
        // cc.director.end();
        cc.game.end();
    },

    endUpdate: function () {
        cc.log("更新完毕，进入游戏！");
        require('../framework/GFInit');
        if (this._am) {
            gf.Const.GAME_VERSION = this._am.getRemoteManifest().getVersion();
        }
        cc.director.loadScene('GameScene');
    },
});
