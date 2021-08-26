var cost_room_cards_config = require('cost_room_cards');

cc.Class({
    extends: require('base_mj_create_room'),

    properties: {
        p_rs: { default: [], type: cc.Toggle, tooltip: '人数', },
        p_qs: { default: [], type: cc.Toggle, tooltip: '圈数', },
        p_wf: { default: [], type: cc.Toggle, tooltip: '玩法', },
        p_wf_2: { default: [], type: cc.Toggle, tooltip: '玩法', },
        txt_jushu_list: [cc.Label],
        text_fangka_list: [cc.Label],
    },

    /**
     * 选择规则
     */
    getGroup: function (target, data) {

        var group = null;

        switch (data) {
            case "rs1":
                this.m_objRuleIndex.rs = 4;
                group = this.p_rs;

                var conf = cost_room_cards_config.getItemList(function (item) {
                    return item.id == cc.dd.Define.GameType.PZMJ_FRIEND && item.player_num == 4;
                }.bind(this));

                for (var i = 0; i < this.txt_jushu_list.length && i < conf.length; i++) {
                    this.txt_jushu_list[i].string = conf[i].circle_num + (i <= 1 ? '局' : '圈');//QuanShuDesc[i];
                    this.text_fangka_list[i].string = '(房卡X' + conf[i].cost + ')';//FangKaDesc[i];
                }
                break;
            case "rs2":
                this.m_objRuleIndex.rs = 3;
                group = this.p_rs;

                var conf = cost_room_cards_config.getItemList(function (item) {
                    return item.id == cc.dd.Define.GameType.PZMJ_FRIEND && item.player_num == 3;
                }.bind(this));

                for (var i = 0; i < this.txt_jushu_list.length && i < conf.length; i++) {
                    this.txt_jushu_list[i].string = conf[i].circle_num + (i <= 1 ? '局' : '圈');//QuanShuDesc[i];
                    this.text_fangka_list[i].string = '(房卡X' + conf[i].cost + ')';//FangKaDesc[i];
                }
                break;
            case "rs3":
                this.m_objRuleIndex.rs = 2;
                group = this.p_rs;

                var conf = cost_room_cards_config.getItemList(function (item) {
                    return item.id == cc.dd.Define.GameType.PZMJ_FRIEND && item.player_num == 2;
                }.bind(this));

                for (var i = 0; i < this.txt_jushu_list.length && i < conf.length; i++) {
                    this.txt_jushu_list[i].string = conf[i].circle_num + (i <= 1 ? '局' : '圈');//QuanShuDesc[i];
                    this.text_fangka_list[i].string = '(房卡X' + conf[i].cost + ')';//FangKaDesc[i];
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
            case "qs4":
                this.m_objRuleIndex.qs = 3;
                group = this.p_qs;
                break;
            case "wf1":
                this.m_objRuleIndex.wf[0] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf2":
                this.m_objRuleIndex.wf[1] = -1;
                group = this.p_wf_2;
                break;
            case "wf3":
                this.m_objRuleIndex.wf[1] = -2;
                group = this.p_wf_2;
                break;
            case "wf4":
                this.m_objRuleIndex.wf[1] = 2;
                group = this.p_wf_2;
                break;
            case "wf5":
                this.m_objRuleIndex.wf[1] = 3;
                group = this.p_wf_2;
                break;
            case "wf6":
                this.m_objRuleIndex.wf[1] = 4;
                group = this.p_wf_2;
                break;
            case "wf7":
                this.m_objRuleIndex.wf[1] = 5;
                group = this.p_wf_2;
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

       return group;
    },



    /**
     * 发送 创建房间
     * @param data
     */
    sendCreateRoom: function (data, isProxy) {
        if (this._touchCreate) {
            return
        }
        cc.sys.localStorage.setItem(cc.dd.user.id + '_last_enter_game', cc.dd.Define.GameType.PZMJ_FRIEND);

        this._super(data, isProxy)
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
            case 10:
                this.setCheckedToggle(this.p_qs[3], true);
                break;
        }
    },

    /**
     * 设置玩法
     */
    setWF: function () {
        this.initToggleColor(this.p_wf);
        this.initToggleColor(this.p_wf_2);
        this.setCheckedToggle(this.p_wf[0], this.m_objRuleIndex.wf[0]);
        switch (this.m_objRuleIndex.wf[1]) {
            case -1:
                this.setCheckedToggle(this.p_wf_2[0], true);
                break
            case -2:
                this.setCheckedToggle(this.p_wf_2[1], true);
                break
            case 2:
                this.setCheckedToggle(this.p_wf_2[2], true);
                break
            case 3:
                this.setCheckedToggle(this.p_wf_2[3], true);
                break
            case 4:
                this.setCheckedToggle(this.p_wf_2[4], true);
                break
            case 5:
                this.setCheckedToggle(this.p_wf_2[5], true);
                break
        }
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
            // 玩法
            wf: [false, -1],
            // 防作弊
            fzb: false,
            //俱乐部限定
            club: false,
            //语音
            yy: false,
        };
    },

    /**
     * 初始化视图
     */
    setCustomView: function () {
        this.setRS();
        this.setQS();
        this.setWF();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    getXLGameRule(data, qsOrJs){
        var rule = new cc.pb.room_mgr.xl_game_rule();
        var pbData = new cc.pb.room_mgr.pingzhuang_req_createdesk();
        pbData.setPaytype(data.ff);
        pbData.setBoardscout(qsOrJs);
        pbData.setMode(data.qs > 1 ? 0 : 1);
        pbData.setUsercountlimit(data.rs);
        pbData.setIsuncheat(data.fzb);

        pbData.setIs37jia(false);
        pbData.setPaofen(data.wf[1]);

        pbData.setGps(data.fzb);
        pbData.setIsyuyin(true);

        rule.setMjPingzhuangRule(pbData);
        return rule;
    },



    setXLGameRule(rule){
        let _rule = rule.rule.mjPingzhuangRule;

        let qsOrJs = 0;
        var conf = cost_room_cards_config.getItemList(function (item) {
            return item.id == cc.dd.Define.GameType.PZMJ_FRIEND && item.player_num == _rule.usercountlimit;
        }.bind(this));

        for (var i = 0; i < this.txt_jushu_list.length && i < conf.length; i++) {
            if(conf[i].circle_num == _rule.boardscout){
                if(i == 0){
                    qsOrJs = 2;
                }else if( i == 1){
                    qsOrJs = 4;
                }else if( i == 2){
                    qsOrJs = 8;
                }else{
                    qsOrJs = 10;
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
            // 玩法
            wf: [_rule.is37jia, _rule.paofen],
            // 防作弊
            fzb: _rule.gps,
            //俱乐部限定
            club: _rule.gps,
            //语音
            yy: _rule.isyuyin,
        };

        this.initView();

        //////////////////////////必须添加的部分//////////////////////////
        //所有按键不可点击，不置灰
        this.p_rs.forEach((toggle)=>{
            toggle.interactable = false;
        });
        this.p_qs.forEach((toggle)=>{
            toggle.interactable = false;
        })
        this.p_wf.forEach((toggle)=>{
            toggle.interactable = false;
        })
        this.p_wf_2.forEach((toggle)=>{
            toggle.interactable = false;
        })
        ///////////////////////////////////////////////////////////
    },


    getGameType(){
        return cc.dd.Define.GameType.PZMJ_FRIEND;
    },

    getGame(){
        return 'pzmj';
    }
});
