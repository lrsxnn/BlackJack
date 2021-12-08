//created by wj 2017/12/19
var dd = cc.dd;
var FortuneHallManager = require('FortuneHallManager').Instance();
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var klb_game_list_config = require('klb_gameList');
var hall_prefab = require('hall_prefab_cfg');
cc.Class({
    extends: cc.Component,

    properties: {
        num: [cc.Label],
        game_id: 0,
        room_type: 0,
        lastLogin: cc.Label,
        labelColor: [cc.Color],
    },

    start: function () {

    },

    onLoad: function () {
        this._num = [];
        this.numInit = ['请', '输', '入', '房', '间', '号'];
        this.cache_num = [];
        cc.dd.UpdaterED.addObserver(this);

    },

    onDestroy: function () {
        cc.dd.UpdaterED.removeObserver(this);
    },

    /**
     * 显示视图回调
     */
    onEnable: function () {

    },

    /**
     * 隐藏视图回调
     */
    onDisable: function () {

    },


    /**
     * 设置输入的数字
     * @param _
     * @param custom
     */
    setNnum: function (arr) {
        arr = arr || [];
        for (var i = 0; i < this.num.length; ++i) {
            if (arr.length > 0) {
                this.num[i].node.color = this.labelColor[1];
            } else {
                this.num[i].node.color = this.labelColor[0];
            }
            if (i < arr.length) {
                this.num[i].string = arr[i];
            } else {
                this.num[i].string = arr.length > 0 ? '' : this.numInit[i];
            }

        }
    },

    /**
     * 回调函数
     */
    onReset: function () {
        hall_audio_mgr.com_btn_click();
        this._num.splice(0);
        this.setNnum();
    },

    onDel: function () {
        hall_audio_mgr.com_btn_click();
        this._num.pop();
        this.setNnum(this._num);

    },

    closeCall: function (event, custom) {
        //清除房间号
        this._num.splice(0);
        this.setNnum();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onEnterNum: function (_, custom) {
        hall_audio_mgr.com_btn_click();
        if (this._num.length < 6) {
            this._num.push(custom);
            this.setNnum(this._num);
        }
        if (this._num.length == 6) {//发送获取房间规则
            var ani = this.node.getChildByName('action_node').getComponent(cc.Animation);
            ani.play('klb_hall_closeJoinRoom');
            ani.on('stop', this.onStop, this);
            //cc.dd.NetWaitUtil.show(cc.dd.Text.TEXT_COMMON_1);
            //HallSendMsgCenter.getInstance().getGameUrlInfo(false, 20, this._num.join(''),false);

        }

    },

    onCloseUICallBack: function () {
        var ani = this.node.getChildByName('action_node').getComponent(cc.Animation);
        ani.off('stop', this.onCloseUICallBack, this);
        this.node.active = false;
    },

    /**
     * 关闭创建房间界面
     */
    onCloseJoinRoomUI: function () {
        var ani = this.node.getChildByName('action_node').getComponent(cc.Animation);
        ani.play('klb_hall_closeJoinRoom');
        ani.on('stop', this.onCloseUICallBack, this);
        this._num.splice(0);
        this.setNnum();
    },

    /***
     * 特效播放完毕的回调
     */
    onStop: function () {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.JOIN_ROOM);
        /************************游戏统计   end************************/

        this._num.forEach(function (element, index) {
            this.cache_num[index] = element;
        }, this);
        //清除房间号
        this._num.splice(0);
        this.setNnum();
        this.onCloseUICallBack();
        var ani = this.node.getChildByName('action_node').getComponent(cc.Animation);
        ani.off('stop', this.onStop, this);

        cc.sys.localStorage.removeItem('club_game_wafanum');

        let msg = new cc.pb.room_mgr.msg_room_pre_enter_req();
        msg.setRoomId(parseInt(this.cache_num.join('')));
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_room_pre_enter_req, msg, 'cmd_msg_room_pre_enter_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onStop');

    },

    /********************************************消息发送***********************************************/
    /**
     * 发送获取房间规则
     */
    sendGetGuize: function (roonum) {
        var msg = new cc.pb.room_mgr.msg_game_rule_req();
        msg.setRoomId(roonum);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_game_rule_req, msg, 'cmd_msg_game_rule_req', true);
    },

    /********************************************消息发送end***********************************************/


    onEventMessage: function (event, data) {
        switch (event) {
            case cc.dd.UpdaterEvent.NEW_VERSION_FOUND:
                if (!cc._joinUpdater || !data || !data[0] || data[0].type != cc._joinUpdater.cfg.type) {
                    return;
                }
                if (cc._joinUpdater.entrance != 'entrance_join') {
                    return;
                }

                if(cc.dd.Utils.checkIsUpdateOrWrongRoom(cc._joinUpdater.cfg.game_id)) {
                    let name = '';
                    let config = klb_game_list_config.getItem(function (item) {
                        return item.gameid == cc._joinUpdater.cfg.game_id;
                    }.bind(this));
                    if (config) {
                        name = config.name
                    }
                    if (!cc.dd.UIMgr.getUI(hall_prefab.HALL_GAME_UPDATE)) {
                        cc.dd.UIMgr.openUI(hall_prefab.HALL_GAME_UPDATE, function (prefab) {
                            var update = prefab.getComponent('hall_game_update_of_dialog');
                            update.setGameID(cc._joinUpdater.cfg.game_id, name, cc._joinUpdater.roomId);
                        })
                    }
                }else{
                    cc.dd.DialogBoxUtil.show(0, "text37", 'text33', null, function () {

                    }.bind(this), null);
                }
                break;
            case cc.dd.UpdaterEvent.ALREADY_UP_TO_DATE:
                if (!cc._joinUpdater || !data || !data[0] || data[0].type != cc._joinUpdater.cfg.type) {
                    return;
                }
                if (cc._joinUpdater.entrance != 'entrance_join') {
                    return;
                }
                if (cc._join_room_updated) {
                    cc._join_room_updated();
                    cc._join_room_updated = null;
                }
                break;
        }
    },


});
