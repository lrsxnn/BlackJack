const AppCfg = require('AppConfig');

var jzmj_util = require("jzmj_util");
var jzmj_desk_data_jbc = require("jzmj_desk_data_jbc");
var jzmj_net_handler_jzmj = require("jzmj_net_handler_jzmj");

var dd = cc.dd;
var DeskData = require("jzmj_desk_data").DeskData;
var DeskEvent = require("jzmj_desk_data").DeskEvent;
var DeskED = require("jzmj_desk_data").DeskED;
var DingRobot = require('DingRobot');

var game_room = require("game_room");

var Hall = require("jlmj_halldata");
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var hall_common_data = require('hall_common_data').HallCommonData;
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;

var jlmj_prefab = require('jlmj_prefab_cfg');
var jlmj_audio_path = require("jlmj_audio_path");
var jlmj_audio_mgr = require('jlmj_audio_mgr').Instance();

var playerED = require("jzmj_player_data").PlayerED;
var PlayerEvent = require("jzmj_player_data").PlayerEvent;
var Platform = require("Platform");
var playerMgr = require("jzmj_player_mgr");

var RoomMgr = require("jlmj_room_mgr").RoomMgr;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;

var SysED = require("com_sys_data").SysED;
var SysEvent = require("com_sys_data").SysEvent;

var UserPlayer = require("jzmj_userPlayer_data");
var UIZorder = require("mj_ui_zorder");
var HuType = require('jlmj_define').HuType;
var Text = cc.dd.Text;

var PopupType = {
    OK_CANCEL: 1,
    OK: 2,
    CANCEL: 3,
};

var baseDeskInfo = cc.Class({
    extends: cc.Component,

    properties: {
        zhuomianImg: [cc.SpriteFrame],//桌面背景
        spf_baopai_an: cc.SpriteFrame,
        spf_baopai_ming: cc.SpriteFrame,
        spf_baopai_an_2d: cc.SpriteFrame,
        spf_baopai_ming_2d: cc.SpriteFrame,
        prefab_fenzhang: cc.Prefab,//分张预制体
    },

    onLoad: function() {
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_JIAOPAI_INFO, function (ui) {
            var mj_jiao_info = ui.getComponent('mj_jiao_info');
            mj_jiao_info.initPool();
        }.bind(this));

        cc.log("jzmj_desk_info onLoad");
        this.logo = cc.find("Canvas/desk_node/c-logo-jinzhou").getComponent(cc.Sprite);
        this.layer_disabled = cc.find("Canvas/mj_lockScene_layer");
        this.layer_disabled.active = false;
        this.gghh_ani = cc.find("Canvas/desk_node/play_anis/gghh_m").getComponent(sp.Skeleton);
        // this.gkm_ani = cc.find("Canvas/desk_node/play_anis/gkm_m").getComponent(sp.Skeleton);
        // this.jingoushiba_ani = cc.find("Canvas/desk_node/play_anis/jingoushiba_m").getComponent(sp.Skeleton);
        this.qd_ani = cc.find("Canvas/desk_node/play_anis/qd_m").getComponent(sp.Skeleton);

        this.gghh_ani.node.active = false;
        // this.gkm_ani.node.active = false;
        // this.jingoushiba_ani.node.active = false;
        this.qd_ani.node.active = false;

        this.initDeskDataUI();
        this.initDeskData();
        this.initLocalData();
        this.initGuiZeInfo();
        this.initReady();
        this.initZhiNan();
        //返回键点击消息注册
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        if (cc.find('Marquee')) {
            this._Marquee = cc.find('Marquee');
            this._Marquee.getComponent('com_marquee').updatePosition();
        }

        HallCommonEd.addObserver(this);
        DeskED.addObserver(this);
        playerED.addObserver(this);
        SysED.addObserver(this);
        RoomED.addObserver(this);
        Hall.HallED.addObserver(this);
    },

    initDeskDataUI: function() {
        cc.find("Canvas/desk_node/jlmj_player_down_ui").active = true;
        cc.find("Canvas/desk_node/jlmj_player_right_ui").active = false;
        cc.find("Canvas/desk_node/jlmj_player_up_ui").active = false;
        cc.find("Canvas/desk_node/jlmj_player_left_ui").active = false;
        cc.find("Canvas/desk_node/mj_playerHead_right").active = false;
        cc.find("Canvas/desk_node/mj_playerHead_left").active = false;
        cc.find("Canvas/desk_node/mj_playerHead_up").active = false;

        cc.find("Canvas/desk_node/down_head_button").active = false;
        cc.find("Canvas/desk_node/right_head_button").active = false;
        cc.find("Canvas/desk_node/up_head_button").active = false;
        cc.find("Canvas/desk_node/left_head_button").active = false;

        cc.find("Canvas/kai_ju_ani").active = false;
        cc.find("Canvas/huang_zhuang_ani").active = false;

        cc.find("Canvas/desk_node/dahuanbao").active = false;
        cc.find("Canvas/desk_node/jlmj_zhishiqi").active = false;
        cc.find("Canvas/desk_node/baopai").active = false;

        cc.find("Canvas/desk_node/jlmj_player_down_ui/tingButton").zIndex = UIZorder.MJ_LAYER_UI;
        cc.find("Canvas/desk_node/jlmj_player_down_ui/tingButton").active = false;

        cc.find("Canvas/gzNode").active = true;
        this.setLastJieSuanActive();

        this.zhinan = null;
        this._zhinan = cc.find("Canvas/desk_node/mj_zhinan");
        this._zhinan_2d = cc.find("Canvas/desk_node/mj_zhinan_2d");
        this.use2D = cc.sys.localStorage.getItem(cc.dd.AppCfg.GAME_ID + '_' + cc.dd.user.id + '_use2D') === 'true';
        if (this.use2D) {
            this.zhinan = this._zhinan_2d;
            cc.find("Canvas/desk_node/baopai").y = 17.5;
        } else {
            this.zhinan = this._zhinan;
            cc.find("Canvas/desk_node/baopai").y = 42.7;
        }
        this._zhinan.active = false;
        this._zhinan_2d.active = false;

        cc.find("Canvas/toppanel/btn_ready").active = true;
        cc.find("Canvas/toppanel/btn_invite").active = true;
        // cc.find("Canvas/toppanel/btn_inviteXL").active = true;
        cc.find("Canvas/room_num").active = true;
        this.setFriendGroupInvite(cc.find("Canvas/toppanel/btn_invite").active);

        this.baopai = cc.find("Canvas/desk_node/baopai").getComponent('jlmj_pai');
        this.deskImage = cc.find("Canvas/zhuozi").getComponent(cc.Sprite);

        this.da_pai_prompt = cc.find("Canvas/desk_node/mj_dapai_prompt");
        this.da_pai_prompt_label = cc.find("Canvas/desk_node/mj_dapai_prompt/prompt_label").getComponent(cc.Label);
        this.da_pai_prompt.active = false;
        this.dapai_tip_type = -1;

        //初始化人数
        DingRobot.set_ding_type(1);
        this.update_player_num(playerMgr.Instance().getPlayerNum());

        //如果桌子已解散,弹窗提示玩家
        if (DeskData.Instance().desk_dissolved) {
            var content = cc.dd.Text.TEXT_DESK_INFO_5;
            this.popViewTips(content, function() {
                jzmj_util.enterHall();
            }.bind(this), PopupType.OK);
        }

        //结算窗口
        if (DeskData.Instance().jiesuanMsg) {
            var msg = DeskData.Instance().jiesuanMsg;
            DeskData.Instance().jiesuanMsg = null;
            this.jiesuan([msg]);
        }

        cc.find("Canvas/toppanel/messageBtn").getComponent(cc.Button).interactable = true;
        this.update_player_info();
    },

    initDeskData: function() {
        var currValue = DeskData.Instance().currPlayCount;
        var totalValue = RoomMgr.Instance()._Rule.boardscout;
        var roomNum = RoomMgr.Instance().roomId;
        //当前局数
        cc.find("Canvas/toppanel/desk_leftinfo_fun/leftInfo/quanshu").getComponent(cc.Label).string = currValue;
        //总局数
        cc.find("Canvas/toppanel/desk_leftinfo_fun/leftInfo/quanshu/zong_ju").getComponent(cc.Label).string = totalValue;
        //房号
        cc.find("Canvas/room_num/room_id").getComponent(cc.Label).string = roomNum;
    },

    initLocalData: function() {
        //声音
        AudioManager.playMusic(jlmj_audio_path.Music_Game);
        if (!AudioManager._getLocalMusicSwitch()) {
            AudioManager.stopMusic();
            AudioManager.offMusic();
        }

        if (this.use2D) {
            this.deskImage.spriteFrame = this.zhuomianImg[2];
            this.logo.node.scaleX = 0.8;
            this.logo.node.scaleY = 0.8;
            return;
        }

        this.logo.node.scaleX = 1;
        this.logo.node.scaleY = 1;

        //桌布
        var json = cc.sys.localStorage.getItem('jzmj_zhuobu_set_' + cc.dd.user.id);
        if (json) {
            var sprite = null;
            this.zhuomianImg.forEach(function(element, index) {
                if (element._name == json) {
                    sprite = element;
                }
            });
            if (sprite) {
                this.deskImage.spriteFrame = sprite;
            }
            else {
                this.deskImage.spriteFrame = this.zhuomianImg[0];
                cc.sys.localStorage.setItem('jzmj_zhuobu_set_' + cc.dd.user.id, this.zhuomianImg[0]._name);
            }
        }
        else {
            this.deskImage.spriteFrame = this.zhuomianImg[0];
            cc.sys.localStorage.setItem('jzmj_zhuobu_set_' + cc.dd.user.id, this.zhuomianImg[0]._name);
        }
    },

    //初始化规则显示文本
    initGuiZeInfo: function() {
        if (!DeskData.Instance().isFriend()) {
            return;
        }
        if (DeskData.Instance().gameStatus == 2) {
            return;
        }
        cc.find("Canvas/toppanel/RecordButton").active = RoomMgr.Instance()._Rule.isyuyin;
        cc.find("Canvas/gzNode").active = true;
        var desk_leftinfo = cc.find("Canvas/toppanel/desk_leftinfo_fun").getComponent("mj_desk_leftinfo");
        var mj_guize = cc.find("Canvas/gzNode").getComponent("mj_guize");
        var cur_rule = RoomMgr.Instance()._Rule;
        cur_rule.roomId = RoomMgr.Instance().roomId;

        let fd = [0, 100, 200, 300, 150]

        this.gz_arr_box = [];
        this.gz_arr_box.push(Text.TEXT_PY_RULE_89.format([RoomMgr.Instance()._Rule.usercountlimit]));
        this.gz_arr_box.push(Text.TEXT_PY_RULE_39.format([fd[RoomMgr.Instance()._Rule.fengdingtype]]));
        this.gz_arr_box.push(RoomMgr.Instance()._Rule.isdaihun ? Text.TEXT_PY_RULE_90 : '');
        // this.gz_arr_box.push(RoomMgr.Instance()._Rule.isqionghujiafan ? Text.TEXT_PY_RULE_91 : '');
        this.gz_arr_box.push(RoomMgr.Instance()._Rule.isqidui ? Text.TEXT_PY_RULE_27 : '');
        this.gz_arr_box.push(RoomMgr.Instance()._Rule.isqingyise ? Text.TEXT_PY_RULE_29 : '');
        this.gz_arr_box.push(RoomMgr.Instance()._Rule.is3qing ? Text.TEXT_PY_RULE_92 : '');
        this.gz_arr_box.push(RoomMgr.Instance()._Rule.is4qing ? Text.TEXT_PY_RULE_93 : '');
        this.gz_arr_box.push(RoomMgr.Instance()._Rule.isjiehu ? Text.TEXT_PY_RULE_127 : '');

        var func = cc.callFunc(function() {
            if (DeskData.Instance().isFriend()) {
                desk_leftinfo.qsNode.active = desk_leftinfo.qsNode.active == false;
                desk_leftinfo.dcNode.active = desk_leftinfo.qsNode.active == false;
            } else {
                desk_leftinfo.dfNode.active = desk_leftinfo.dfNode.active == false;
                desk_leftinfo.dcNode.active = desk_leftinfo.dfNode.active == false;
            }
        }.bind(desk_leftinfo));
        desk_leftinfo.init(this.gz_arr_box, func, cur_rule);

        this.gz_arr_info = [];
        var juquan_txt = RoomMgr.Instance()._Rule.usercountlimit != 4 ? Text.TEXT_PY_RULE_10 : Text.TEXT_PY_RULE_11;
        this.gz_arr_info.push({ str: Text.TEXT_PY_RULE_89.format([RoomMgr.Instance()._Rule.usercountlimit]), nodetype: 0 });
        this.gz_arr_info.push({ str: juquan_txt.format([RoomMgr.Instance()._Rule.boardscout]), nodetype: 0 });
        this.gz_arr_info.push({ str: Text.TEXT_PY_RULE_39.format([fd[RoomMgr.Instance()._Rule.fengdingtype]]), nodetype: 1 });
        this.gz_arr_info.push({ str: RoomMgr.Instance()._Rule.isdaihun ? Text.TEXT_PY_RULE_90 : '', nodetype: 1 });
        // this.gz_arr_info.push({ str: RoomMgr.Instance()._Rule.isqionghujiafan ? Text.TEXT_PY_RULE_91 : '', nodetype: 1 });
        this.gz_arr_info.push({ str: RoomMgr.Instance()._Rule.isqidui ? Text.TEXT_PY_RULE_27 : '', nodetype: 1 });
        this.gz_arr_info.push({ str: RoomMgr.Instance()._Rule.isqingyise ? Text.TEXT_PY_RULE_29 : '', nodetype: 1 });
        this.gz_arr_info.push({ str: RoomMgr.Instance()._Rule.is3qing ? Text.TEXT_PY_RULE_92 : '', nodetype: 1 });
        this.gz_arr_info.push({ str: RoomMgr.Instance()._Rule.is4qing ? Text.TEXT_PY_RULE_93 : '', nodetype: 1 });
        this.gz_arr_info.push({ str: RoomMgr.Instance()._Rule.isjiehu ? Text.TEXT_PY_RULE_127 : '', nodetype: 1 });
        mj_guize.addGuize(this.gz_arr_info, RoomMgr.Instance()._Rule.gps);

        let node = cc.find("Canvas/toppanel/klb_friend_group_invite_btn");
        if(node){
            let wanFa = this.gz_arr_box.slice();
            let wanFaTitle = wanFa.shift();

            let playerList = playerMgr.Instance().getPlayerList();
            let playerName = [];
            playerList.forEach(function (playerMsg) {
                if(playerMsg&&playerMsg.userId){
                    playerName.push(playerMsg.name);
                }
            },this);

            //玩法名称+人数+圈数+封顶+缺几人
            let rule = wanFaTitle + ' ' + wanFa.join(' ') + playerName.length + '/' + RoomMgr.Instance()._Rule.usercountlimit;

            node.getComponent('klb_friend_group_invite_btn').setInfo(RoomMgr.Instance().roomId, rule)
        }
    },

    /**
     * 初始化准备按钮
     */
    initReady: function() {
        if (!DeskData.Instance().isGameStart) {
            var player1 = playerMgr.Instance().getPlayer(cc.dd.user.id);
            if (player1 != null) {
                if (player1.bready == 1) {
                    this.set_read(cc.dd.user.id);
                }
            }
        }
    },

    initZhiNan: function() {
        if (this.zhinan.active && DeskData.Instance().zhiNan_site != null) {
            var site = DeskData.Instance().zhiNan_site;
            if (playerMgr.Instance().playerList.length == 2) {
                site = site > 0 ? site + 1 : site;
            }
            this.zhinan.getComponent("jzmj_zhinan_ui").initsetZhiNan(site);
            DeskData.Instance().zhiNan_site = null;
        }
    },

    start: function() {
        DeskData.Instance().enterSceneRecoverDesk(this.sendReadyOK.bind(this));
    },

    onDestroy: function() {
        HallCommonEd.removeObserver(this);
        DeskED.removeObserver(this);
        playerED.removeObserver(this);
        SysED.removeObserver(this);
        RoomED.removeObserver(this);
        Hall.HallED.removeObserver(this);

        //清理数据
        DeskData.Destroy();
        playerMgr.Destroy();
        RoomMgr.Destroy();

        /*if(this.jiesuan_TimeID){
            this.unschedule(this.jiesuan_TimeID);
        }*/
        if(this.result_TimeID){
            clearTimeout(this.result_TimeID);
            this.result_TimeID = null;
        }
        if(this.locakSceneTimeOut){
            clearTimeout(this.locakSceneTimeOut);
            this.locakSceneTimeOut = null;
        }
        this.unscheduleAllCallbacks();
        cc.dd.UIMgr.destroyUI(jlmj_prefab.JLMJ_JIESUAN);
        if (this._Marquee) {
            this._Marquee.getComponent('com_marquee').resetPosition();
        }
    },

    cleanJieSuan(){
        if (this.jiesuan_TimeID) {
            this.unschedule(this.jiesuan_TimeID);
            this.jiesuan_TimeID = null
        }
        if (this._jiesuan) {
            this._jiesuan.close();
            this._jiesuan = null;
        }
    },

    change_room: function() {
        cc.dd.mj_game_start = true;

        var play_list = cc.find('Canvas/player_list').getComponent('jzmj_player_list');
        if (play_list) {
            for (var i = 0; i < play_list.player_ui_arr.length; ++i) {
                var headinfo = play_list.player_ui_arr[i];
                if (headinfo && headinfo.head.player && headinfo.head.player.userId != cc.dd.user.id) {
                    headinfo.head.node.active = false;
                }
            }
        }

        var pbData = new cc.pb.room_mgr.msg_change_room_req();
        pbData.setGameType(RoomMgr.Instance().gameId);
        pbData.setRoomCoinId(RoomMgr.Instance().roomLv);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_change_room_req, pbData, 'msg_change_room_req', true);
    },

    change_desk_image: function(type) {
        cc.log('换桌布：', type);
        this.initLocalData();
    },

    // 直接退出房间
    // --------------------------------
    // @param msg [object] 数据层发来的数据
    exitRoom: function(msg) {
        this.closePopupView();
        this.closeResponseDissolveView();
        if (msg.exitid == dd.user.id) {
            this.gobackHall();
        } else {
            playerMgr.Instance().playerExit(msg.exitid);
        }
    },
    gobackHall: function() {
        jzmj_util.enterHall();
    },
    /**
     * 清理桌子
     */
    clear: function(data) {
        this.da_pai_prompt.active = false;

        this.gghh_ani.node.active = false;
        // this.gkm_ani.node.active = false;
        // this.jingoushiba_ani.node.active = false;
        this.qd_ani.node.active = false;

        cc.find("Canvas/desk_node/baopai").active = false;
        cc.find("Canvas/desk_node/jlmj_player_down_ui/tingButton").active = false;
        this.closeResponseDissolveView();
        this.closePopupView();
        cc.dd.UIMgr.destroyUI(jlmj_prefab.JLMJ_JIAOPAI_INFO);
        DeskED.notifyEvent(DeskEvent.CLOSE_ZSQ, [this]);

        if (cc.dd.mj_change_2d_next_time) {
            cc.dd.mj_change_2d_next_time = false;
            this._change2D();
        }
    },

    closePopupView: function() {
        cc.dd.UIMgr.destroyUI(jlmj_prefab.JLMJ_TANCHUANG);
    },

    closeResponseDissolveView: function() {
        if (this.popupViewPrefab) {
            cc.dd.UIMgr.destroyUI(jlmj_prefab.JLMJ_JIESAN);
        }
    },

    /**
     * 恢复数据适用
     */
    recoverDesk: function() {
        cc.log("jzmj 朋 友 recover_desk------ 接收1");
        cc.log("------恢复桌子------py");
        this.updateDesk();
        DeskData.Instance().enterSceneRecoverDesk(this.sendReadyOK.bind(this));
        if (this.fenzhang) {
            this.fenzhang.node.active = false;
        }
        var player = playerMgr.Instance().getPlayer(dd.user.id);
        if (DeskData.Instance().isGameStart) {
            this.setTingPaiUIActive(player.isBaoTing);
        } else if (DeskData.Instance().isFriend()) {
            this.initDeskData();
        }
    },
    /**
     * 隐藏 桌子上的准备 邀请
     */
    hide_desk_ready: function() {
        cc.find("Canvas/toppanel/btn_invite").active = false;
        // cc.find("Canvas/toppanel/btn_inviteXL").active = false;
        cc.find("Canvas/toppanel/btn_ready").active = false;
        this.setFriendGroupInvite(cc.find("Canvas/toppanel/btn_invite").active);

        cc.log("------隐藏按键------");
        if (DeskData.Instance().isFriend()) {
            cc.find("Canvas/gzNode").active = false;
            this.zhinan.active = true;
            cc.find("Canvas/room_num").active = false;
            this.initZhiNan();
        }
    },

    updateDesk: function() {
        this.update_remain_card();
        this.update_bao_pai();
        this.update_curr_round();
        this.update_total_round();
        this.update_room_num();
        this.update_player_info();
        this.update_game_status();
    },
    /**
     * 更新游戏状态
     * @param status 1：未开始 2：已开始
     */
    update_game_status: function(status) {
        if (!DeskData.Instance().isGameStart) {
            return;
        }
        cc.log("-----更新游戏状态------");
        if (!status)
            status = DeskData.Instance().gameStatus;
        cc.log("-----游戏状态------>" + status);
        var player = playerMgr.Instance().getPlayer(dd.user.id);
        if (status == 1) {
            if (DeskData.Instance().isFriend()) {
                cc.find("Canvas/toppanel/btn_invite").active = true;
                // cc.find("Canvas/toppanel/btn_inviteXL").active = true;
                cc.find("Canvas/toppanel/btn_ready").active = true;
                this.setFriendGroupInvite(cc.find("Canvas/toppanel/btn_invite").active);
            }
            if (player.bready) {
                this.setRead(dd.user.id);
            }
            playerMgr.Instance().playerNumChanged();
        } else if (status == 2) {
            if (DeskData.Instance().isFriend()) {
                cc.find("Canvas/toppanel/btn_invite").active = false;
                // cc.find("Canvas/toppanel/btn_inviteXL").active = false;
                cc.find("Canvas/toppanel/btn_ready").active = false;
                cc.find("Canvas/gzNode").active = false;
                cc.find("Canvas/room_num").active = false;
                this.setFriendGroupInvite(cc.find("Canvas/toppanel/btn_invite").active);
            }
            this.zhinan.active = true;
            this.initZhiNan();
            if (player.isBaoTing) {
                this.setTingPaiUIActive(true);
            }
        }
    },
    /**
     *  断线重连回来  需要发送加载完毕
     */
    sendReadyOK: function() {
        DeskData.Instance().lockScene();
        var msg = new cc.pb.jinzhoumj.jinzhou_req_reloading_ok();
        cc.gateNet.Instance().sendMsg(cc.netCmd.jinzhoumj.cmd_jinzhou_req_reloading_ok, msg, "jinzhou_req_reloading_ok");
        this.initGuiZeInfo();
    },

    onKeyDown: function(event) {
        if (event.keyCode == cc.KEY.back || event.keyCode == cc.KEY.escape) {
            var msg = {};
            msg.status = 0;
            if (!this.resultView) {
                DeskED.notifyEvent(DeskEvent.LEAVE_TIPS, msg);
            }
        }
    },

    jiesuan: function(data) {
        cc.log("结算ui弹出----------》jzjbc");
        if (this.fenzhang) {
            this.fenzhang.node.active = false;
        }

        if (this._jiesuan) {
            this._jiesuan.close();
            this._jiesuan = null;
        }

        var self = this;
        if (this.jiesuan_TimeID) {
            this.unschedule(this.jiesuan_TimeID);
        }
        this.da_pai_prompt.active = false;

        let waitTime = cc._needShowDrop ? 4 : 0;

        this.lastJiesuan = data[0];

        cc.dd.mj_game_start = false;

        this.jiesuan_TimeID = this.scheduleOnce(function() {
            cc.log("结算ui延时弹出----------》jzjbc  " + data);
            if (!data || !data[0]) {
                return;
            }

            if(DeskData.Instance().getIsStart() && data[1] !== true){
                return;
            }

            if (cc.director.getScene().name == 'jzmj_py_game' ||
                cc.director.getScene().name == 'jzmj_jbc_game') {
                cc.dd.UIMgr.destroyUI(jlmj_prefab.JLMJ_JIAOPAI_INFO);
                cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_JIESUAN, function(ui) {
                    var jlmj_jiesuan = ui.getComponent("jlmj_jiesuan_ui");
                    jlmj_jiesuan.showJianYiLayer(data[0], 20, function() {
                        self._jiesuan = null;
                    }.bind(self), data[1]);
                    self._jiesuan = jlmj_jiesuan;
                    AudioManager.playSound(jlmj_audio_path.JIESUAN);

                    if (DeskData.Instance().isJBC()) {
                        cc.find("Canvas/toppanel/messageBtn").getComponent(cc.Button).interactable = false;
                        //判断是否破产停止倒计时
                        var room_item = game_room.getItem(function(item) {
                            return item.gameid == RoomMgr.Instance().gameId && item.roomid == RoomMgr.Instance().roomLv;
                        });

                        if (room_item && HallPropData.getCoin() < room_item.entermin) {
                            cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_XIAOQIAN, function(ui) {
                                var mj_huaqian = ui.getComponent("mj_huaqian");
                                mj_huaqian.setEntermin(room_item.entermin);
                                ui.zIndex = UIZorder.MJ_LAYER_TOP;
                                jlmj_jiesuan.stopTime();
                            });
                        }
                    }else if(DeskData.Instance().isFriend()){
                        if(DeskData.Instance().isDajiesuan){
                            self.result_TimeID = setTimeout(function () {
                                self.on_show_result_view();
                            }.bind(self), 2000);
                        }
                    }
                }.bind(self));
            }
        }, waitTime);
    },

    /**
     * 发牌
     */
    fapai: function() {
        let ani = this.use2D ? "jlmj_fapai_ani_2d" : "jlmj_fapai_ani";

        cc.find("Canvas/desk_node").getComponent(cc.Animation).play(ani);
        cc.find("Canvas/desk_node").getComponent(cc.Animation).setCurrentTime(0, ani);
        this.db_duiju = cc.find("Canvas/kai_ju_ani").getComponent(dragonBones.ArmatureDisplay);
        this.db_duiju.node.active = true;
        this.db_duiju.playAnimation("DJKS", 1);
        this.db_duiju.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onPlayDuiJuAniEnd, this);
        this.db_duiju.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onPlayDuiJuAniEnd, this);
    },

    /**
     * 播放分张特效
     */
    fen_zhang_ani: function() {
        cc.log('【分张动画播放】 开始');
        DeskData.Instance().fenzhangCount = 0;
        if (!this.fenzhang) {
            this.fenzhang = cc.instantiate(this.prefab_fenzhang).getComponent('jlmj_fenzhang');
            this.fenzhang.initData(playerMgr.Instance().playerList);
            this.fenzhang.node.parent = this.node;
        }
        this.fenzhang.node.active = true;
        this.fenzhang.playAni();
        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('jzmj_player_down_ui');
        player_down_ui.setFenPaiTouched(true);
    },

    /**
     * 删除分张牌
     * @param index 下标
     */
    mo_pai_fen_zhang: function() {
        if (this.fenzhang) {
            this.fenzhang.getPai();
        }
    },

    // 离开状态
    // --------------------------------
    // @param msg [object] 数据层发来的数据
    leave_tips: function(data) {
        var txt = "";
        var callfunc = null;

        if (DeskData.Instance().isFriend()) {//朋友场
            if (DeskData.Instance().isDajiesuan) {//已经结束大结算
                jzmj_util.enterHall();
            } else if (DeskData.Instance().isGameStart) {//已经开始游戏
                txt = Text.TEXT_LEAVE_ROOM_2;
                callfunc = this.py_dissolve_room_req;
            } else {//未开始游戏
                //判断房主和玩家提示不一样
                if (RoomMgr.Instance().isRoomer(cc.dd.user.id)) {
                    txt = Text.TEXT_LEAVE_ROOM_1 + "\n" + Text.TEXT_LEAVE_ROOM_5;
                } else {
                    txt = Text.TEXT_LEAVE_ROOM_3;
                }
                callfunc = this.py_leave_room_req;
            }
        } else if (DeskData.Instance().isJBC()) {//金币场
            if (data.status == 7) {
                this.jbc_matching_leave_room_req();
            } else if (jzmj_desk_data_jbc.getInstance().getIsMatching() || DeskData.Instance().player_read_gamne) {//取消匹配状态
                txt = Text.TEXT_LEAVE_ROOM_3;
                callfunc = this.jbc_matching_leave_room_req;
            } else if (jzmj_desk_data_jbc.getInstance().getIsStart()) {//游戏中退出游戏
                if (this._jiesuan) {//游戏中并结算中退出游戏
                    txt = Text.TEXT_LEAVE_ROOM_3;
                    callfunc = this.jbc_matching_leave_room_req;
                } else {//游戏中退出游戏
                    txt = cc.dd.Text.TEXT_LEAVE_ROOM_3 + "\n" + cc.dd.Text.TEXT_LEAVE_ROOM_6;
                    callfunc = this.jbc_gamestart_leave_room_req;
                }
            } else {
                jzmj_util.enterHall();
            }
        } else if (DeskData.Instance().isReplay()) {

        }
        if (callfunc != null) {
            this.popViewTips(txt, callfunc, PopupType.OK_CANCEL);
        }
    },

    //朋友场离开未开始
    py_leave_room_req: function() {
        cc.log("【UI】发送离开 朋友场离开未开始");
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
        gameInfoPB.setRoomId(RoomMgr.Instance().roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    //朋友场离开已开始
    py_dissolve_room_req: function() {
        cc.log("【UI】发送离开 朋友场离开已开始 发起解散房间请求");
        var msg = new cc.pb.jinzhoumj.jinzhou_req_sponsor_dissolve_room();
        msg.setSponsorid(dd.user.id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.jinzhoumj.cmd_jinzhou_req_sponsor_dissolve_room, msg, "jinzhou_req_sponsor_dissolve_room");
    },

    //金币场匹配中离开
    jbc_matching_leave_room_req: function() {
        cc.log("【UI】发送离开 金币场未开始离开");
        // 取消匹配状态
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
        gameInfoPB.setRoomId(RoomMgr.Instance().roomLv);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);

        // jzmj_util.enterHall();
    },

    //金币场开始游戏中退出房间
    jbc_gamestart_leave_room_req: function() {
        cc.log('发送离开 3');
        var msg = new cc.pb.room_mgr.msg_leave_game_req();

        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
        gameInfoPB.setRoomId(RoomMgr.Instance().roomLv);

        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
        // jzmj_util.enterHall();
    },

    // 发起解散房间
    // --------------------------------
    // @param msg [object] 数据层发来的数据
    sponsorDissolveRoom: function(msg) {
        this.closePopupView();
        let jiesan_ui = cc.dd.UIMgr.getUI(jlmj_prefab.JLMJ_JIESAN);
        let mj_zhangji = cc.dd.UIMgr.getUI(jlmj_prefab.MJ_ZHANJITONGJI);
        if (!jiesan_ui && !mj_zhangji) {
            cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_JIESAN, function(ui) {
                ui.zIndex = UIZorder.MJ_LAYER_POPUP;
            });
        } else if (jiesan_ui && !jiesan_ui.active) {
            cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_JIESAN, function(ui) {
                ui.zIndex = UIZorder.MJ_LAYER_POPUP;
            });
        }
    },

    // 响应解散房间
    // --------------------------------
    // @param msg [object] 数据层发来的数据
    responseDissolveRoom: function(msg, isGoHall) {
        var jiesan_ui = cc.dd.UIMgr.getUI(jlmj_prefab.JLMJ_JIESAN);
        if (jiesan_ui) {
            jiesan_ui.getComponent("jlmj_sponsor_dissolve_view").updateAgreeUI();
        }
    },

    onPlayDuiJuAniEnd: function() {
        cc.find("Canvas/kai_ju_ani").active = false;
    },

    /**
     * 打开宝牌
     */
    open_bao_pai: function() {
        var baoPaiValue = DeskData.Instance().unBaopai;
        cc.log("宝牌值:", baoPaiValue);
        if (baoPaiValue >= 0) {
            cc.find("Canvas/desk_node/baopai").active = true;
            this.baopai.node.active = true;

            let use2D = DeskData.Instance().getIs2D();

            if (use2D) {
                this.baopai.frame.spriteFrame = this.spf_baopai_ming_2d;
                this.baopai.value.node.skewX = 0;
                this.baopai.value.node.skewY = 0;
                this.baopai.value.node.x = 0;
                this.baopai.value.node.y = 10;
                this.baopai.value.node.anchorX = 0.5;
                this.baopai.value.node.anchorY = 0.5;
            } else {
                this.baopai.frame.spriteFrame = this.spf_baopai_ming;
                this.baopai.value.node.skewX = -3;
                this.baopai.value.node.skewY = 1;
                this.baopai.value.node.x = 4;
                this.baopai.value.node.y = 17;
                this.baopai.value.node.anchorX = 0.6;
                this.baopai.value.node.anchorY = 0.6;
            }

            // this.baopai.frame.spriteFrame = this.spf_baopai_ming;
            this.baopai.value.node.active = true;
            this.baopai.setValue(baoPaiValue);
        }
    },
    on_player_HuangZhuang_ani_begin: function() {
        this.da_pai_prompt.active = false;
        // cc.find("Canvas/huang_zhuang_ani").active = true;
        this.huangzhuang = cc.find("Canvas/huang_zhuang_ani").getComponent(sp.Skeleton);
        // this.huangzhuang.playAnimation("HZ", 1);
        // this.huangzhuang.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.on_player_HuangZhuang_ani_end, this);
        // this.huangzhuang.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.on_player_HuangZhuang_ani_end, this);
        this.playSpine(this.huangzhuang, ['huangzhuang']);
    },
    on_player_HuangZhuang_ani_end: function() {
        cc.find("Canvas/huang_zhuang_ani").active = false;
    },

    on_room_ready: function(msg) {
        if(jzmj_desk_data_jbc.getInstance().getIsStart()){
            let playerList = playerMgr.Instance().playerList;
            playerList.forEach(function (playerMsg,idx) {
                if(playerMsg&&playerMsg.userid){
                    var pd = playerMgr.Instance().getPlayer(playerMsg.userid);
                    pd.setReady(0);
                }
            },this);
        }

        if (msg.retCode !== 0) {
            var str = "";
            switch (msg.retCode) {
                case 1:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_8;
                    this.popupEnterHall(str, jzmj_util.enterHall.bind(jzmj_util));
                    break;
                case 2:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_9;
                    this.popupEnterHall(str, jzmj_util.enterHall.bind(jzmj_util));
                    break;
                case 3:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_11;
                    this.popupEnterHall(str, null);
                    break;
                case 4:
                    str = cc.dd.Text.TEXT_POPUP_20;
                    this.popupEnterHall(str, jzmj_util.enterHall.bind(jzmj_util));
                    break;
                case 5:
                    str = cc.dd.Text.TEXT_POPUP_16;
                    this.popupEnterHall(str, jzmj_util.enterHall.bind(jzmj_util));
                    break;
                default:
                    break;
            }
        }
    },

    on_room_leave: function(msg) { },

    popupEnterHall: function(text, callfunc) {
        cc.dd.DialogBoxUtil.show(0, text, '确定', null, function() {
            if(callfunc){
                callfunc();
            }
        }, function() { });
    },

    // 弹出离开房间确认框
    // --------------------------------
    // @param msg [object] 数据层发来的数据
    // @param callback [object] 确定后的回调函数
    // @param type [enum] 弹窗类型
    popViewTips: function(msg, callback, type) {
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function(ui) {
            this.popupViewPrefab = ui;
            ui.zIndex = UIZorder.MJ_LAYER_POPUP;
            ui.getComponent("jlmj_popup_view").show(msg, callback, type, function() {
                this.popupViewPrefab = null;
            }.bind(this));
        }.bind(this));
    },

    py_ready: function() {
        cc.dd.mj_game_start = true;

        var msg = new cc.pb.jinzhoumj.jinzhou_req_ready();
        cc.gateNet.Instance().sendMsg(cc.netCmd.jinzhoumj.cmd_jinzhou_req_ready, msg, "jinzhou_req_ready");
    },

    setTingPaiUIActive: function(active) {
        this.tingPaiBtn = cc.find("Canvas/desk_node/jlmj_player_down_ui/tingButton");
        this.tingPaiBtn ? this.tingPaiBtn.active = active : null;
    },

    //更新玩家ui
    update_player_info: function() {
        if (!RoomMgr.Instance().player_mgr || !DeskData.Instance().isFriend()) {
            return;
        }
        var player_list = RoomMgr.Instance().player_mgr.playerList;
        for (var i in player_list) {
            if (!player_list[i]) {
                continue;
            }
            if (player_list[i].viewIdx == 0) {
                cc.find("Canvas/desk_node/jlmj_player_down_ui").active = true;
                cc.find("Canvas/desk_node/down_head_button").active = true;
            }
            if (player_list[i].viewIdx == 1) {
                cc.find("Canvas/desk_node/jlmj_player_right_ui").active = true;
                cc.find("Canvas/desk_node/right_head_button").active = true
                cc.find("Canvas/desk_node/mj_playerHead_right").active = true;
            }
            if (player_list[i].viewIdx == 2) {
                cc.find("Canvas/desk_node/jlmj_player_up_ui").active = true;
                cc.find("Canvas/desk_node/up_head_button").active = true;
                cc.find("Canvas/desk_node/mj_playerHead_up").active = true;
            }
            if (player_list[i].viewIdx == 3) {
                cc.find("Canvas/desk_node/jlmj_player_left_ui").active = true;
                cc.find("Canvas/desk_node/left_head_button").active = true;
                cc.find("Canvas/desk_node/mj_playerHead_left").active = true;
            }
        }

        this.zhinan.getComponent("jzmj_zhinan_ui").initDirection();
        var play_list = cc.find('Canvas/player_list').getComponent('jzmj_player_list');
        //play_list.playerUpdateUI();
        play_list.refreshGPSWarn();
    },

    /**
     * 玩家数量更新
     */
    update_player_num: function(data) {
        //更新准备和邀请按钮
        if (data == RoomMgr.Instance()._Rule.usercountlimit) {
            cc.find("Canvas/toppanel/btn_invite").active = false;
            // cc.find("Canvas/toppanel/btn_inviteXL").active = false;
            this.setFriendGroupInvite(cc.find("Canvas/toppanel/btn_invite").active);
        }
        else {
            cc.find("Canvas/toppanel/btn_invite").active = true;
            // cc.find("Canvas/toppanel/btn_inviteXL").active = true;
            // this.setFriendGroupInvite(cc.find("Canvas/toppanel/btn_invite").active);
        }
    },

    /**
     * 更新宝牌
     * @param baoPaiValue 宝牌的值 如果为null就去取数据层的数据
     * -2指没有宝牌-1宝牌盖着，其他为宝牌位置
     */
    update_bao_pai: function() {

        if (UserPlayer.Instance().bready == 1) {  //只能用ready 现在没有游戏开始未开始字段
            cc.log('游戏未开始,宝牌隐藏');
            cc.find("Canvas/desk_node/baopai").active = false;
            this.baopai.node.active = false;
            return;
        }
        var baoPaiValue = DeskData.Instance().unBaopai;
        cc.log("更新宝牌UI,宝牌值=", baoPaiValue);
        //-2指没有宝牌-1宝牌盖着，其他为宝牌位置
        if (baoPaiValue == -2) {
            cc.find("Canvas/desk_node/baopai").active = false;
            this.baopai.node.active = false;
        } else if (baoPaiValue == -1) {
            cc.find("Canvas/desk_node/baopai").active = true;
            this.baopai = cc.find("Canvas/desk_node/baopai").getComponent("jlmj_pai");
            this.baopai.node.active = true;

            let use2D = DeskData.Instance().getIs2D();

            if (use2D) {
                this.baopai.frame.spriteFrame = this.spf_baopai_an_2d;
            } else {
                this.baopai.frame.spriteFrame = this.spf_baopai_an;
            }

            // this.baopai.frame.spriteFrame = this.spf_baopai_an;
            this.baopai.value.node.active = false;
        } else {
            cc.find("Canvas/desk_node/baopai").active = true;
            this.baopai.node.active = true;

            let use2D = DeskData.Instance().getIs2D();

            if (use2D) {
                this.baopai.frame.spriteFrame = this.spf_baopai_ming_2d;
                this.baopai.value.node.skewX = 0;
                this.baopai.value.node.skewY = 0;
                this.baopai.value.node.x = 0;
                this.baopai.value.node.y = 10;
                this.baopai.value.node.anchorX = 0.5;
                this.baopai.value.node.anchorY = 0.5;
            } else {
                this.baopai.frame.spriteFrame = this.spf_baopai_ming;
                this.baopai.value.node.skewX = -3;
                this.baopai.value.node.skewY = 1;
                this.baopai.value.node.x = 4;
                this.baopai.value.node.y = 17;
                this.baopai.value.node.anchorX = 0.6;
                this.baopai.value.node.anchorY = 0.6;
            }

            // this.baopai.frame.spriteFrame = this.spf_baopai_ming;
            this.baopai.value.node.active = true;
            this.baopai.setValue(baoPaiValue);
        }
    },
    /**
     * 更新剩余牌数
     * @param cardNum 牌数量 如果为null就去取数据层的数据
     */
    update_remain_card: function(cardNum) {
        if (!cardNum) {
            cardNum = DeskData.Instance().remainCards;
        }
        if (DeskData.Instance().isGameStart) {
            cc.find("Canvas/toppanel/desk_leftinfo_fun/leftInfo/pai_num").getComponent(cc.Label).string = cardNum;
        }
    },

    /**
     * 更新房号
     * @param roomNum 房号 如果为null就去取数据层的数据
     */
    update_room_num: function(roomNum) {
        if (!roomNum) {
            roomNum = DeskData.Instance().roomNumber;
        }
        if (cc.find("Canvas/room_num") != null && cc.find("Canvas/room_num/room_id") != null) {
            cc.find("Canvas/room_num").active = true;
            cc.find("Canvas/room_num/room_id").getComponent(cc.Label).string = roomNum;
        }
    },

    update_round: function(data) {
        this.update_curr_round();
        this.curr_round_tips(data);
    },
    /**
     * 更新当前圈数
     * @param currValue 当前圈数 如果为null就去取数据层的数据
     */
    update_curr_round: function(currValue) {
        if (!currValue) {
            currValue = DeskData.Instance().currPlayCount;
        }
        cc.find("Canvas/toppanel/desk_leftinfo_fun/leftInfo/quanshu").getComponent(cc.Label).string = currValue;
    },

    curr_round_tips: function(data) {
        var text = playerMgr.Instance().playerList.length != 4 ? cc.dd.Text.TEXT_DESK_INFO_7 : cc.dd.Text.TEXT_DESK_INFO_1;
        var str = text.format([data[0]]);
        this.showTipsPop(str);
    },

    /**
     * 显示提示
     * @param event
     * @param data
     */
    showTipsPop: function(str) {
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TIPS_POP, function(ui) {
            ui.getComponent('jlmj_tips_pop').setText(str);
            ui.zIndex = UIZorder.MJ_LAYER_POPUP;
        }.bind(this));
    },
    /**
     * 更新总圈数
     * @param totalValue 总圈数 如果为null就去取数据层的数据
     */
    update_total_round: function(totalValue) {
        if (!totalValue) {
            totalValue = DeskData.Instance().totalPlayCount;
        }
        cc.find("Canvas/toppanel/desk_leftinfo_fun/leftInfo/quanshu/zong_ju").getComponent(cc.Label).string = totalValue;
    },
    on_show_da_pai_prompt: function(data) {
        if (data[1] != null && this.da_pai_prompt) {
            if (data[0] == -1 && this.dapai_tip_type == 0 && data[1] == false) {
                return;
            }
            if (data[0] == -2 && this.dapai_tip_type == 1 && data[1] == false) {
                return;
            }
            this.dapai_tip_type = data[0];
            this.da_pai_prompt.active = data[1];
            var text_arr = [Text.TEXT_MJ_DESK_INFO_0, Text.TEXT_MJ_DESK_INFO_7];
            this.da_pai_prompt_label.string = text_arr[data[0]];
        }
    },
    /**
     * 准备
     */
    onRead: function() {
        jlmj_audio_mgr.com_btn_click();

        cc.dd.mj_game_start = true;

        // 已经开始 区分发给房间管理器协议，还是游戏内的协议
        if (DeskData.Instance().isGameStart) {
            var msg = new cc.pb.jinzhoumj.jinzhou_req_ready();
            cc.gateNet.Instance().sendMsg(cc.netCmd.jinzhoumj.cmd_jinzhou_req_ready, msg, "jinzhou_req_ready");
        } else {
            var msg = new cc.pb.room_mgr.msg_prepare_game_req();
            var gameInfoPB = new cc.pb.room_mgr.common_game_header();
            gameInfoPB.setGameType(RoomMgr.Instance().gameId);
            gameInfoPB.setRoomId(RoomMgr.Instance().roomId);
            msg.setGameInfo(gameInfoPB);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req, msg, "msg_prepare_game_req", true);
        }

    },
    /**
     * 获取文字玩法
     */
    getTextByWanFa: function() {
        var text = "";
        var cur_rule = RoomMgr.Instance()._Rule;
        let fd = [0, 100, 200, 300, 150];
        this.gz_arr_box = [];
        this.gz_arr_box.push(cc.dd.Text.TEXT_PY_RULE_89.format([cur_rule.usercountlimit]));
        this.gz_arr_box.push(Text.TEXT_PY_RULE_39.format([fd[cur_rule.fengdingtype]]));
        this.gz_arr_box.push(cur_rule.isdaihun ? Text.TEXT_PY_RULE_90 : '');
        // this.gz_arr_box.push(cur_rule.isqionghujiafan ? Text.TEXT_PY_RULE_91 : '');
        this.gz_arr_box.push(cur_rule.isqidui ? Text.TEXT_PY_RULE_27 : '');
        this.gz_arr_box.push(cur_rule.isqingyise ? Text.TEXT_PY_RULE_29 : '');
        this.gz_arr_box.push(cur_rule.is3qing ? Text.TEXT_PY_RULE_92 : '');
        this.gz_arr_box.push(cur_rule.is4qing ? Text.TEXT_PY_RULE_93 : '');
        this.gz_arr_box.push(cur_rule.isjiehu ? Text.TEXT_PY_RULE_127 : '');

        text = this.gz_arr_box.join(',');
        return text;
    },

    /**
     * 邀请微信好友
     */
    onInvaite: function(event, custom) {
        if (event.type != "touchend") {
            return;
        }
        jlmj_audio_mgr.com_btn_click();
        var title = Text.TEXT_PY_RULE_89.format(playerMgr.Instance().playerList.length);
        title += " " + "房间号:" + (RoomMgr.Instance().roomId || 888888);
        var content = '共' + RoomMgr.Instance()._Rule.boardscout + '' + (RoomMgr.Instance()._Rule.usercountlimit != 4 ? '局' : '圈');
        content += " " + this.getTextByWanFa();
        if (cc.sys.isNative) {
            // cc.dd.native_wx.SendAppContent(DeskData.Instance().roomNumber, title, content, Platform.GetAppUrl(AppCfg.GAME_PID, AppCfg.PID));
            let wanFa = this.gz_arr_box.slice();
            let wanFaTitle = wanFa.shift();

            let playerList = playerMgr.Instance().getPlayerList();
            let playerName = [];
            playerList.forEach(function (playerMsg) {
                if(playerMsg&&playerMsg.userId){
                    playerName.push(playerMsg.name);
                }
            },this);

            let info = {
                gameid: RoomMgr.Instance().gameId,//游戏ID
                roomid: RoomMgr.Instance().roomId,//房间号
                title: wanFaTitle,//房间名称
                content: wanFa,//游戏规则数组
                usercount: RoomMgr.Instance()._Rule.usercountlimit,//人数
                jushu: RoomMgr.Instance()._Rule.boardscout,//局\圈数
                jushutitle: RoomMgr.Instance()._Rule.usercountlimit!=4 ? '局数' : '圈数',//局\圈标题，默认局数
                playername: playerName,//玩家姓名数组
                gamestate: '未开始',//游戏状态
            }

            if(custom == 'XL'){
                var login_module = require('LoginModule');
                var url = Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100);
                cc.dd.native_wx.sendXlLink(title, content, url);
            }else{
                cc.dd.native_wx.SendAppInvite(info, title, content,  Platform.wxShareGameUrl[AppCfg.PID]);
            }
        }
        cc.log(title);
        cc.log(content);
    },

    onTingPaiTouch: function() {
        var UserPlayer = require('jzmj_userPlayer_data').Instance();
        var jiaoInfo = UserPlayer.curJiaoPaiInfo();
        var ui_jiaoinfo = cc.dd.UIMgr.getUI(jlmj_prefab.JLMJ_JIAOPAI_INFO);
        if (this.mj_jiao_info && ui_jiaoinfo && ui_jiaoinfo.active) {
            this.mj_jiao_info.onClickClose();
            this.mj_jiao_info = null;
            return;
        }
        if (jiaoInfo != null) {
            cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_JIAOPAI_INFO, function(ui) {
                var play_list = cc.find('Canvas/player_list').getComponent('jzmj_player_list');
                this.mj_jiao_info = ui.getComponent('mj_jiao_info');
                this.mj_jiao_info.init(play_list);
                this.mj_jiao_info.setJiaoPaiList(jiaoInfo);
                this.mj_jiao_info.showMask(true);
            }.bind(this));
        }
    },

    /**
     * 显示战绩统计
     */
    on_show_result_view: function() {
        if(!DeskData.Instance().isInMaJiang()){
            return;
        }
        var self = this;
        if(this._jiesuan){
            this._jiesuan.node.active = false;
        }
        cc.dd.UIMgr.openUI(jlmj_prefab.MJ_ZHANJITONGJI, function(ui) {
            var fj_arr = [];
            var juquan_txt = RoomMgr.Instance()._Rule.usercountlimit != 4 ? Text.TEXT_PY_RULE_10 : Text.TEXT_PY_RULE_11;
            fj_arr.push(Text.TEXT_PY_RULE_89.format([RoomMgr.Instance()._Rule.usercountlimit]));
            fj_arr.push(Text.TEXT_PY_RULE_12 + RoomMgr.Instance().roomId);
            fj_arr.push(juquan_txt.format([RoomMgr.Instance()._Rule.boardscout]));

            var fjinfo = fj_arr.join(' ');
            var gzinfo = Text.TEXT_PY_RULE_13 + this.gz_arr_box.filter(function(txt) { return txt != '' }).join(',');
            var playerList = playerMgr.Instance().playerList;
            var tongjiData = DeskData.Instance().getTongjiData();

            self.resultView = ui;
            ui.zIndex = UIZorder.MJ_LAYER_POPUP;
            var mj_zhanjitongji = ui.getComponent("mj_zhanjitongji");
            mj_zhanjitongji.init(fjinfo, gzinfo, playerList, tongjiData, function() {
                if (DeskData.Instance().isFriend()) {
                    jzmj_util.enterHall();
                }
            }, DeskData.Instance().isDajiesuan, ()=>{
                if(this._jiesuan){
                    this._jiesuan.node.active = true;
                }
            });
        }.bind(this));
    },

    set_read: function(readyId) {
        cc.log("----准备按键隐藏----");
        var selfId = dd.user.id;
        DeskData.Instance().player_read_gamne = true;
        if (readyId === selfId && cc.find("Canvas/toppanel/btn_ready")) {
            cc.find("Canvas/toppanel/btn_ready").active = false;
        }
    },

    //更新金币
    hallUpdateCoin: function() {
        if(DeskData.Instance().isFriend()){
            return;
        }
        const hall_prop_data = require('hall_prop_data').HallPropData.getInstance();
        var coin = hall_prop_data.getCoin();
        var player = playerMgr.Instance().getPlayer(cc.dd.user.id);
        if (player) { player.setCoin(coin); }
    },

    update_hall_data: function(msg) {
        var jiesuan_ui = cc.dd.UIMgr.getUI(jlmj_prefab.JLMJ_JIESUAN);
        if (jiesuan_ui && jiesuan_ui.active) {
            cc.log("存在结算界面时,不返回大厅");
            return;
        }

        // cc.dd.DialogBoxUtil.show(0, "本局游戏未开始或已结束", '确定', null,
        //     function() {
                // 返回大厅
                playerMgr.Instance().clear();
                jzmj_util.enterHall();
        //     },
        //     function() {
        //     }
        // );
    },

    onEventMessage: function(event, data) {
        if (cc.replay_gamedata_scrolling) {
            return;
        }
        switch (event) {
            case DeskEvent.CHANGE_ROOM://换桌
                this.change_room();
                break;
            case DeskEvent.CLEAR://清理桌子
                this.clear(data);
                break;
            case DeskEvent.CHANGE_DESK_IMAGE:
                this.change_desk_image(data);
                break;
            case DeskEvent.SPONSOR_DISSOLVE_ROOM://发起解散房间
                this.sponsorDissolveRoom(data[0]);
                break;
            case DeskEvent.RESPONSE_DISSOLVE_ROOM://响应解散房间
                this.responseDissolveRoom(data[0]);
                break;
            case DeskEvent.FAPAI://发牌
                this.fapai();
                break;
            case DeskEvent.FEN_ZHANG:
                this.fen_zhang_ani();
                break;
            case DeskEvent.MO_PAI_FEN_ZHANG:
                this.mo_pai_fen_zhang(data);
                break;
            case DeskEvent.EXIT_ROOM:
                this.exitRoom(data);
                break;
            case DeskEvent.HUANG_ZHUANG_ANI://荒庄动画
                this.on_player_HuangZhuang_ani_begin();
                break;
            case Hall.HallEvent.ACTIVE_PROPITEM_GET:
                cc.dd.UIMgr.openUI("gameyj_hall/prefabs/klb_hall_Active_Award", function(prefab) {
                    var component = prefab.getComponent('klb_hall_daily_lottery_get_award');
                    component.setAwradData(data.value);
                }.bind(this));
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                cc.log("jzmj  响应------> HallCommonEvent.HALL_NO_RECONNECT_GAME");
                this.update_hall_data(data[0]);
                break;
            case HallCommonEvent.HALL_UPDATE_ASSETS:
                this.hallUpdateCoin();
                break;
            case HallCommonEvent.LUCKY_STOP_TIMER:
                if (this._jiesuan) {
                    this._jiesuan.stopTime();
                }
                break;
            case HallCommonEvent.LUCKY_RESUME_TIMER:
                if (this._jiesuan) {
                    this._jiesuan.startTime(this._jiesuan._daojishiNum);
                }
                break;
            case DeskEvent.PY_READY://朋友场准备
                this.py_ready();
                break;
            case DeskEvent.JIESUAN://弹出结算界面
                this.jiesuan(data);
                break;
            case DeskEvent.LEAVE_TIPS://解散提示
                this.leave_tips(data);
                break;
            case DeskEvent.OPEN_BAO_PAI://打开宝牌
                this.open_bao_pai();
                break;
            case RoomEvent.on_room_enter://进入房间
                this.recoverDesk();
                break;
            case RoomEvent.on_room_ready://房间准备成功
                this.on_room_ready(data[0]);
                break;
            case RoomEvent.on_room_leave:
                this.on_room_leave(data[0]);
                break;
            case PlayerEvent.READY://玩家准备
                this.set_read(data[0].userId);
                break;
            case DeskEvent.RECOVER_DESK://恢复桌子
                cc.log("jzmj 朋 友 recover_desk------ 开始0");
                this.recoverDesk();
                break;
            case DeskEvent.START://开始游戏
                this.hide_desk_ready();
                break;
            case DeskEvent.SHOW_RESULT_VIEW: //显示战绩统计
                if(DeskData.Instance().isDajiesuan){
                    if(data && data[0]){
                        this.on_show_result_view();
                    }
                }else{
                    this.on_show_result_view();
                }
                break;
            case DeskEvent.UPDATE_PLAYER_NUM://更新目前房间人数
                this.update_player_num(data);
                this.update_player_info();
                break;
            case DeskEvent.UPDATE_ROOM_NUM://更新房间号
                this.update_room_num();
                break;
            case DeskEvent.UPDATE_BAO_PAI://更新宝牌
                this.update_bao_pai();
                break;
            case DeskEvent.UPDATE_REMAIN_CARD://更新剩余牌数
                this.update_remain_card();
                break;
            case DeskEvent.UPDATE_CURR_ROUND://更新当前圈数
                this.update_round(data);
                break;
            case DeskEvent.UPDATE_TOTAL_ROUND://更新总共圈数
                this.update_total_round();
                break;
            case DeskEvent.SHOW_DA_PAI_PROMPT://更新三色以及手把一提示
                this.on_show_da_pai_prompt(data);
                break;
            case DeskEvent.TIMEUP:
                if (!this._jiesuan) {
                    this.time_up_id = AudioManager.playSound(jlmj_audio_path.TIMEUP);
                }
                break;
            case DeskEvent.STOP_TIMEUP:
                if (this.time_up_id) {
                    AudioManager.stopSound(this.time_up_id);
                    this.time_up_id = null;
                }
                break;
            case SysEvent.PAUSE:
                cc.log("SysEvent.PAUSE 锦州麻将: 游戏切后台");
                DeskED.notifyEvent(DeskEvent.CANCEL_EMIT, []);//取消已选的操作 如；杠 听
                this.onLockSceneTouch();
                break;
            case SysEvent.RESUME:
                cc.log("SysEvent.PAUSE 锦州麻将: 恢复游戏");
                // AudioManager.rePlayMusic();
                this.locakSceneTimeOut = setTimeout(()=>{
                    this.onUnlockSceneTouch();
                    this.locakSceneTimeOut = null;
                }, 500);
                break;
            case DeskEvent.CHANGE_2D:
                this.change2D();
                break;
            case DeskEvent.HU:
                this.huAni(data[0]);
                break;
            case DeskEvent.LOCK_SCENE:
                this.onLockSceneTouch();
                break;
            case DeskEvent.UNLOCK_SCENE:
                this.onUnlockSceneTouch();
                if(this.locakSceneTimeOut){
                    clearTimeout(this.locakSceneTimeOut);
                    this.locakSceneTimeOut = null;
                }
                break;
            default:
                break;
        }
    },

    change2D() {
        if (cc.dd.mj_game_start) {
            cc.dd.mj_change_2d_next_time = true;
            cc.dd.PromptBoxUtil.show('游戏已开始，将在下一局切换');
            return;
        }

        this._change2D();
    },

    _change2D() {
        this.use2D = cc.sys.localStorage.getItem(cc.dd.AppCfg.GAME_ID + '_' + cc.dd.user.id + '_use2D') === 'true';

        this.initLocalData();

        let zhinanIsActive = this.zhinan.active;
        if (this.use2D) {
            this.zhinan = this._zhinan_2d;
            this._zhinan.active = false;
            this._zhinan_2d.active = zhinanIsActive;

            cc.find("Canvas/desk_node/baopai").y = 17.5;
        } else {
            this.zhinan = this._zhinan;
            this._zhinan.active = zhinanIsActive;
            this._zhinan_2d.active = false;
            cc.find("Canvas/desk_node/baopai").y = 42.7;

        }

        this.initZhiNan();

        if (!RoomMgr.Instance().player_mgr || !DeskData.Instance().isFriend()) {
        } else {
            this.zhinan.getComponent("jzmj_zhinan_ui").initDirection();
        }

        cc.find("Canvas/desk_node/jlmj_player_left_ui").getComponent('jzmj_player_left_ui').resetConfig();
        cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('jzmj_player_down_ui').resetConfig();
        cc.find("Canvas/desk_node/jlmj_player_right_ui").getComponent('jzmj_player_right_ui').resetConfig();
        cc.find("Canvas/desk_node/jlmj_player_up_ui").getComponent('jzmj_player_up_ui').resetConfig();
    },

    huAni(data){
        let delaytime = 2000;
        let huType = data;
        let huID = null;
        let func = ()=>{
            huID = null;
            if(huType.length > 0){
                huID = this.getHuAni(huType.pop());
                if(!cc.dd._.isNull(huID)){
                    this.playSpine(huID[0], huID[1], ()=>{
                        playerMgr.Instance().playing_special_hu -= delaytime;

                        if(playerMgr.Instance().playing_special_hu < 0){
                            playerMgr.Instance().playing_special_hu = 0;
                        }
                        func();
                    })
                }else{
                    func();
                }
            }else{
                playerMgr.Instance().playing_special_hu = 0;
            }
        }

        func();
    },

    getHuAni(id){
        switch(id){
            case HuType.GANG_HUA_HU:
                return [this.gghh_ani, ['gangshanghua']];
            case HuType.GANG_PAO_HU:
                return [this.gghh_ani, ['gangshangpao']];
            case HuType.DANDIAO_PIAOHU:
                return [this.gghh_ani, ['haidilao']];
            // case HuType.HAIDI_PAO:
            //     return [this.gghh_ani, ['haidipao']];
            // case -1:
            //     return [this.gghh_ani, ['yipaoshuangxiang']];
            // case -2:
            //     return [this.gghh_ani, ['yipaosanxiang']];
            // case HuType.JIA5_HU:
            //     return [this.gkm_ani, ['guadafeng']];
            // case HuType.DANDIAO_PIAOHU:
            //     return [this.gkm_ani, ['kaipaizha']];
            // case HuType.DANDIAO_PIAOHU:
            //     return [this.jingoushiba_ani, ['jingoudiao']];
            // case HuType.HAO_QI:
            //     return [this.qd_ani, ['haoqidui']];
            // case HuType.HAO_QI:
            //     return [this.qd_ani, ['longqidui']];
            // case HuType.QI_DUI:
            //     return [this.qd_ani, ['qidui']];
            // case -3:
            //     return [this.qd_ani, ['qinglongqidui']];
            // case -4:
            //     return [this.qd_ani, ['qinqidui']];
            case HuType.QI_DUI:
                return [this.qd_ani, ['qixiaodui']];
            default:
                return null;
        }
    },

    playSpine(spine, animList, func){
        if(spine){
            spine.node.active = true;
            for(let i = 0; i < animList.length - 1; i++){
                spine.setMix(animList[i], animList[i+1]);
            }
            let anim = animList.shift();
            spine.setAnimation(0, anim, false);
            spine.setCompleteListener(()=>{
                if(animList.length > 0){
                    anim = animList.shift();
                    spine.setAnimation(0, anim, false);
                }else{
                    spine.node.active = false;
                    if(func){
                        func();
                    }
                }
            });
        }else if(func){
            func();
        }

    },

    setFriendGroupInvite(visible){
        let node = cc.find("Canvas/toppanel/klb_friend_group_invite_btn");
        if(node){
            if(visible){
                node.active = RoomMgr.Instance().isClubRoom();
            }else{
                node.active = false;
            }
        }
    },

    onLockSceneTouch: function () {
        if( !cc.dd.Utils.isNull( this.layer_disabled ) ) {
            this.layer_disabled.active = true;
        }
    },

    onUnlockSceneTouch: function () {
        if( !cc.dd.Utils.isNull( this.layer_disabled ) ) {
            this.layer_disabled.active = false;
        }
    },

    onClickLastJieSuan(){
        jlmj_audio_mgr.com_btn_click();
        DeskED.notifyEvent(DeskEvent.JIESUAN, [this.lastJiesuan, true]);
    },

    setLastJieSuanActive(){
        let laseJiesuan = cc.find("Canvas/toppanel/last_jie_suan");
        if(laseJiesuan){
            laseJiesuan.active = this.lastJiesuan;
        }
    },
});
module.exports = baseDeskInfo;