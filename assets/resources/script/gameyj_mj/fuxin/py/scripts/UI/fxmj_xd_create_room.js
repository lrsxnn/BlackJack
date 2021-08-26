/**
 * 选中 和 未选中 颜色定义
 * @type {{CHECK: cc.Color, UNCHECK: cc.Color}}
 */
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
var cost_room_cards_config = require('cost_room_cards');

let DefColor = {
    CHECK: cc.color(240, 93, 29),
    UNCHECK: cc.color(99, 65, 31),
    DISABLED: cc.color(153, 153, 153)
};

// const QuanShuDesc = [
//     "2圈",
//     "4圈",
//     "8圈"
// ];
//
// const JuShuDesc = [
//     "12局",
//     "24局",
//     "48局"
// ];
//
// const FangKaDesc = [
//     "(房卡X4)",
//     "(房卡X8)",
//     "(房卡X16)",
// ];
cc.Class({
    extends: cc.Component,

    properties: {
        p_rs: { default: [], type: cc.Toggle, tooltip: '人数', },
        p_qs: { default: [], type: cc.Toggle, tooltip: '圈数', },
        txt_jushu_list: [cc.Label],
        text_fangka_list: [cc.Label],
        p_jf: { default: [], type: cc.Toggle, tooltip: '积分', },
        p_fd: { default: [], type: cc.Toggle, tooltip: '封顶', },
        p_zf: { default: [], type: cc.Toggle, tooltip: '扎分', },
        p_wf: { default: [], type: cc.Toggle, tooltip: '玩法', },
        p_gz: { default: [], type: cc.Toggle, tooltip: '跟庄', },
        p_fzb: { default: null, type: cc.Toggle, tooltip: '防作弊', },
        p_club: { default: null, type: cc.Toggle, tooltip: '加入限定' },
        p_yy: { default: null, type: cc.Toggle, tooltip: '语音' },
        isClub:{default: false, tooltip: '亲友圈创建房间'},
    },

    /**
     * 显示视图 时 回调
     */
    onEnable: function () {

    },

    /**
     * 添加视图 时 回调
     */
    onLoad: function () {
        this.initData();
        this.initView();
    },

    /**
     * 销毁视图 时 回调
     */
    onDestroy: function () {
        if (this.touchTimeId) {
            clearTimeout(this.touchTimeId);
            this.touchTimeId = null;
        }
    },

    /**
     * 选择规则
     */
    onSelectRule: function (target, data) {

        var group = null;

        switch (data) {
            case "rs1":
                this.m_objRuleIndex.rs = 4;
                group = this.p_rs;

                var conf = cost_room_cards_config.getItemList(function (item) {
                    return item.id == cc.dd.Define.GameType.FXMJ_FRIEND && item.player_num == 4;
                }.bind(this));

                for (var i = 0; i < this.txt_jushu_list.length && i < conf.length; i++) {
                    this.txt_jushu_list[i].string = conf[i].circle_num + '圈';//QuanShuDesc[i];
                    this.text_fangka_list[i].string = '(房卡X' + conf[i].cost + ')';//FangKaDesc[i];
                    this.setEnableToggle(this.p_wf[5], true);
                    this.setEnableToggle(this.p_wf[4], true);

                    if (this.p_wf[4].isChecked) {
                        this.m_objRuleIndex.wf[4] = true;
                    }

                    if (this.p_wf[5].isChecked) {
                        this.setEnableToggle(this.p_gz[0], true);
                        this.setEnableToggle(this.p_gz[1], true);
                        this.m_objRuleIndex.wf[6] = true;
                    }
                }
                break;
            case "rs2":
                this.m_objRuleIndex.rs = 3;
                group = this.p_rs;

                var conf = cost_room_cards_config.getItemList(function (item) {
                    return item.id == cc.dd.Define.GameType.FXMJ_FRIEND && item.player_num == 3;
                }.bind(this));

                for (var i = 0; i < this.txt_jushu_list.length && i < conf.length; i++) {
                    this.txt_jushu_list[i].string = conf[i].circle_num + '圈';//QuanShuDesc[i];
                    this.text_fangka_list[i].string = '(房卡X' + conf[i].cost + ')';//FangKaDesc[i];
                    this.setEnableToggle(this.p_wf[5], false);
                    this.setEnableToggle(this.p_wf[4], true);

                    this.setEnableToggle(this.p_gz[0], false);
                    this.setEnableToggle(this.p_gz[1], false);

                    if (this.p_wf[5].isChecked) {
                        this.m_objRuleIndex.wf[4] = true;
                    }

                    if (this.m_objRuleIndex.wf[5]) {
                        this.m_objRuleIndex.wf[5] = false;
                    }
                }
                break;
            case "rs3":
                this.m_objRuleIndex.rs = 2;
                group = this.p_rs;

                var conf = cost_room_cards_config.getItemList(function (item) {
                    return item.id == cc.dd.Define.GameType.FXMJ_FRIEND && item.player_num == 2;
                }.bind(this));

                for (var i = 0; i < this.txt_jushu_list.length && i < conf.length; i++) {
                    this.txt_jushu_list[i].string = conf[i].circle_num + '局';//JuShuDesc[i];
                    this.text_fangka_list[i].string = '(房卡X' + conf[i].cost + ')';//FangKaDesc[i];
                    this.setEnableToggle(this.p_wf[5], false);
                    this.setEnableToggle(this.p_wf[4], false);

                    this.setEnableToggle(this.p_gz[0], false);
                    this.setEnableToggle(this.p_gz[1], false);
                    if (this.m_objRuleIndex.wf[5]) {
                        this.m_objRuleIndex.wf[5] = false;
                    }
                    if (this.m_objRuleIndex.wf[4]) {
                        this.m_objRuleIndex.wf[4] = false;
                    }
                }
                break;
            case "qs1":
                this.m_objRuleIndex.qs = 0;
                group = this.p_qs;
                break;
            case "qs2":
                this.m_objRuleIndex.qs = 1;
                group = this.p_qs;
                break;
            case "qs3":
                this.m_objRuleIndex.qs = 2;
                group = this.p_qs;
                break;
            case "jf1":
                this.m_objRuleIndex.jf = 1;
                group = this.p_jf;
                break;
            case "jf2":
                this.m_objRuleIndex.jf = 2;
                group = this.p_jf;
                break;
            case "fd1":
                this.m_objRuleIndex.fd = 1;
                group = this.p_fd;
                break;
            case "fd2":
                this.m_objRuleIndex.fd = 2;
                group = this.p_fd;
                break;
            case "fd3":
                this.m_objRuleIndex.fd = 3;
                group = this.p_fd;
                break;
            case "g_zf1":
                this.m_objRuleIndex.zf = 0;
                group = this.p_zf;
                break;
            case "g_zf2":
                this.m_objRuleIndex.zf = 1;
                group = this.p_zf;
                break;
            case "g_zf3":
                this.m_objRuleIndex.zf = 2;
                group = this.p_zf;
                break;
            case "wf1":
                this.m_objRuleIndex.wf[0] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf2":
                this.m_objRuleIndex.wf[1] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf3":
                this.m_objRuleIndex.wf[2] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf4":
                this.m_objRuleIndex.wf[3] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf5":
                this.m_objRuleIndex.wf[4] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf6":
                this.m_objRuleIndex.wf[5] = target.isChecked;
                group = this.p_wf;
                this.setGZ();
                break;
            case "wf7":
                this.m_objRuleIndex.wf[6] = target.isChecked;
                group = this.p_wf;
                this.setJH();
                break;
            case "wf8":
                this.m_objRuleIndex.wf[7] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf9":
                this.m_objRuleIndex.wf[8] = target.isChecked;
                group = this.p_wf;
                break;
            case "p_gz_idx1":
                this.m_objRuleIndex.gz = 1;
                group = this.p_gz;
                break;
            case "p_gz_idx2":
                this.m_objRuleIndex.gz = 2;
                group = this.p_gz;
                break;
            case "fzb1":
                this.m_objRuleIndex.fzb = target.isChecked;
                group = this.p_fzb;
                break;
            case "yy":
                this.m_objRuleIndex.yy = target.isChecked;
                group = this.p_yy;
                break;
            case "club":
                this.m_objRuleIndex.club = target.isChecked;
                group = this.p_club;
                break;
        }

        if (group === this.p_wf || group === this.p_fzb) {
            this.setToggleColor(target, target.isChecked ? DefColor.CHECK : DefColor.UNCHECK);
        } else {
            this.initToggleColor(group);
            this.setToggleColor(target, DefColor.CHECK);
        }
    },

    /**
     * 创建房间回调
     */
    onCreate: function (event, custom) {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.FXMJ_FRIEND, cc.dd.clientAction.T_HALL.CREATE_ROOM);
        /************************游戏统计   end************************/

        if (!cc.dd.Utils.isNull(this.m_objRuleIndex)) {
            if (custom == 'daikai')
                this.sendCreateRoom(this.m_objRuleIndex, true);
            else
                this.sendCreateRoom(this.m_objRuleIndex);
        }
    },

    /**
     * 发送 创建房间
     * @param data
     */
    sendCreateRoom: function (data, isProxy) {
        if (this._touchCreate) {
            return
        }
        this._touchCreate = true;

        this.touchTimeId = setTimeout(() => {
            this._touchCreate = false;
        }, 1000);

        let gameReq = this.getRules(data, isProxy);

        cc.sys.localStorage.setItem(cc.dd.user.id + '_fxmj_create', JSON.stringify(data));

        if(club_Mgr.getClubOpenCreateUITag()){
            var req = new cc.pb.club.msg_club_create_baofang_req();
            req.setClubId(club_Mgr.getSelectClubId());
            req.setRule(gameReq);

            cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_create_baofang_req, req, 'msg_club_create_baofang_req', true);
            cc.dd.UIMgr.destroyUI('gameyj_friend/prefab/klb_friend_group_createRoom');
        }else{
            if(!cc.dd.Utils.checkGPS(gameReq)){
                cc.dd.DialogBoxUtil.show(0, "创建房间失败，无法获取定位信息", '确定', null, function () {
                }, null);
                return;
            }
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_create_game_req, gameReq, 'msg_create_game_req', true);
        }
    },

    /**
     * 设置toggle激活状态
     * @param toggle
     * @param enable
     */
    setEnableToggle: function (toggle, enable) {
        // 按钮颜色
        if (this.isEnableToggle(toggle) !== enable) {
            toggle.interactable = enable;
            toggle.enableAutoGrayEffect = !toggle.enableAutoGrayEffect;
        }

        // 文字颜色
        var color = null;
        if (enable) {
            if (this.isCheckedToggle(toggle)) {
                color = DefColor.CHECK;
            } else {
                color = DefColor.UNCHECK;
            }
        } else {
            color = DefColor.DISABLED;
        }
        this.setToggleColor(toggle, color);
    },

    /**
     * toggle是否激活
     * @param toggle
     */
    isEnableToggle: function (toggle) {
        return toggle.interactable;
    },

    /**
     * 设置toggle选中状态
     * @param toggle
     * @param checked
     */
    setCheckedToggle: function (toggle, checked) {
        if (this.isCheckedToggle(toggle) !== checked) {
            if (checked) {
                toggle.check();
            } else {
                toggle.uncheck();
            }
        }
        if (checked) {
            this.setToggleColor(toggle, DefColor.CHECK);
        } else {
            this.setToggleColor(toggle, DefColor.UNCHECK);
        }
    },

    /**
     * toggle是否选中
     * @param toggle
     */
    isCheckedToggle: function (toggle) {
        return toggle.isChecked;
    },

    /**
     * 设置房费选中
     */
    setFF: function () {
        this.initToggleColor(this.p_ff);
        switch (this.m_objRuleIndex.ff) {
            case 1:
                this.setCheckedToggle(this.p_ff[0], true);
                break;
            case 2:
                this.setCheckedToggle(this.p_ff[1], true);
                break;
        }
    },

    /**
     * 设置人数
     */
    setRS: function () {
        this.initToggleColor(this.p_rs);
        switch (this.m_objRuleIndex.rs) {
            case 4:
                this.setCheckedToggle(this.p_rs[0], true);
                break;
            case 3:
                this.setCheckedToggle(this.p_rs[1], true);
                break;
            case 2:
                this.setCheckedToggle(this.p_rs[2], true);
                break;
        }
    },

    /**
     * 设置圈数
     */
    setQS: function () {
        this.initToggleColor(this.p_qs);
        switch (this.m_objRuleIndex.qs) {
            case 2:
                this.setCheckedToggle(this.p_qs[0], true);
                break;
            case 4:
                this.setCheckedToggle(this.p_qs[1], true);
                break;
            case 8:
                this.setCheckedToggle(this.p_qs[2], true);
                break;
        }
    },

    /**
     * 设置积分类型
     */
    setJF: function () {
        this.initToggleColor(this.p_jf);
        switch (this.m_objRuleIndex.jf) {
            case 1:
                this.setCheckedToggle(this.p_jf[0], true);
                break;
            case 2:
                this.setCheckedToggle(this.p_jf[1], true);
                break;
        }
    },

    /**
     * 设置封顶
     */
    setFD: function () {
        this.initToggleColor(this.p_fd);
        switch (this.m_objRuleIndex.fd) {
            case 0:
                this.setCheckedToggle(this.p_fd[0], true);
                break;
            case 1:
                this.setCheckedToggle(this.p_fd[1], true);
                break;
            case 2:
                this.setCheckedToggle(this.p_fd[2], true);
                break;
        }
    },

    /**
     * 设置扎分
     */
    setZF: function () {
        this.initToggleColor(this.p_zf);
        switch (this.m_objRuleIndex.zf) {
            case 0:
                this.setCheckedToggle(this.p_zf[0], true);
                break;
            case 1:
                this.setCheckedToggle(this.p_zf[1], true);
                break;
            case 2:
                this.setCheckedToggle(this.p_zf[2], true);
                break;
        }
    },

    /**
     * 设置玩法
     */
    setWF: function () {
        this.initToggleColor(this.p_wf);

        this.setCheckedToggle(this.p_wf[0], this.m_objRuleIndex.wf[0]);
        this.setCheckedToggle(this.p_wf[1], this.m_objRuleIndex.wf[1]);
        this.setCheckedToggle(this.p_wf[2], this.m_objRuleIndex.wf[2]);
        this.setCheckedToggle(this.p_wf[3], this.m_objRuleIndex.wf[3]);
        this.setCheckedToggle(this.p_wf[4], this.m_objRuleIndex.wf[4]);
        this.setCheckedToggle(this.p_wf[5], this.m_objRuleIndex.wf[5]);
        this.setCheckedToggle(this.p_wf[6], this.m_objRuleIndex.wf[6]);
        this.setCheckedToggle(this.p_wf[7], this.m_objRuleIndex.wf[7]);
        this.setCheckedToggle(this.p_wf[8], this.m_objRuleIndex.wf[8]);
    },

    /**
     * 设置跟庄分
     */
    setGZ: function () {
        this.initToggleColor(this.p_gz);
        if (this.m_objRuleIndex.wf[5]) {
            this.setEnableToggle(this.p_gz[0], true);
            this.setEnableToggle(this.p_gz[1], true);
            switch (this.m_objRuleIndex.gz) {
                case 1:
                    this.setCheckedToggle(this.p_gz[0], true);
                    break;
                case 2:
                    this.setCheckedToggle(this.p_gz[1], true);
                    break;
            }
        } else {
            this.setEnableToggle(this.p_gz[0], false);
            this.setEnableToggle(this.p_gz[1], false);
        }
    },
    /**
     * 设置夹胡
     */
    setJH: function () {
        if (this.m_objRuleIndex.wf[6]) {
            this.setEnableToggle(this.p_wf[7], true);
            this.p_wf[7].isChecked = false;
            this.m_objRuleIndex.wf[7] = false;
        } else {
            this.setEnableToggle(this.p_wf[7], false);
            this.p_wf[7].isChecked = true;
            this.m_objRuleIndex.wf[7] = true;
        }
    },
    /**
     * 设置防作弊
     */
    setFZB: function () {
        if(this.p_fzb){
            this.initToggleColor(this.p_fzb);
            this.setCheckedToggle(this.p_fzb, this.m_objRuleIndex.fzb);
        }
    },

    /**
     * 设置俱乐部
     */
    setClub: function () {
        if(this.p_club){
            this.initToggleColor(this.p_club);
            this.setCheckedToggle(this.p_club, club_Mgr.getClubOpenCreateUITag());
            if (club_Mgr.getClubOpenCreateUITag()) {
                if (cc.find('commonRule/proxy', this.node))
                    cc.find('commonRule/proxy', this.node).active = false;
            }
        }
    },

    /**
     * 初始化toggle文字颜色
     * @param target {array | toggle}
     */
    initToggleColor: function (target) {
        if (typeof (target) == "object") {
            if (target instanceof Array) {
                for (var i = 0; i < target.length; ++i) {
                    var toggle = target[i];
                    if (this.isEnableToggle(toggle)) {
                        this.setToggleColor(toggle, DefColor.UNCHECK);
                    }
                }
            } else {
                this.setToggleColor(target, DefColor.UNCHECK);
            }
        }
    },

    /**
     * 设置toggle颜色
     * @param toggle
     * @param color
     */
    setToggleColor: function (toggle, color) {
        toggle.node.getChildByName("text_explain").color = color;
        var node = toggle.node.getChildByName('text_explain_count');
        if (node)
            node.color = color;
    },

    /**
     * 初始化数据
     */
    initData: function () {
        // 规则数据
        this.m_objRuleIndex = {
            // 房费
            ff: 1,
            // 圈数
            qs: 2,
            // 人数
            rs: 4,
            //积分
            jf: 1,
            //封顶
            fd: 0,
            //扎分
            zf: 1,
            // 玩法
            wf: [true, false, false, false, false, false, false, false, true],
            //跟庄
            gz: 2,
            // 防作弊
            fzb: true,
            //俱乐部限定
            club: false,
            //语音
            yy: false,
        };

        let result = cc.sys.localStorage.getItem(cc.dd.user.id + '_fxmj_create');
        if(cc.dd._.isString(result) && result != ""){
            let data = JSON.parse(result);
            if(data){
                this.m_objRuleIndex = data;
                if(this.m_objRuleIndex.qs == 0){
                    this.m_objRuleIndex.qs = 2;
                }else if( this.m_objRuleIndex.qs == 1){
                    this.m_objRuleIndex.qs = 4;
                }else if( this.m_objRuleIndex.qs == 2){
                    this.m_objRuleIndex.qs = 8;
                }else{
                    this.m_objRuleIndex.qs = 10;
                }
            }
        }
    },

    /**
     * 初始化视图
     */
    initView: function () {
        this.setRS();
        this.setQS();
        this.setJF();
        this.setFD();
        this.setZF();
        this.setWF();
        this.setGZ();
        this.setJH();
        this.setFZB();
        this.setClub();

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    getRules(data, isProxy){
        data = (!cc.dd._.isNull(data) && !cc.dd._.isUndefined(data)) ? data : this.m_objRuleIndex;

        var qsOrJs = 0;

        var conf = cost_room_cards_config.getItemList(function (item) {
            return item.id == cc.dd.Define.GameType.FXMJ_FRIEND && item.player_num == this.m_objRuleIndex.rs;
        }.bind(this));

        qsOrJs = conf[this.m_objRuleIndex.qs].circle_num

        var gameReq = new cc.pb.room_mgr.msg_create_game_req();
        var pbData = new cc.pb.room_mgr.fx_req_createdesk();
        var commonGame = new cc.pb.room_mgr.common_game();
        var rule = new cc.pb.room_mgr.xl_game_rule();
        var gz_idx = data.wf[5] ? data.gz : 0;

        pbData.setUsercountlimit(data.rs);
        pbData.setBoardscout(qsOrJs);
        pbData.setJifentypeindex(data.jf);
        pbData.setFengdingindex(data.fd);
        pbData.setZha5or10(data.zf);

        pbData.setIsjiehu(data.wf[0]);
        pbData.setIsqidui(data.wf[1]);
        pbData.setIsqinyise(data.wf[2]);
        pbData.setIsshoubayijiafan(data.wf[3]);
        pbData.setIschiting(data.wf[4]);
        pbData.setGenzysindex(gz_idx);
        pbData.setIssijia(data.wf[6]);
        pbData.setIsgunjsj(data.wf[7]);
        pbData.setIsshuipao(data.wf[8]);

        pbData.setPaytype(1);//房费默认房主
        pbData.setIsdianpaosanjia(1);
        pbData.setIsuncheat(false);

        pbData.setGps(data.fzb);
        pbData.setIsyuyin(data.yy);

        commonGame.setGameType(59);
        if (isProxy) {
            commonGame.setClubCreateType(2);
        }
        //如果是俱乐部创建房间
        if (club_Mgr.getClubOpenCreateUITag()) {
            commonGame.setClubId(club_Mgr.getSelectClubId());
            commonGame.setClubCreateType(club_Mgr.getClubCreateRoomType());

            //////////////////////////必须添加的部分//////////////////////////
            let commonBeishu = cc.find('gameScrollView/view/content/klb_friend_group_common_beishu', this.node);
            if(commonBeishu){
                let beishu = commonBeishu.getComponent('klb_friend_group_common_beishu').getBeiShu();
                commonGame.setMultiple(beishu);
            }else{
                commonGame.setMultiple(1);
            }
            ///////////////////////////////////////////////////////////
        }
        gameReq.setGameInfo(commonGame);
        rule.setMjFuxinRule(pbData);
        gameReq.setRule(rule);

        if (cc.sys.isNative) {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                var loc = new cc.pb.room_mgr.latlng();
                var latitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLatitude", "()F");
                var longitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLongitude", "()F");
                loc.setLatitude(latitude);
                loc.setLongitude(longitude);
                cc.log("详细地址：经度 " + longitude);
                cc.log("详细地址：纬度 " + latitude);
                if (parseInt(latitude) != 0 || parseInt(longitude) != 0) {
                    gameReq.setLatlngInfo(loc);
                }
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                var loc = new cc.pb.room_mgr.latlng();
                var Latitude = jsb.reflection.callStaticMethod('SystemTool', 'getLatitude');
                var Longitude = jsb.reflection.callStaticMethod('SystemTool', 'getLongitude');
                loc.setLatitude(Latitude);
                loc.setLongitude(Longitude);
                cc.log("详细地址：经度 " + Longitude);
                cc.log("详细地址：纬度 " + Latitude);
                if (parseInt(Latitude) != 0 || parseInt(Longitude) != 0) {
                    gameReq.setLatlngInfo(loc);
                }
            }
        }

        return gameReq;
    },

    setRoomRule(rule){
        //////////////////////////必须添加的部分//////////////////////////
        let commonBeishu = cc.find('gameScrollView/view/content/klb_friend_group_common_beishu', this.node);
        if(commonBeishu){
            commonBeishu.getComponent('klb_friend_group_common_beishu').setBeiShu(rule.gameInfo.multiple);;
        }

        let commonNode = cc.find('commonRule', this.node)
        if(commonNode){
            commonNode.active = false;
        }

        let scrollView = cc.find('gameScrollView', this.node)
        if(scrollView){
            scrollView.y = 0;
            scrollView.height = this.node.height - 20;
            scrollView.getComponent(cc.Sprite).enabled = false;
            let widgets = scrollView.getComponentsInChildren(cc.Widget);
            for(let i = 0; i < widgets.length; i++){
                widgets[i].updateAlignment();
            }
            scrollView.getComponent(cc.ScrollView).content.y = 0;
        }
        ///////////////////////////////////////////////////////////

        let _rule = rule.rule.mjFuxinRule;

        let qsOrJs = 0;
        var conf = cost_room_cards_config.getItemList(function (item) {
            return item.id == cc.dd.Define.GameType.FXMJ_FRIEND && item.player_num == _rule.usercountlimit;
        }.bind(this));

        for (var i = 0; i < this.txt_jushu_list.length && i < conf.length; i++) {
            if(conf[i].circle_num == _rule.boardscout){
                if(i == 0){
                    qsOrJs = 2;
                }else if( i == 1){
                    qsOrJs = 4;
                }else{
                    qsOrJs = 8;
                }
                break;
            }
        }

        this.m_objRuleIndex = {
            // 房费
            ff: _rule.paytype,
            // 圈数
            qs: qsOrJs,
            // 人数
            rs: _rule.usercountlimit,
            //积分
            jf: _rule.jifentypeindex,
            //封顶
            fd: _rule.fengdingindex-1,
            //扎分
            zf: _rule.zha5or10,
            // 玩法
            wf: [_rule.isjiehu, _rule.isqidui, _rule.isqinyise, _rule.isshoubayijiafan, _rule.ischiting, _rule.genzysindex != 0, _rule.issijia, _rule.isgunjsj, _rule.isshuipao],
            //跟庄
            gz: _rule.genzysindex,
            // 防作弊
            fzb: _rule.gps,
            //俱乐部限定
            club: _rule.gps,
        };

        this.initView();

        //////////////////////////必须添加的部分//////////////////////////
        this.p_qs.forEach((toggle)=>{
            toggle.interactable = false;
        })
        this.p_rs.forEach((toggle)=>{
            toggle.interactable = false;
        })
        this.p_wf.forEach((toggle)=>{
            toggle.interactable = false;
        })
        this.p_jf.forEach((toggle)=>{
            toggle.interactable = false;
        })
        this.p_fd.forEach((toggle)=>{
            toggle.interactable = false;
        })
        this.p_zf.forEach((toggle)=>{
            toggle.interactable = false;
        })
        this.p_gz.forEach((toggle)=>{
            toggle.interactable = false;
        })
        ///////////////////////////////////////////////////////////
    },

    setClubInfo(){
        let club = cc.find('commonRule/toggle_group_jiaruxianzhi', this.node)
        if(club){
            club.active = false;
        }

        let yuyin = cc.find('commonRule/toggle_group_yuying', this.node)
        if(yuyin){
            yuyin.y = 25;
        }

        let gps = cc.find('commonRule/toggle_group_gps', this.node)
        if(gps){
            gps.y = 25;
        }
    }
});
