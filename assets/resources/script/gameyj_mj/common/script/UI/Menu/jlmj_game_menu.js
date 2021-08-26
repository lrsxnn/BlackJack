var dd = cc.dd;
var DeskData = require('jlmj_desk_data').DeskData;
var DeskED = require('jlmj_desk_data').DeskED;
var DeskEvent = require('jlmj_desk_data').DeskEvent;
var UserPlayer = require('jlmj_userPlayer_data').Instance();
var PlayerED = require("jlmj_player_data").PlayerED;
var PlayerEvent = require("jlmj_player_data").PlayerEvent;
var PaiAnalysts = require('jlmj_pai_analysts').Instance();
var BaipaiType = require("jlmj_baipai_data").BaipaiType;
var gang_Analysts = require('jlmj_pai_analysts');
var pai3d_value = require("jlmj_pai3d_value");
var jlmj_Control_Combination_ui = require("jlmj_Control_Combination_ui");

var menu_type = cc.Enum({
    CHI: 0,
    PENG: 1,
    GANG: 2,
    TING: 3,
    HU: 4,
    GUO: 5,
    MOBAO: 6,
    DUIBAO: 7,
    ZIMO: 8,
    OK: 9,
    CLEAN: 10,

});

var hupai_type = cc.Enum({
    CAN_HU_TRUE_NORMAL: 1,  //普通胡
    CAN_HU_TRUE_DUIBAO: 2,  //对宝胡
    CAN_HU_TRUE_MOBAO: 3,  //摸宝胡
});
//var menu_cfg = [
//    { spriteFrame:"zn_chi_1",    desc:"吃" },
//    { spriteFrame:"zn_peng_1",   desc:"碰" },
//    { spriteFrame:"zn_gang_1",   desc:"杠" },
//    { spriteFrame:"zn_ting_1",   desc:"听" },
//    { spriteFrame:"zn_hu_1",     desc:"胡" },
//    { spriteFrame:"zn_guo_1",    desc:"过" },
//    { spriteFrame:"zn_queding_1", desc:"确认" },
//    { spriteFrame:"zn_quxiao_1", desc:"取消" },
//];


var menu_cfg = [
    { txtFrame: 1, bgFrame: 1, desc: "吃" },
    { txtFrame: 2, bgFrame: 1, desc: "碰" },
    { txtFrame: 3, bgFrame: 1, desc: "杠" },
    { txtFrame: 4, bgFrame: 1, desc: "听" },
    { txtFrame: 0, bgFrame: 0, desc: "胡" },
    { txtFrame: null, bgFrame: 2, desc: "过" },
    { txtFrame: 5, bgFrame: 0, desc: "摸宝" },
    { txtFrame: 6, bgFrame: 0, desc: "对宝" },
    { txtFrame: 7, bgFrame: 0, desc: "自摸" },
    //{ bgFrame:"zn_queding_1", desc:"确认" },
    //{ bgFrame:"zn_quxiao_1", desc:"取消" },
];

var GameMenu = cc.Class({
    extends: cc.Component,

    properties: {
        ani_node: { default: null, type: cc.Node, tooltip: "特效" },
        menu: { default: null, type: cc.Sprite, tooltip: "菜单" },
        menutxt: { default: null, type: cc.Sprite, tooltip: "菜单txt" },
        menubgFrame: [cc.SpriteFrame],//按钮背景图片资源数组
        menutxtFrame: [cc.SpriteFrame],//按钮文字图片资源数组
        /**
         * 菜单类型
         */
        _type: 4,//默认是胡牌按钮减少资源重新载入
        type: {
            get: function () {
                return this._type;
            },
            set: function (value) {
                //if(this.// == value){
                //    return;
                //}
                this._type = value;
                this.ani_node.active = false;// (this._type!=menu_type.GUO);
                // var str = 'gameyj_mj/jilin/py/textures/chiPengGang/'+menu_cfg[this._type].spriteFrame+'.png';
                // var sp = new cc.SpriteFrame(cc.url.raw(str));
                // this.menu.spriteFrame = sp;
                //this.atlas = cc.resources.get("gameyj_mj/jilin/py/atlas/texiao/menu_cpgth",cc.SpriteAtlas);
                //this.menu.spriteFrame = this.atlas.getSpriteFrame(menu_cfg[this._type].spriteFrame);
                if (menu_cfg[this._type]) {
                    if (menu_cfg[this._type].txtFrame != null) {
                        this.menutxt.spriteFrame = this.menutxtFrame[menu_cfg[this._type].txtFrame];
                    } else {
                        this.menutxt.spriteFrame = this.menubgFrame[menu_cfg[this._type].bgFrame];
                        this.menutxt.node.scaleX = 0.8;
                        this.menutxt.node.scaleY = 0.8;
                    }
                    // this.menu.spriteFrame = this.menubgFrame[menu_cfg[this._type].bgFrame];
                }
            }
        },

        _isEnable: true,
        isEnable: {
            get: function () {
                return this._isEnable;
            },
            set: function (value) {
                this._isEnable = value;
            }
        },

        _interactable: true,
        interactable: {
            get() {
                return this._interactable;
            },
            set(value) {
                this._interactable = value;
                this.menu.node.getComponent(cc.Button).interactable = value;
                if (value) {

                    this.menu.node.color = cc.Color.WHITE;
                    this.menutxt.node.color = cc.Color.WHITE;
                } else {

                    this.menu.node.color = cc.Color.GRAY;
                    this.menutxt.node.color = cc.Color.GRAY;
                }
            }
        }
    },

    // use this for initialization
    onLoad: function () {

    },

    onClickMenu: function (event, custom) {
        if (event.type != "touchend") {
            return;
        }

        if (!this.isEnable) {
            this.scheduleOnce(function () {
                this.isEnable = true;
            }, 0.3);
            return;
        }

        cc.log("【UI】" + "菜单操作:" + menu_cfg[this.type].desc);
        this.isEnable = false;
        this.scheduleOnce(function () {
            this.isEnable = true;
        }, 0.5);
        switch (this.type) {
            case menu_type.CHI:
                this.chi();
                break;
            case menu_type.PENG:
                this.peng();
                break;
            case menu_type.GANG:
                this.gang();
                break;
            case menu_type.TING:
                this.ting();
                break;
            case menu_type.HU:
                this.hupai();
                break;
            case menu_type.GUO:
                this.guo();
                break;
            case menu_type.MOBAO:
                this.hupai();
                break;
            case menu_type.DUIBAO:
                this.hupai();
                break;
            case menu_type.ZIMO:
                this.hupai();
                break;
            case menu_type.OK:
                var cardList = event.target.parent._Btn_customEventData;
                this.okBtnCallBack(cardList);
                break;
            case menu_type.CLEAN:
                this.cleanBtnCallBack();
                break;
            default:
                break;
        }
    },

    getGuoType() {
        let guoType = 0
        if (UserPlayer.canchi) {
            guoType = guoType | 1;
        }
        if (UserPlayer.canpeng) {
            guoType = guoType | 2;
        }
        if (UserPlayer.canbugang) {//补杠
            guoType = guoType | 4;
        }
        if (UserPlayer.cangang && !UserPlayer.hasMoPai()) {//点杠
            guoType = guoType | 8;
        }
        if (UserPlayer.cangang && UserPlayer.hasMoPai() && !UserPlayer.canbugang) {//暗杠
            guoType = guoType | 16;
        }
        if (UserPlayer.canliangxi) {
            guoType = guoType | 32;
        }
        if (UserPlayer.canhu) {
            guoType = guoType | 64;
        }
        if (UserPlayer.canting) {
            guoType = guoType | 128;
        }
        if (UserPlayer.canchiting) {
            guoType = guoType | 256;
        }
        if (UserPlayer.canpengting) {
            guoType = guoType | 512;
        }
        if (UserPlayer.cangangting) {
            guoType = guoType | 1024;
        }
        if (UserPlayer.cangu) {
            guoType = guoType | 2048;
        }
        if (UserPlayer.canliangzhang) {
            guoType = guoType | 4096;
        }

        return guoType;
    },

    /**
     * 过牌
     */
    guo: function () {
        var msg = new cc.pb.jilinmajiang.p17_req_game_act_guo();
        msg.setUserid(dd.user.id);
        msg.setGuotype(this.getGuoType());
        cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_game_act_guo, msg, "p17_req_game_act_guo");
    },

    /**
     * 吃牌
     */
    chi: function () {
        if (UserPlayer.chi_options.length <= 0) {
            cc.error("无吃牌选项数据");
            return;
        }

        if (UserPlayer.chi_options.length == 1) {
            //只有一个吃，直接吃
            var msg = new cc.pb.jilinmajiang.p17_req_chi();

            var card = new cc.pb.jilinmajiang.CardInfo();
            card.setId(DeskData.Instance().last_chupai_id);

            var chi_option = UserPlayer.chi_options[0];
            var card_option = [];
            chi_option.forEach(function (id) {
                var card = new cc.pb.jilinmajiang.CardInfo();
                card.setId(id);
                card_option.push(card);
            });

            msg.setUserid(dd.user.id);
            msg.setChicard(card);
            msg.setChoosecardsList(card_option);
            cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_chi, msg, "p17_req_chi");
            cc.dd.NetWaitUtil.net_wait_start();
        } else {
            //有多个吃，展开吃选项
            DeskED.notifyEvent(DeskEvent.OPEN_CHI, [UserPlayer, this.chiCallback.bind(this)]);
            //this.openChiOptions(UserPlayer.chi_options);
        }
    },

    /*openChiOptions : function (chioptions) {
        this.closeChiOptions();
        var self = this;
        cc.dd.UIMgr.openUI('gameyj_mj_common/prefabs/mj_chi', function(prefab){
            self.chi_ui = prefab;
            prefab.getComponent('mj_chi').setChiNode(chioptions, this.chiCallback.bind(this))
        }.bind(this));
    },   */

    /**
     * 关闭吃选项
     */
    /*closeChiOptions: function () {
        if(this.chi_ui){
            this.chi_ui.getComponent('mj_chi').close();
        }
    },    */
    chiCallback: function (chiList) {
        var msg = new cc.pb.jilinmajiang.p17_req_chi();

        var card = new cc.pb.jilinmajiang.CardInfo();
        card.setId(DeskData.Instance().last_chupai_id);

        var card_option = [];
        chiList.forEach(function (id) {
            var card = new cc.pb.jilinmajiang.CardInfo();
            card.setId(id);
            card_option.push(card);
        });

        msg.setUserid(dd.user.id);
        msg.setChicard(card);
        msg.setChoosecardsList(card_option);
        cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_chi, msg, "p17_req_chi");
        cc.dd.NetWaitUtil.net_wait_start();
    },

    /**
     * 碰牌
     */
    peng: function () {


        var msg = new cc.pb.jilinmajiang.p17_req_game_act_peng();
        msg.setUserid(dd.user.id);

        var pengCard = new cc.pb.jilinmajiang.CardInfo();
        pengCard.setId(DeskData.Instance().last_chupai_id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_game_act_peng, msg, "p17_req_game_act_peng");
        cc.dd.NetWaitUtil.net_wait_start();
    },

    /**
     * 选中后的杠牌回调
     * @param selectedList
     */
    onSeclectedGang: function (selectedList) {
        var isGangTing = this.isGangTing();
        var gangOption = UserPlayer.gang_options;
        gangOption.cardList = selectedList;
        if (isGangTing) {
            var tingType = 1;
            if (UserPlayer.isTempGang) {
                tingType = 2;
            }
            if (selectedList.length >= 4) {
                tingType = 3;
                UserPlayer.getTingGangJiaoInfo(selectedList[0]);
            }
            else {
                UserPlayer.setJiaoInfo(selectedList[0]);
            }
            this.sendTingPai(selectedList[0], tingType);
        } else {
            this.sendGangPai(gangOption);
        }
        this.interactable = true;
        jlmj_Control_Combination_ui.Instance().onCloseCombinationUi();
    },

    /**
     * 杠牌
     */
    gang: function () {

        var isGangTing = this.isGangTing();
        var gangOption = UserPlayer.gang_options;

        if (isGangTing) {
            UserPlayer.isTempGang = true;
            PlayerED.notifyEvent(PlayerEvent.SHOW_CLICK, [UserPlayer, false, null, 1]);    //取消牌的 不可点击 或者说是 切换出牌模式
        }

        if (gangOption.cardList.length == 1) {
            if (isGangTing) {
                var tingType = 1;
                if (UserPlayer.isTempGang) {
                    tingType = 2;
                }
                UserPlayer.setJiaoInfo(gangOption.cardList[0]);
                this.sendTingPai(gangOption.cardList[0], tingType);
            } else {
                this.sendGangPai(gangOption);
            }
        } else if (gangOption.cardList.length > 1) {
            var gangOptionList = [];
            var gangOptionList1 = [];
            // 是否听后的杠
            if (isGangTing) {
                for (var i = 0; i < gangOption.cardList.length; ++i) {
                    gangOptionList1.push(gangOption.cardList[i]);
                }
                jlmj_Control_Combination_ui.Instance().getAllCombinationList(gangOptionList1, gangOptionList, true);

            } else {
                jlmj_Control_Combination_ui.Instance().getAllCombinationList(gangOption.cardList, gangOptionList, false);
            }

            //桌子上无牌时,只能杠3张牌,其他杠不能杠
            var newGangOptionList = [];
            if (!DeskData.Instance().hasRemainPai() || UserPlayer.cangangmopai) {
                for (var i = 0; i < gangOptionList.length; ++i) {
                    var newGangOption = [];
                    for (var j = 0; j < gangOptionList[i].length; ++j) {
                        if (gangOptionList[i][j].length == 3) {
                            newGangOption.push(gangOptionList[i][j]);
                        }
                    }
                    if (newGangOption.length > 0) {
                        newGangOptionList.push(newGangOption);
                    }
                }

                cc.log('杠牌选项');
                cc.log(newGangOptionList);

                if (newGangOptionList.length == 1 && newGangOptionList[0].length == 1) {
                    this.onSeclectedGang(newGangOptionList[0][0]);
                } else {
                    //jlmj_Control_Combination_ui.Instance().onOpenCombinationUi(newGangOptionList, this.onSeclectedGang.bind(this));
                    // this.interactable = false;
                    DeskED.notifyEvent(DeskEvent.OPEN_GANG, [newGangOptionList, this.onSeclectedGang.bind(this)]);
                }
            } else {
                cc.log('杠牌选项');
                cc.log(gangOptionList);

                if (gangOptionList.length == 1 && gangOptionList[0].length == 1) {
                    if (isGangTing && UserPlayer.isTempGang && gangOptionList[0][0].length == 4) {
                        var tingType = 3;
                        UserPlayer.getTingGangJiaoInfo(gangOptionList[0][0][0]);
                        this.sendTingPai(gangOptionList[0][0][0], tingType);
                    }
                    else {
                        this.onSeclectedGang(gangOptionList[0][0]);
                    }
                } else {
                    //jlmj_Control_Combination_ui.Instance().onOpenCombinationUi(gangOptionList, this.onSeclectedGang.bind(this));
                    // this.interactable = false;
                    DeskED.notifyEvent(DeskEvent.OPEN_GANG, [gangOptionList, this.onSeclectedGang.bind(this)]);
                }
            }
        }
        PlayerED.notifyEvent(PlayerEvent.CLEA_SELECT_CARD, [UserPlayer]); //取消已经选择的牌
        //DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);//关闭menu
    },

    /**
     * 获取杠听列表
     */
    getGangList: function () {
        var tingList = UserPlayer.jiaoInfo_list;

        var gangList = [];
        var angangList = [];
        if (tingList.length >= 4) {
            for (var i in tingList) {
                var pai_id = tingList[i].out_id;
                gangList.push(pai_id);
                angangList[pai_id] = tingList[i].angang;
            }
            var gangOptionList = [];
            var havexiaoji = DeskData.Instance().isXiaoJiFeiDan;
            gang_Analysts.Instance().get4GangList(gangList, gangOptionList, havexiaoji);

            for (var i in gangOptionList[0]) {
                var gong = gangOptionList[0][i];
                var gang_ting = [];
                for (var gid = 0; gid < gong.length; ++gid) {
                    var id = gong[gid];
                    gang_ting[gid] = angangList[id];
                }
                if (gang_ting[0] || gang_ting[1] || gang_ting[2] || gang_ting[3]) {
                    gangList.push({ id: gong[0] });
                    gangList.push({ id: gong[1] });
                    gangList.push({ id: gong[2] });
                    gangList.push({ id: gong[3] });
                }
            }
        }
        for (var i = 0; i < tingList.length; ++i) {
            var cardId = tingList[i].out_id;
            if (PaiAnalysts.isBuGang(cardId, true) || PaiAnalysts.isBaGang(cardId)) {
                gangList.push({ id: cardId });
            }
        }
        return gangList;
    },

    /**
     * 听
     */
    ting: function () {
        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);
        UserPlayer.isTempBaoTing = true;
        var arr = [];
        if (this.isGangTing()) {
            var gangList = this.getGangList();
            var menuState = {};
            menuState.canchi = false;
            menuState.canpeng = false;
            menuState.cangang = true;
            menuState.canbugang = true;
            menuState.canhu = false;
            menuState.canting = false;
            menuState.gangcards = {};
            menuState.gangcards.gangcardList = gangList;
            menuState.gangcards.isnewdealstyle = true;
            UserPlayer.setCpgth(menuState, true);
            cc.find("Canvas/game_menu_list").getComponent("jlmj_game_menu_list").setMenus(UserPlayer);
            // 菜单显示 延迟到摸牌后
            // PlayerED.notifyEvent(PlayerEvent.CAOZUO,[UserPlayer, true]);

            // arr = this.getGangList();
        }
        var list = UserPlayer.jiaoInfo_list;
        for (var i = 0; i < list.length; ++i) {
            arr.push(list[i].out_id);
        }

        PlayerED.notifyEvent(PlayerEvent.CLEA_SELECT_CARD, [UserPlayer]); //清除选择数组
        PlayerED.notifyEvent(PlayerEvent.SHOW_CLICK, [UserPlayer, true, arr, 3]);    //设置可点击的牌

    },

    /**
     * 胡
     */
    hupai: function () {
        var msg = new cc.pb.jilinmajiang.p17_req_game_act_hu();
        msg.setUserid(dd.user.id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_game_act_hu, msg, "p17_req_game_act_hu");
    },
    /**
     * 取消按钮回调
     */
    cleanBtnCallBack: function () {
        DeskED.notifyEvent(DeskEvent.SHOW_UP_LISTBTN, []);
        PlayerED.notifyEvent(PlayerEvent.SHOW_CLICK, [UserPlayer, false, null, 1]);    //取消牌的 不可点击 或者说是 切换出牌模式
        PlayerED.notifyEvent(PlayerEvent.CLEA_SELECT_CARD, [UserPlayer]); //取消已经选择的牌
    },
    /**
     * 确认回调
     * @param data {type, cardList}
     */
    okBtnCallBack: function (data) {
        cc.log('【确认按钮】操作', data.type);
        if (data.type == menu_type.TING) {//听牌
            var msg = new cc.pb.jilinmajiang.p17_req_tingpai_out_card();
            msg.setCardid(data.data[0]);
            msg.setTingtype(1);
            cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_tingpai_out_card, msg, "p17_req_tingpai_out_card");
        } else {//杠牌
            data.data.isnewdealstyle = true;//走新杠
            this.sendGangPai(data.data);
        }
        PlayerED.notifyEvent(PlayerEvent.CLEA_SELECT_CARD, [UserPlayer]); //清除选择数组
        DeskED.notifyEvent(DeskEvent.CLOSE_MENU, []);//关闭menu
        PlayerED.notifyEvent(PlayerEvent.SHOW_CLICK, [UserPlayer, false, null, 1]);
    },

    /**
     * 杠牌发送
     * @param gang_option {cardList, isnewdealstyle, centerId}
     */
    sendGangPai: function (gang_option) {
        var msg = new cc.pb.jilinmajiang.p17_req_game_act_gang();

        msg.setIsnewdealstyle(gang_option.isnewdealstyle);
        var cards = [];
        gang_option.cardList.forEach(function (id) {
            var card = new cc.pb.jilinmajiang.CardInfo();
            card.setId(id);
            cards.push(card);
        });
        msg.setUserid(dd.user.id);
        msg.setChoosecardsList(cards);
        cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_game_act_gang, msg, "p17_req_game_act_gang");
        cc.dd.NetWaitUtil.net_wait_start();
    },

    /**
     * 听牌发送
     * @param playCardId 出牌
     */
    sendTingPai: function (playCardId, tingType) {
        if (playCardId < 0) {
            cc.error("听后出的牌为空");
            return;
        }
        var msg = new cc.pb.jilinmajiang.p17_req_tingpai_out_card();
        msg.setCardid(playCardId);
        msg.setTingtype(tingType);
        cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_tingpai_out_card, msg, "p17_req_tingpai_out_card");
    },

    isGangTing: function () {
        if (UserPlayer.cangang || UserPlayer.canbugang) {
            if (UserPlayer.isTempBaoTing) {
                var jiaoList = UserPlayer.jiaoInfo_list;
                var gangList = [];
                var angangList = [];
                if (jiaoList.length >= 4) {
                    for (var i in jiaoList) {
                        var pai_id = jiaoList[i].out_id;
                        gangList.push(pai_id);
                        angangList[pai_id] = jiaoList[i].angang;
                    }
                    var gangOptionList = [];
                    var havexiaoji = DeskData.Instance().isXiaoJiFeiDan;
                    gang_Analysts.Instance().get4GangList(gangList, gangOptionList, havexiaoji);

                    for (var i in gangOptionList[0]) {
                        var gong = gangOptionList[0][i];
                        var gang_ting = [];
                        for (var gid = 0; gid < gong.length; ++gid) {
                            var id = gong[gid];
                            gang_ting[gid] = angangList[id];
                        }
                        if (gang_ting[0] || gang_ting[1] || gang_ting[2] || gang_ting[3]) {
                            return true;
                        }
                    }
                }

                for (var i = 0; i < jiaoList.length; ++i) {
                    var cardId = jiaoList[i].out_id;
                    if (PaiAnalysts.isBuGang(cardId, true) || PaiAnalysts.isBaGang(cardId)) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

});

module.exports = {
    GameMenu: GameMenu,
    menu_type: menu_type,
    hupai_type: hupai_type,
};
