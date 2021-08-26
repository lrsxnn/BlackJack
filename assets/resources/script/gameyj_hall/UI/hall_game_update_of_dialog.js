
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var UpdateMgr = require("updaterMgr").UpdateMgr.Instance();
let UpdaterEntrance = require("Updater").UpdaterEntrance;
var AppConfig = require('AppConfig');

cc.Class({
    extends: require('com_game_update'),

    properties: {
        game_id: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._super();
        this.update_desc = this.node.getChildByName('update_desc').getComponent(cc.Label);
        this.update_progress = this.node.getChildByName('update_progress').getComponent(cc.Label);
        this.animation_node = this.node.getChildByName('dd_jiazai_donghua');
        this.update_btn = this.node.getChildByName('btn_update');
    },

    start() {

    },

    setGameID(gameID, gameName, roomId) {
        this.game_id = gameID;
        this.gameName = gameName;
        this.room_id = roomId;
        var GAME_PID = AppConfig.GAME_PID;
        if (GAME_PID > 0 && GAME_PID < 10000) {
            this.onUpdateFinish();
            return;
        }
        this.updater_entrance = UpdaterEntrance.FRIEND;
        this.updater = UpdateMgr.getUpdater(this.game_id);
        if (this.updater) {
            if (UpdateMgr.isGameInstalled(this.game_id)) {
                this.updater.checkUpdate(this.updater_entrance);
            } else {
                this.update_progress.node.active = false;
                this.animation_node.active = false;
                this.update_desc.string = "未安装" + this.gameName + ",是否立即下载?";
                this.update_desc.node.active = true;
                this.update_btn.active = true;
            }
        } else {
            this.onUpdateFinish();
        }
    },

    /**
     * 刷新UI
     */
    updateUI(active, progress) {
        this.update_desc.node.active = false;
        this.update_progress.node.active = active;
        this.animation_node.active = active;
        if (progress) {
            this.update_progress.string = '正在更新...' + parseInt(progress * 100) + '%';
        }
    },

    onUpdateFinish() {
        this.update_progress.node.active = false;
        this.update_desc.node.active = false;
        this.animation_node.active = false;
        this.update_btn.active = false;
        if (this.room_id) {
            let msg = new cc.pb.room_mgr.msg_room_pre_enter_req();
            msg.setRoomId(this.room_id);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_room_pre_enter_req, msg, 'cmd_msg_room_pre_enter_req', true);
            cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onStop');
            this.node.destroy();
        }
    },

    onClickUpdate() {
        hall_audio_mgr.com_btn_click();

        this.updater = UpdateMgr.getUpdater(this.game_id);
        if (cc.sys.isNative && this.updater) {
            if (this.updater.updateing) {
                cc.dd.PromptBoxUtil.show('游戏正在下载中,请稍等!');
                return;
            }
            if (this.updater.checking) {
                cc.log("正在检测更新中");
                return;
            }
            //设置游戏更新完成回调,游戏更新id

            this.setUpdateFinishCallback(this.onUpdateFinish.bind(this));
            this.setGameId(this.game_id);

            if (UpdateMgr.isGameInstalled(this.game_id)) {
                this.updater.startUpdate(this.updater_entrance);
            } else {
                this.updater.checkUpdate(this.updater_entrance);
            }

        } else {
            this.onUpdateFinish();
        }
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        if (!this.updater || !data || !data[0] || data[0].type != this.updater.cfg.type) {
            return;
        }
        if (this.updater.entrance != this.updater_entrance) {
            return;
        }
        //处理新版本事件
        if (UpdateMgr.isGameInstalled(this.game_id) && event == cc.dd.UpdaterEvent.NEW_VERSION_FOUND) {
            this.update_progress.node.active = false;
            this.animation_node.active = false;
            this.update_desc.string = this.gameName + "存在更新,是否立即下载?";
            this.update_desc.node.active = true;
            this.update_btn.active = true;
        } else {
            this._super(event, data);
        }
    },

    onClose() {
        var self = this;
        cc.dd.DialogBoxUtil.show(0, "是否取消更新", '是', '否', function () {
            self.node.destroy();
        }, function () { });
    },

    // update (dt) {},
});
