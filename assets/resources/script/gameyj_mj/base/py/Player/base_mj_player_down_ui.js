//每个麻将都要改写这个
let mjComponentValue = null;
let mjConfigValue = null;

var GmPaiKuED = require("jlmj_gm_paiku").GmPaiKuED;
var pai3d_value = require('jlmj_pai3d_value');
var SysED = require("com_sys_data").SysED;
var UIZorder = require("mj_ui_zorder");

let base_mj_player_base_ui = require('base_mj_player_base_ui');

let TouchCardMode = require('base_mj_player_data').TouchCardMode;

let down = cc.Class({
    extends: base_mj_player_base_ui,

    ctor() {
        mjComponentValue = this.initMJComponet();
        mjConfigValue = this.initMJConfig();
    },

    properties: {
        prefab_user_pai: cc.Prefab,
        chupai_offset: 40,
        pai_move_offset: -260,
    },

    restPt_y() {
        if (this.isNeimeng) {
            if (this.require_DeskData.Instance().getIs2D()) {
                if (this.require_DeskData.Instance().get2DPai() != 'green') {
                    return -287.9;
                } else {
                    return -292;
                }
            } else {
                return -286.2;
            }
        } else {
            return this.require_DeskData.Instance().getIs2D() ? -292 : -286.2
        }
    },

    resetConfig() {
        if (this.isNeimeng) {
            let use2D = cc.sys.localStorage.getItem(cc.dd.user.id + '_chifeng_use2D') === 'true';
            this.pai3dCfg = require("nmmj_pai3d_down").Instance();
            let path = '';
            if (use2D) {
                let pa2d = this.require_DeskData.Instance().get2DPai();
                path = '_2d_' + pa2d;
                this.pai3dCfg = require("nmmj_pai3d_down_2d_" + pa2d).Instance()
            }
            this.shou2mid_ani_path = 'gameyj_mj_neimenggu/common/animations/pai' + path + '/down/nmmj_shou2mid_down_';

        } else {
            let use2D = cc.sys.localStorage.getItem(cc.dd.AppCfg.GAME_ID + '_' + cc.dd.user.id + '_use2D') === 'true';
            this.pai3dCfg = use2D ? require("jlmj_pai3d_down_2d").Instance() : require("jlmj_pai3d_down").Instance();
            let path = use2D ? '_2d' : '';
            this.shou2mid_ani_path = 'gameyj_mj/common/animations/pai' + path + '/down/jlmj_shou2mid_down_';
        }
    },

    initPlayerPai(res_pai) {
        this.ccgpai_prefab = res_pai.getComponent('mj_res_pai').jlmj_ccgpai_down;

        this.viewIdx = 0;
        this.yidong_pai = null;
        this.pai_touched = null;
        this.touchCardMode = TouchCardMode.CHU_PAI;//牌的选择还是出牌
        this.fenpai_touched = false;
        if (cc.find("Canvas/desk_node/down_head_button")) {
            cc.find("Canvas/desk_node/down_head_button").active = true;
        }
    },

    initPlayerUI() {
        let desk_node = cc.find("Canvas/desk_node");
        this._node_scale_x = desk_node.scaleX;
        this._node_scale_y = desk_node.scaleY;

        let canvas = cc.find("Canvas");
        this._offsetX = canvas.width / 2;
        this._offsetY = canvas.height / 2;

        this.chupai_node = cc.find("Canvas/desk_node/chupai_down_node");
        this.zhanshi_pai = cc.find("Canvas/desk_node/zhanshi_pais/jlmj_zhanshi_pai_down").getComponent(mjConfigValue.mjPai);     //展示牌
        this.touch_node = cc.find("Canvas/desk_node/jlmj_player_down_ui/user_touch_node");
        this.menuList = cc.find("Canvas/game_menu_list").getComponent(mjComponentValue.gameMenuList);

        this.chupai_prompt = cc.find("Canvas/desk_node/chupai_prompt");
        if (this.chupai_prompt) {
            this.chupai_prompt.active = false;
        }
        cc.log('mj_player_down_ui onLoad');
    },

    onLoad: function () {
        this._super();
        this.initYiDongPai();
        this.regTouchEvent();
        GmPaiKuED.addObserver(this);
        SysED.addObserver(this);

        this.TingPaiTouchMode = TouchCardMode.TING_PAI;
    },

    onDestroy: function () {
        this._super();
        GmPaiKuED.removeObserver(this);
        SysED.removeObserver(this);
    },

    /**
     * 获取打牌动画路径
     * @returns {*}
     */
    getMid2DaPaiAniPath: function () {
        let path = '';
        if (this.require_DeskData.Instance().getIs2D()) {
            let pai2d = this.require_DeskData.Instance().get2DPai();
            if (cc.dd._.isNull(pai2d)) {
                path = '_2d';
            } else {
                path = '_2d_' + pai2d;
            }
        }
        if (this.isNeimeng) {
            switch (this.require_playerMgr.Instance().playerList.length) {
                case 3:
                    return 'gameyj_mj_neimenggu/common/animations/pai3' + path + '/down/nmmj_mid2dapai_down_';
                case 2:
                    return 'gameyj_mj_neimenggu/common/animations/pai2' + path + '/down/nmmj_mid2dapai_down_';
                default:
                    return 'gameyj_mj_neimenggu/common/animations/pai' + path + '/down/nmmj_mid2dapai_down_';
            }
        } else {
            switch (this.require_playerMgr.Instance().playerList.length) {
                case 3:
                    return 'gameyj_mj/common/animations/pai3' + path + '/down/jlmj_mid2dapai_down_';
                case 2:
                    return 'gameyj_mj/common/animations/pai2' + path + '/down/jlmj_mid2dapai_down_';
                default:
                    return 'gameyj_mj/common/animations/pai' + path + '/down/jlmj_mid2dapai_down_';
            }
        }
    },

    initShouPai: function () {
        for (var i = 0; i < 13; ++i) {
            var pai_node = cc.instantiate(this.prefab_user_pai);
            pai_node.active = false;
            pai_node.name = 'jlmj_pai_' + i;
            this.node.addChild(pai_node);
            var jlmj_user_shoupai = pai_node.getComponent(mjConfigValue.userShoupai);
            jlmj_user_shoupai.setTouchAble(true);
            jlmj_user_shoupai.setTingPai(false);
            this.shouPai[i] = jlmj_user_shoupai;
        }
    },

    /**
     * 初始化摸得牌
     */
    initModepai: function () {
        var pai_node = cc.instantiate(this.prefab_user_pai);
        this.node.addChild(pai_node);
        var jlmj_user_shoupai = pai_node.getComponent(mjConfigValue.userShoupai);
        if (!jlmj_user_shoupai) {
            cc.error("摸牌未挂jlmj_user_shoupai组件");
        }
        jlmj_user_shoupai.setTouchAble(true);
        jlmj_user_shoupai.zhanli(this.pai3dCfg.shoupai_zhanli_cfg['frame_' + 12], this.pai3dCfg.shoupai_zhanli_cfg['value_' + 12], this.pai3dCfg.shoupai_zhanli_cfg['liangzhang_' + 12], this.pai3dCfg.shoupai_zhanli_cfg['hunpai_' + 12]);
        this.modepai = jlmj_user_shoupai;
        this.modepai.node.active = false;
    },

    /**
     * 初始化移动牌
     */
    initYiDongPai: function () {
        var pai_node = cc.instantiate(this.prefab_pai);
        pai_node.zIndex = UIZorder.MJ_YIDONG_PAI;
        this.node.addChild(pai_node);
        var jlmj_pai = pai_node.getComponent(mjConfigValue.mjPai);
        if (!jlmj_pai) {
            cc.error("摸牌未挂jlmj_pai组件");
        }
        this.yidong_pai = jlmj_pai;
        this.yidong_pai.node.active = false;
        this.yidong_pai.cloned = false;
    },

    getBaipaiShouPaiDis: function (state) {
        if (state == this.require_PlayerState.DAPAI) {
            //5张风杠,向左缩进。
            if (this.baipai_ui_list.length == 1) {
                var last_baipai_ui = this.baipai_ui_list[0];
                if (last_baipai_ui.pais.length == 5) {
                    return this.require_DeskData.Instance().getIs2D() ? 82 : 72;
                }
            }
            return 100;
        } else if (state == this.require_PlayerState.TINGPAI) {
            return 100;
        } else {
            return 100;
        }
    },

    getMoPaiShouPaiDis: function (state) {
        if (state == this.require_PlayerState.DAPAI) {
            return 100;
        } else if (state == this.require_PlayerState.TINGPAI) {
            return 100;
        } else {
            return 100;
        }
    },

    /**
     * 获取居中对齐的偏移X
     */
    getAlignCenterOffsetX: function () {
        var offset_x = 0;
        var first_pai = null;
        var last_pai = null;
        if (this.baipai_ui_list.length > 0) {
            var first_baipai_ui = this.baipai_ui_list[0];
            first_pai = first_baipai_ui.pais[0].node;
        }
        for (var i = 0; i < this.shouPai.length; ++i) {
            if (this.shouPai[i].node.active) {
                if (!first_pai) {
                    first_pai = this.shouPai[i].node;
                }
                last_pai = this.shouPai[i].node;
            }
        }
        if (this.modepai.node.active) {
            last_pai = this.modepai.node;
        }
        offset_x = (Math.abs(first_pai.x) - Math.abs(last_pai.x)) / 2;
        if (Math.abs(first_pai.x) > Math.abs(last_pai.x)) {
            offset_x = Math.abs(offset_x);
        } else {
            offset_x = -Math.abs(offset_x);
        }
        offset_x = parseFloat(offset_x.toFixed(1));
        // cc.log('座号=',this.viewIdx);
        // cc.log('第一张牌位置X=',first_pai.x);
        // cc.log('最后一张牌位置X=',last_pai.x);
        // cc.log('居中偏移X=',offset_x);
        return offset_x;
    },



    updateShouPai: function (player) {
        if (this.isResetBaiPai) {
            this.needUpdateShouPai = true;
            return;
        }

        if (this.require_DeskData.Instance().isFenZhang) {
            cc.log('【分张摸牌】 开始');
        }
        var player = this.require_playerMgr.Instance().getPlayerByViewIdx(this.viewIdx);
        if (!player) {
            return;
        }
        //测试结算开牌
        // player.state = this.require_PlayerState.HUPAI;

        if (this.yidong_pai && this.yidong_pai.node && this.yidong_pai.node.active) {
            this.yidong_pai.node.active = false;
            this.pai_touched = null;
        }

        this.chupai_act = false;
        //胡牌时,摆牌使用开牌配置
        if (player.state == this.require_PlayerState.HUPAI) {
            this.resetBaiPai(player);
        }

        if (player.shoupai.length == 0) {
            return;
        }

        var shouPaiLen = player.shoupai.length;
        if (player.hasMoPai()) {
            shouPaiLen = player.shoupai.length - 1;
        }
        var shoupai_visible_cfg = {
            1: [12],
            4: [9, 10, 11, 12],
            7: [6, 7, 8, 9, 10, 11, 12],
            10: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        };

        if (!shoupai_visible_cfg[shouPaiLen]) {
            cc.error("手牌数量错误  =", shouPaiLen);
            cc.log("手牌" + pai3d_value.descs(player.shoupai));

            if (!cc.dd._mj_shoupai_reconnectd) {
                cc.dd._mj_shoupai_reconnectd = true;

                cc.log("开始重连麻将" + cc.dd.AppCfg.GAME_ID + "玩家ID" + player.userId);
                var login_module = require('LoginModule');
                login_module.Instance().reconnectWG();
                return;
            }
        }

        var count = 0;
        for (var i = 0; i < this.shouPai.length; ++i) {
            this.shouPai[i].node.stopAllActions();
            if (shoupai_visible_cfg[shouPaiLen] && shoupai_visible_cfg[shouPaiLen].indexOf(i) != -1) {
                this.shouPai[i].node.active = true;
                this.shouPai[i].selected = false;
                if (player.state == this.require_PlayerState.HUPAI) {  //胡牌时,开牌配置要加上摆牌数目
                    this.setShouPaiAppearance(i, player.state, player.getBaiPaiNum() + count);
                } else {
                    this.setShouPaiAppearance(i, player.state);
                }
                this.shouPai[i].setValue(player.shoupai[count]);
                if (player.state == this.require_PlayerState.HUPAI) {
                    this.biaojiBaoPaiInShouPai(this.shouPai[i]);
                }
                if (this.touchCardMode != TouchCardMode.DA_TING_PAI) {
                    this.shouPai[i].setTingPai(false);
                }

                this.shouPai[i].setHunPai(this.require_DeskData.Instance().isHunPai(player.shoupai[count]), player.state != this.require_PlayerState.TINGPAI && player.state != this.require_PlayerState.HUPAI);

                count++;
            } else {
                this.shouPai[i].node.active = false;
            }
        }

        var offset_x = 0;
        if (this.baipai_ui_list.length > 0 && shoupai_visible_cfg[shouPaiLen]) {
            var last_baipai_ui = this.baipai_ui_list[this.baipai_ui_list.length - 1];
            var last_pai = last_baipai_ui.pais[last_baipai_ui.pais.length - 1];
            var first_idx = shoupai_visible_cfg[shouPaiLen][0];
            var start_x = this.shouPai[first_idx].frameCfg.x;
            var target_x = last_pai.node.x + this.getBaipaiShouPaiDis(player.state);
            offset_x = target_x - start_x;
        }
        cc.log(this.viewIdx, '手牌偏移位置 = ' + offset_x);
        for (var i = 0; i < this.shouPai.length; ++i) {
            if (this.shouPai[i].node.active) {
                this.shouPai[i].node.x = this.shouPai[i].frameCfg.x + offset_x;
            }
        }

        //摸牌
        if (player.hasMoPai()) {//说明手牌中是包含
            this.modepai.node.active = true;
            this.modepai.node.stopAllActions();
            if (player.state == this.require_PlayerState.HUPAI) {  //胡牌时,开牌配置要加上摆牌数目
                this.setMoPaiAppearance(13, player.state, player.getBaiPaiNum() + count);
            } else {
                this.setMoPaiAppearance(13, player.state);
            }
            var last_shou_pai = this.getLastShouPai();
            this.modepai.node.setPosition(last_shou_pai.node.x + this.getMoPaiShouPaiDis(player.state), last_shou_pai.node.y);
            // cc.log('手牌的最后X位置', last_shou_pai.node.x);
            // cc.log('摸牌X位置', this.modepai.node.x);
            this.modepai.setValue(player.shoupai[shouPaiLen]);
            if (player.state == this.require_PlayerState.HUPAI) {
                this.biaojiBaoPaiInShouPai(this.modepai);
            }
            if (player.state != this.require_PlayerState.HUPAI) {
                this.menuList.setMenus(player);
            }
            this.modepai.setHunPai(this.require_DeskData.Instance().isHunPai(player.shoupai[shouPaiLen]), player.state != this.require_PlayerState.TINGPAI && player.state != this.require_PlayerState.HUPAI);

            if (player.canbuhua && player.buhuaId >= 0) {
                for (let i = 0; i < this.shouPai.length; i++) {
                    if (this.shouPai[i].cardId == player.buhuaId) {
                        this.shouPai[i].node.y = this.restPt_y() + this.chupai_offset;
                        break;
                    }
                }
                if (this.modepai.cardId == player.buhuaId) {
                    this.modepai.node.y = this.restPt_y() + this.chupai_offset;
                }
                this.menuList.setMenus(player);
            }
        } else {
            this.modepai.node.active = false;
        }

        if (this.chupai_prompt) {
            this.chupai_prompt.active = this.checkChuPaiPromot(player);
        }

        this.hideShouPaiInFaPaiAction();

        //开牌居中
        if (player.state == this.require_PlayerState.HUPAI) {
            this.shouPaiAlignCenterH();
        }

        if (this.require_DeskData.isFenZhang) {
            cc.log('【分张摸牌】 结束');
        }
        cc.log("【UI】" + "自己手牌:" + pai3d_value.descs(player.shoupai));
    },

    updateSelectedPai: function (player) {
        var player = this.require_playerMgr.Instance().getPlayerByViewIdx(this.viewIdx);
        if (!player) {
            return;
        }

        if (player.shoupai.length == 0) {
            return;
        }

        var shouPaiLen = player.shoupai.length;
        if (player.hasMoPai()) {
            shouPaiLen = player.shoupai.length - 1;
        }
        var shoupai_visible_cfg = {
            1: [12],
            4: [9, 10, 11, 12],
            7: [6, 7, 8, 9, 10, 11, 12],
            10: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        };

        if (!shoupai_visible_cfg[shouPaiLen]) {
            cc.error("手牌数量错误  =", shouPaiLen);
        }

        var count = 0;
        for (var i = 0; i < this.shouPai.length; ++i) {
            if (shoupai_visible_cfg[shouPaiLen] && shoupai_visible_cfg[shouPaiLen].indexOf(i) != -1) {
                this.shouPai[i].node.active = true;
                if (!this.shouPai[i].selected) {

                    this.setShouPaiAppearance(i, player.state);
                }
                this.shouPai[i].setValue(player.shoupai[count]);
                if (this.touchCardMode != TouchCardMode.DA_TING_PAI) {
                    this.shouPai[i].setTingPai(false);
                }
                count++;
            } else {
                this.shouPai[i].node.active = false;
            }
        }

        var offset_x = 0;
        if (this.baipai_ui_list.length > 0) {
            var last_baipai_ui = this.baipai_ui_list[this.baipai_ui_list.length - 1];
            var last_pai = last_baipai_ui.pais[last_baipai_ui.pais.length - 1];
            var first_idx = shoupai_visible_cfg[shouPaiLen][0];
            var start_x = this.shouPai[first_idx].frameCfg.x;
            var target_x = last_pai.node.x + this.getBaipaiShouPaiDis(player.state);
            offset_x = target_x - start_x;
        }
        cc.log(this.viewIdx, '手牌偏移位置 = ' + offset_x);
        for (var i = 0; i < this.shouPai.length; ++i) {
            if (this.shouPai[i].node.active) {
                this.shouPai[i].node.x = this.shouPai[i].frameCfg.x + offset_x;
            }
        }

        //摸牌
        if (player.hasMoPai()) {//说明手牌中是包含
            this.modepai.node.active = true;
        } else {
            this.modepai.node.active = false;
        }

        if (this.yidong_pai && this.yidong_pai.node && this.yidong_pai.node.active) {
            this.yidong_pai.node.active = false;
        }
    },

    /**
     * 获取最后一张手牌
     */
    getLastShouPai: function () {
        var last_shou_pai = null;
        this.shouPai.forEach(function (pai) {
            if (pai.node.active) {
                last_shou_pai = pai;
            }
        });
        return last_shou_pai;
    },

    /**
     * 设置手牌的外观
     * @param idx
     * @param state
     */
    setShouPaiAppearance: function (idx, state, cfg_view_idx) {
        if (!cfg_view_idx) {
            cfg_view_idx = idx;
        }
        switch (state) {
            case this.require_PlayerState.TINGPAI:
                this.shouPai[idx].zhanli(this.pai3dCfg.shoupai_zhanli_cfg['frame_' + cfg_view_idx], this.pai3dCfg.shoupai_zhanli_cfg['value_' + cfg_view_idx], this.pai3dCfg.shoupai_zhanli_cfg['liangzhang_' + cfg_view_idx], this.pai3dCfg.shoupai_zhanli_cfg['hunpai_' + cfg_view_idx], this.pai3dCfg.shoupai_zhanli_cfg['tuidao_' + cfg_view_idx]);
                this.shouPai[idx].setTouchAble(false);
                break;
            case this.require_PlayerState.HUPAI:
                this.shouPai[idx].kaipai(this.pai3dCfg.shoupai_kaipai_cfg['frame_' + cfg_view_idx], this.pai3dCfg.shoupai_kaipai_cfg['value_' + cfg_view_idx], this.pai3dCfg.shoupai_kaipai_cfg, this.pai3dCfg.shoupai_kaipai_cfg['liangzhang_' + cfg_view_idx], this.pai3dCfg.shoupai_kaipai_cfg['hunpai_' + cfg_view_idx], this.pai3dCfg.shoupai_kaipai_cfg['tuidao_' + cfg_view_idx]);
                this.shouPai[idx].setTouchAble(false);
                this.shouPai[idx].mask.active = false;
                break;
            default:
                this.shouPai[idx].zhanli(this.pai3dCfg.shoupai_zhanli_cfg['frame_' + cfg_view_idx], this.pai3dCfg.shoupai_zhanli_cfg['value_' + cfg_view_idx], this.pai3dCfg.shoupai_zhanli_cfg['liangzhang_' + cfg_view_idx], this.pai3dCfg.shoupai_zhanli_cfg['hunpai_' + cfg_view_idx], this.pai3dCfg.shoupai_zhanli_cfg['tuidao_' + cfg_view_idx]);
                this.shouPai[idx].setTouchAble(true);
                break;
        }
    },

    /**
     * 设置摸牌的外观
     * @param idx
     * @param state
     */
    setMoPaiAppearance: function (idx, state, cfg_view_idx) {
        if (!cfg_view_idx) {
            cfg_view_idx = idx;
        }
        switch (state) {
            case this.require_PlayerState.HUPAI:
                this.modepai.kaipai(this.pai3dCfg.shoupai_kaipai_cfg['frame_' + cfg_view_idx], this.pai3dCfg.shoupai_kaipai_cfg['value_' + cfg_view_idx], this.pai3dCfg.shoupai_kaipai_cfg, this.pai3dCfg.shoupai_kaipai_cfg['liangzhang_' + cfg_view_idx], this.pai3dCfg.shoupai_kaipai_cfg['hunpai_' + cfg_view_idx]);
                this.modepai.setTouchAble(false);
                this.modepai.mask.active = false;
                break;
            default:
                this.modepai.zhanli(this.pai3dCfg.shoupai_zhanli_cfg['frame_' + cfg_view_idx], this.pai3dCfg.shoupai_zhanli_cfg['value_' + cfg_view_idx], this.pai3dCfg.shoupai_zhanli_cfg['liangzhang_' + cfg_view_idx], this.pai3dCfg.shoupai_zhanli_cfg['hunpai_' + cfg_view_idx]);
                this.modepai.setTouchAble(true);
                if (state == this.require_PlayerState.TINGPAI) {
                    this.modepai.setTouch(false);
                }
                break;
        }
    },

    regTouchEvent: function () {
        this.touch_node.zIndex = UIZorder.MJ_TOUCH_NODE;
        this.touch_node.on(cc.Node.EventType.TOUCH_START, this.touchStart.bind(this));
        this.touch_node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove.bind(this));
        this.touch_node.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
        this.touch_node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel.bind(this));
    },

    touchStart: function (event) {
        if (this.require_DeskData.Instance().isHu) {
            this.closeJiaoInfo();
            return;
        }

        if (this.fenpai_touched) {
            return;
        }

        if (this.chupai_act) {
            return;
        }

        // if(!cc.dd._.isNull(cc.dd.NetWaitUtil.net_wait_id)){
        //     return;
        // }

        this.isCanMove = new Date().getTime();
        var pai_touched = this.getTouchPai(event);
        if (pai_touched) {
            this.yd_y = event.touch.getLocationY();

            this.pai_touched = pai_touched;
            if (this.pai_touched.selected) {
                this.pai_touched.doubleSelected = true;
            } else {
                this.resetSelected();
                this.pai_touched.selected = true;
                this.pai_touched.node.y = this.restPt_y() + this.chupai_offset;
                this.require_mj_audio.playAduio("select");
                this.biaojiPai(this.pai_touched.cardId);

                if (this.yidong_pai.node.active == false) {
                    if (!this.yidong_pai.cloned || this.yidong_pai.cardId != this.pai_touched.cardId) {
                        this.yidong_pai.clone(this.pai_touched);
                        this.yidong_pai.node.parent = cc.find('Canvas');
                        this.yidong_pai.node.active = false;
                        this.yidong_pai.cloned = true;
                        this.yidong_pai.node.scaleX = this.yidong_pai.node.scaleX * this._node_scale_x;
                        this.yidong_pai.node.scaleY = this.yidong_pai.node.scaleY * this._node_scale_y;
                        this.yidong_pai.node.x = event.touch.getLocationX() - this._offsetX;
                        this.yidong_pai.node.y = event.touch.getLocationY() - this._offsetY;
                    }
                }
            }

            if (this.touchCardMode == this.TingPaiTouchMode) {
                this.closeJiaoInfo();
                cc.log("mj touchStart openJiaoInfo");
                this.openJiaoInfo(this.pai_touched.cardId);
            }
        } else {
            this.resetSelected();
        }
    },

    touchMove: function (event) {
        if (this.require_DeskData.Instance().isHu) {
            return;
        }

        if (this.fenpai_touched) {
            return;
        }

        this.changePaiMove(event);

        if (this.pai_touched &&                          //没有选择牌
            // this.touchCardMode == TouchCardMode.CHU_PAI && //非出牌模式的时候不能滑动
            !this.require_UserPlayer.canhu) {                          //胡牌的时候不能滑动

            if (new Date().getTime() - this.isCanMove > 50 || this.isCanMove == null) {
                this.isCanMove = null;

                this.yidong_pai.node.x = event.touch.getLocationX() - this._offsetX;
                this.yidong_pai.node.y = event.touch.getLocationY() - this._offsetY;
                if (this.yidong_pai.node.y > this.pai_move_offset * this._node_scale_y) {
                    this.cloneYiDongPai();
                    this.yidong_pai.node.active = true;
                    this.pai_touched.node.active = false;
                    //滑动显示标记牌
                    this.biaojiPai(this.pai_touched.cardId);
                }
            }
        }
    },

    touchEnd: function (event) {
        if (this.require_DeskData.Instance().isHu) {
            this.yidong_pai.node.active = false;
            return;
        }

        if (this.require_DeskData.Instance().waitForSendOutCard) {
            this.resetSelected();
            return;
        }

        if (this.fenpai_touched) {
            return;
        }

        if (this.require_UserPlayer.canhu) {
            return;
        }

        if (!this.pai_touched) {
            return;
        } else {
            if (this.touchCardMode == this.TingPaiTouchMode) {
                this.closeJiaoInfo();
                this.openJiaoInfo(this.pai_touched.cardId);
            }
        }

        this.pai_touched = null;
        this.isCanMove = null;

        if (this.yidong_pai.node.active) {
            if (this.yidong_pai.node.y > this.pai_move_offset * this._node_scale_y) {
                //出牌
                // this.resetSelected();

                this.require_playerED.notifyEvent(this.require_PlayerEvent.SHOW_CLICK, [this.require_UserPlayer, false, null, 1]);

                var jlmj_pai = this.getShouPai(this.yidong_pai.cardId);
                if (this.require_UserPlayer.isTempBaoTing) {
                    var tingType = this.getTingType();
                    this.require_UserPlayer.setJiaoInfo(this.yidong_pai.cardId);
                    this.sendTingPai(this.yidong_pai.cardId, tingType);
                } else {
                    if (this.require_UserPlayer.hasMoPai()) {
                        this.sendOutCard(this.yidong_pai.cardId);
                        this.setShoupaiTingbiaoji(false);
                        this.yidong_pai_show = true;
                        // this.yidong_pai.node.runAction(cc.moveTo(0.05,cc.v2(0,-142)));
                    } else {
                        this.yidong_pai.node.active = false;
                        this.updateSelectedPai(this.require_UserPlayer);
                    }
                }
            }
            else {
                this.quxiaoBiaoji();
                this.yidong_pai.node.active = false;
                this.updateSelectedPai(this.require_UserPlayer);

                if (this.touchCardMode == 3) {
                    var arr = [];
                    var list = this.require_UserPlayer.jiaoInfo_list;
                    for (var i = 0; i < list.length; ++i) {
                        arr.push(list[i].out_id);
                    }

                    this.require_playerED.notifyEvent(this.require_PlayerEvent.SHOW_CLICK, [this.require_UserPlayer, true, arr, 3]);
                }
            }
        } else {
            var pai_touched = this.getTouchPai(event);

            if (!pai_touched) {
                this.resetSelected();
                if (this.touchCardMode == 3) {
                    var arr = [];
                    var list = this.require_UserPlayer.jiaoInfo_list;
                    for (var i = 0; i < list.length; ++i) {
                        arr.push(list[i].out_id);
                    }

                    this.require_playerED.notifyEvent(this.require_PlayerEvent.SHOW_CLICK, [this.require_UserPlayer, true, arr, 3]);
                }
                return;
            }
            if (this.require_DeskData.Instance().sendCard && this.require_DeskData.Instance().sendCard == pai_touched.cardId) {
                this.resetSelected();
                if (this.touchCardMode == 3) {
                    var arr = [];
                    var list = this.require_UserPlayer.jiaoInfo_list;
                    for (var i = 0; i < list.length; ++i) {
                        arr.push(list[i].out_id);
                    }

                    this.require_playerED.notifyEvent(this.require_PlayerEvent.SHOW_CLICK, [this.require_UserPlayer, true, arr, 3]);
                }
                return;
            }

            if (!pai_touched.doubleSelected) {
                if (event.touch.getLocationY() - this.yd_y > this.chupai_offset) {

                } else {
                    if (this.touchCardMode == 3) {
                        var arr = [];
                        var list = this.require_UserPlayer.jiaoInfo_list;
                        for (var i = 0; i < list.length; ++i) {
                            arr.push(list[i].out_id);
                        }

                        this.require_playerED.notifyEvent(this.require_PlayerEvent.SHOW_CLICK, [this.require_UserPlayer, true, arr, 3]);
                    }
                    return;
                }
            }

            //出牌
            this.require_playerED.notifyEvent(this.require_PlayerEvent.SHOW_CLICK, [this.require_UserPlayer, false, null, 1]);
            if (this.require_UserPlayer.isTempBaoTing) {
                var tingType = this.getTingType();
                this.require_UserPlayer.setJiaoInfo(pai_touched.cardId);
                this.sendTingPai(pai_touched.cardId, tingType);
                this.da_pai = true;
                /*if(!this.yidong_pai.cloned || this.yidong_pai.cardId != pai_touched.cardId){
                    this.yidong_pai.clone(pai_touched);
                    this.yidong_pai.node.parent = cc.find('Canvas');
                    this.yidong_pai.node.active = true;
                    this.pai_touched.node.active = false;
                    this.yidong_pai.node.x = pai_touched.node.x;
                    this.yidong_pai.node.y = pai_touched.node.y;
                    this.yidong_pai_show = true;
                    this.yidong_pai.node.runAction(cc.moveTo(0.05,cc.v2(0,-142)));
                }*/
            } else {
                if (this.require_UserPlayer.hasMoPai()) {
                    this.customTouchEndSendOutCard();
                    this.sendOutCard(pai_touched.cardId);
                    this.setShoupaiTingbiaoji(false);
                    this.da_pai = true;
                    if (!this.yidong_pai.cloned || this.yidong_pai.cardId != pai_touched.cardId) {
                        this.yidong_pai.clone(pai_touched);
                        this.yidong_pai.node.parent = cc.find('Canvas');
                        this.yidong_pai.node.active = true;
                        pai_touched.node.active = false;
                        this.yidong_pai.node.x = pai_touched.node.x;
                        this.yidong_pai.node.y = pai_touched.node.y;
                        this.yidong_pai_show = true;
                        // this.yidong_pai.node.runAction(cc.moveTo(0.05,cc.v2(0,-142)));
                    }
                }
            }

        }

        this.resetSelected();
        if (this.da_pai) {
            pai_touched.node.y += this.chupai_offset;
            this.da_pai = false;
        }

        this.touchDapai();
    },

    touchCancel: function (event) {
        if (this.pai_touched) {
            this.pai_touched.node.active = true;
        }
        this.pai_touched = null;
        this.isCanMove = null;
        this.yidong_pai.node.active = false;
        this.resetSelected();
        this.updateShouPai();
        if (this.touchCardMode == 3) {
            var arr = [];
            var list = this.require_UserPlayer.jiaoInfo_list;
            for (var i = 0; i < list.length; ++i) {
                arr.push(list[i].out_id);
            }

            this.require_playerED.notifyEvent(this.require_PlayerEvent.SHOW_CLICK, [this.require_UserPlayer, true, arr, 3]);
        }
    },

    /**
     * 移动手牌时经过其他手牌，换成该手牌
     * @param event
     */
    changePaiMove(event) {
        var pai_touched = this.getTouchPai(event);
        if (pai_touched) {//找到选择的牌
            //this.updateSelectedPai(this.require_UserPlayer);
            if (this.pai_touched) {
                this.pai_touched.node.active = true;
                this.yidong_pai.node.active = false
            }
            this.pai_touched = pai_touched;


            if (!this.pai_touched.selected) {
                this.resetSelected();
                this.pai_touched.selected = true;
                this.pai_touched.node.y = this.restPt_y() + this.chupai_offset;
                this.require_mj_audio.playAduio("select");
                this.biaojiPai(this.pai_touched.cardId);
                if (this.yidong_pai.node.active == true)
                    this.isCanMove = new Date().getTime();
            }
            if (pai_touched && this.touchCardMode == this.TingPaiTouchMode) {
                this.closeJiaoInfo();
                this.openJiaoInfo(this.pai_touched.cardId);
            }
        }
    },

    cloneYiDongPai() {
        if (this.yidong_pai.node.active == false) {
            if (!this.yidong_pai.cloned || this.yidong_pai.cardId != this.pai_touched.cardId) {
                this.yidong_pai.clone(this.pai_touched);
                this.yidong_pai.node.parent = cc.find('Canvas');
                this.yidong_pai.node.active = false;
                this.yidong_pai.cloned = true;
                this.yidong_pai.node.scaleX = this.yidong_pai.node.scaleX * this._node_scale_x;
                this.yidong_pai.node.scaleY = this.yidong_pai.node.scaleY * this._node_scale_y;
                this.yidong_pai.node.x = event.touch.getLocationX() - this._offsetX;
                this.yidong_pai.node.y = event.touch.getLocationY() - this._offsetY;
            }
        }
    },

    touchDapai() {
        if (this.canTouchPaiAni) {
            this.canTouchPaiAni = false;

            if (cc.dd._.isUndefined(pai3d_value.desc[this.require_DeskData.Instance().sendCard])) {
                return;
            }

            this.require_DeskData.Instance().last_chupai_id = this.require_DeskData.Instance().sendCard
            this.require_playerMgr.Instance().shou2mid_id_list.push(this.require_DeskData.Instance().sendCard);
            this.require_UserPlayer.dapai(this.require_DeskData.Instance().sendCard);
        }
    },

    getTouchPai: function (event) {
        for (let i = 0; i < this.shouPai.length; i++) {
            if (this.shouPai[i] && this.shouPai[i].isTouchDown(event)) {
                return this.shouPai[i];
            }
        }
        if (this.modepai.isTouchDown(event)) {
            return this.modepai;
        }
        return null;
    },

    /**
     * 恢复所有牌的初始化位置
     */
    resetSelected: function (cardID) {
        this.shouPai.forEach((pai) => {
            pai.selected = false;
            pai.doubleSelected = false;
            pai.node.y = this.restPt_y();
        });

        this.modepai.selected = false;
        this.modepai.doubleSelected = false;
        this.modepai.node.y = this.restPt_y();

        this.quxiaoBiaoji();
        this.closeJiaoInfo();
    },

    /**
     * 清除选择牌的数据 以及还原牌的选择
     */
    crearSelectCard: function () {
        this.resetSelected();
    },

    /**
     * 根据自己手上选择的牌 标记桌面上相同的牌
     * @param  cardID //自己选择的牌
     */
    biaojiPai: function (selectId) {
        this.quxiaoBiaoji();
        this.biaoji = [];
        var play_list = cc.find('Canvas/player_list').getComponent(mjComponentValue.playerList);
        var userList = play_list.getUserList();
        for (let i = 0; i < userList.length; i++) {
            var com = userList[i].getComponent(mjComponentValue.playerDownUI);
            if (!com) {//因为自己方为jlmj_player_base_ui子类  直接用则出牌列表为空
                com = userList[i];
            }
            var tem = com.getPaiToID(selectId);
            this.biaoji = this.biaoji.concat(tem);
        }
        for (var i = 0; this.biaoji && i < this.biaoji.length; ++i) {
            this.biaoji[i].setSelectedBiaoji(true);
        }
    },

    quxiaoBiaoji: function () {
        if (this.biaoji) {
            for (var i = 0; i < this.biaoji.length; ++i) {
                if (this.biaoji[i] && this.biaoji[i].node && this.biaoji[i].node.isValid) {
                    this.biaoji[i].setSelectedBiaoji(false);
                }
            }
        }
        this.biaoji = null;
    },


    zhanli: function () {
        this.shouPai.forEach(function (jlmj_pai, idx) {
            if (jlmj_pai) {
                jlmj_pai.zhanli(this.pai3dCfg.shoupai_zhanli_cfg['frame_' + idx], this.pai3dCfg.shoupai_zhanli_cfg['value_' + idx], this.pai3dCfg.shoupai_zhanli_cfg['liangzhang_' + idx], this.pai3dCfg.shoupai_zhanli_cfg['hunpai_' + idx]);
                jlmj_pai.setTouchAble(true);
            }
        }, this);
        var _idx = 13;
        this.modepai.zhanli(this.pai3dCfg.shoupai_zhanli_cfg['frame_' + _idx], this.pai3dCfg.shoupai_zhanli_cfg['value_' + _idx], this.pai3dCfg.shoupai_zhanli_cfg['liangzhang_' + _idx], this.pai3dCfg.shoupai_zhanli_cfg['hunpai_' + _idx]);
        var lastPos = this.modepai.node.getPosition();
        this.modepai.node.setPosition(lastPos.x + this.pai3dCfg.mopai.offsetX, lastPos.y + this.pai3dCfg.mopai.offsetY);
        this.modepai.setTouchAble(true);
    },

    mopai: function (userplayer) {
        this.updateShouPai(userplayer);
        this.quxiaoBiaoji();
    },
    /**
     * 自动打牌
     * @param userplayer
     */
    autoChupai: function (palyData, cardId) {
        setTimeout(function () {
            if (palyData.ishavePai(cardId)) {
                this.sendOutCard(cardId);
            }
        }.bind(this), 500);
    },


    dapai: function (userplayer, chupai_idx_in_shoupai) {
        // if(this.require_UserPlayer.mid2dapai_playing){
        //     return;
        // }
        // this.require_UserPlayer.mid2dapai_playing = true;

        this.modepai.node.active = false;
        var pai_node = cc.instantiate(this.prefab_pai);
        this.chupai_node.addChild(pai_node);
        this.chuPai.push(pai_node);
        var jlmj_pai = pai_node.getComponent(mjConfigValue.mjPai);
        if (!jlmj_pai) {
            cc.error("麻将牌没有jlmj_pai组件")
        }
        var idx = userplayer.chupai.length - 1;
        var cur_idx = userplayer.chupai.length - 1;
        var last_chupai_idx = this.chuPai.length - 1;
        if (this.require_playerMgr.Instance().playerList.length == 2) {
            // let count = this.require_DeskData.Instance().getIs2D() ? 19 : 18;
            // let total = 2;
            // var pos_id = total - Math.floor((this.chuPai.length - 1) / count);
            // var cur_pai = (this.chuPai.length - 1) % count;
            // var cur_id = pos_id * count + cur_pai;
            // cur_idx = cur_id;
            // last_chupai_idx = cur_id;
        }

        var value = userplayer.chupai[idx];
        jlmj_pai.kaipai(this.getDaPaiCfg()['frame_' + cur_idx], this.getDaPaiCfg()['value_' + cur_idx], this.pai3dCfg.dapai_cfg, this.getDaPaiCfg()['liangzhang_' + cur_idx], this.getDaPaiCfg()['hunpai_' + cur_idx]);
        jlmj_pai.setValue(value);
        cc.log("【UI】" + "玩家:" + userplayer.userId + " 座位号:" + userplayer.idx + " 打牌:" + pai3d_value.desc[value] + " 快出牌:" + userplayer.isQuick);

        //出牌动画
        this.stop_chupai_ani();
        if (userplayer.isQuick) {
            this.play_chupai_ani(userplayer, chupai_idx_in_shoupai, last_chupai_idx, value);
        } else {
            this.play_chupai_ani_old(userplayer, chupai_idx_in_shoupai, last_chupai_idx, value);
        }
    },

    stop_chupai_ani: function () {
        this.zhanshi_pai.node.stopAllActions();
        this.mid2dapai_playing = false;
        this.zhanshi_pai.node.active = false;
        this.zhanshi_pai.ani.stop();
        this.chuPai.forEach(function (pai) {
            pai.active = true;
        });
    },


    play_chupai_ani: function (userplayer, chupai_idx_in_shoupai, last_chupai_idx, cardID) {
        //中间牌转变打牌end
        var mid2dapaiEnd = function () {
            // this.require_UserPlayer.mid2dapai_playing = false;
            // if(cc.dd._.isArray(this.require_UserPlayer.waitDapai) && this.require_UserPlayer.waitDapai.length > 0){
            //     let pai = this.require_UserPlayer.waitDapai.shift();
            //     this.require_playerMgr.Instance().shou2mid_id_list.push(pai);
            //     this.require_UserPlayer.dapai(pai);
            // }

            this.mid2dapai_playing = false;
            this.zhanshi_pai.ani.off('finished', mid2dapaiEnd);
            if (this.zhanshi_pai.cardId != cardID) {
                cc.log("出牌动画-提前结束");
                return;
            }
            cc.log('中间牌-打牌-end');
            this.zhanshi_pai.node.active = false;
            if (this.chuPai.length <= 0) {
                return;
            }
            //var last_chupai_idx = this.chuPai.length - 1;
            this.chuPai[this.chuPai.length - 1].active = true;
            this.setZsq(this.chuPai[this.chuPai.length - 1], this.viewIdx);
            this.require_playerMgr.Instance().playerMoPaiAction();
        }.bind(this);

        // this.require_playerMgr.Instance().playing_shou2mid_ani = true;
        this.chuPai[this.chuPai.length - 1].active = false;
        this.zhanshi_pai.setValue(cardID);

        //this.updateShouPai(this.require_UserPlayer);
        this.require_DeskData.Instance().sendCard = null;
        // this.zhanshi_pai.ani.on('finished', shou2midEnd);

        cc.log('手牌-中间牌-start');
        this.zhanshi_pai.node.active = true;
        if (this.yidong_pai && this.yidong_pai.node) {
            this.yidong_pai.node.active = false;
            if (!this.yidong_pai_show && this.pai_touched) {
                this.pai_touched.node.active = true;
                this.resetSelected();
            }
        }

        //新
        this.zhanshi_pai.node.active = true;

        var id = this.require_playerMgr.Instance().shou2mid_id_list.pop();
        this.require_playerMgr.Instance().mid2dapai_id_list.push(id);

        if (this.require_playerMgr.Instance().mid2dapai_id_list.indexOf(cardID) != -1) {   //下家正常摸牌了,播放入牌海动画
            cc.log('下家正常摸牌了,播放入牌海动画');
            cc.dd._.pull(this.require_playerMgr.Instance().mid2dapai_id_list, cardID);
        }
        let config = this.getDaPaiCfg();
        let targetPos = cc.v2(config['frame_' + last_chupai_idx].x, config['frame_' + last_chupai_idx].y);
        if (!this.isNeimeng) {
            this.zhanshi_pai.kaipai(config['frame_' + last_chupai_idx], config['value_' + last_chupai_idx], this.pai3dCfg.dapai_cfg, null, config['hunpai_' + last_chupai_idx]);
        }
        //新

        // this.reset_zhanshi_pai();
        this.zhanshi_pai.node.stopAllActions();

        var idx = chupai_idx_in_shoupai;
        if (chupai_idx_in_shoupai == this.require_UserPlayer.shoupai.length) { //打牌后,此时牌数据已经少了一张
            this.modepai.node.active = false;
            this.modepai.node.y = this.restPt_y();
            if (this.yidong_pai_show) {
                this.zhanshi_pai.node.x = this.yidong_pai.node.x;
                this.zhanshi_pai.node.y = this.yidong_pai.node.y;
                this.yidong_pai_show = null;
            } else {
                this.zhanshi_pai.node.x = this.modepai.node.x;
                this.zhanshi_pai.node.y = this.modepai.node.y + this.chupai_offset;
            }
        } else {
            var shoupai_visible_cfg = {
                1: [12],
                4: [9, 10, 11, 12],
                7: [6, 7, 8, 9, 10, 11, 12],
                10: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            };
            if (!shoupai_visible_cfg[this.require_UserPlayer.shoupai.length]) {
                cc.error('手牌数量不正确' + this.require_UserPlayer.shoupai.length, ' ' + pai3d_value.descs(this.require_UserPlayer.shoupai));
                mid2dapaiEnd();
                return;
            }
            idx = shoupai_visible_cfg[this.require_UserPlayer.shoupai.length][chupai_idx_in_shoupai];
            this.shouPai[idx].node.active = false;
            this.shouPai[idx].node.y = this.restPt_y();
            if (this.yidong_pai_show) {
                this.zhanshi_pai.node.x = this.yidong_pai.node.x;
                this.zhanshi_pai.node.y = this.yidong_pai.node.y;
                this.yidong_pai_show = null;
            } else {
                this.zhanshi_pai.node.x = this.shouPai[idx].node.x;
                this.zhanshi_pai.node.y = this.shouPai[idx].node.y + this.chupai_offset;
            }
        }

        if (this.isNeimeng) {
            let chupai = this.chuPai[this.chuPai.length - 1];
            let scaleX = (chupai.width * chupai.scaleX) / (this.zhanshi_pai.node.width * this.zhanshi_pai.node.scaleX);
            let scaleY = (chupai.height * chupai.scaleY) / (this.zhanshi_pai.node.height * this.zhanshi_pai.node.scaleY);

            var seq = cc.sequence(
                cc.callFunc(() => {
                    this.require_mj_audio.playAduio('dapai');
                }),
                cc.spawn(
                    cc.moveTo(0.05, targetPos).easing(cc.easeQuarticActionOut(3.0)),
                    cc.scaleTo(0.05, scaleX, scaleY).easing(cc.easeQuarticActionOut(3.0)),
                ),
                cc.callFunc(mid2dapaiEnd.bind(this))
            );
            this.zhanshi_pai.node.runAction(seq);
        } else {
            var seq = cc.sequence(
                cc.callFunc(() => {
                    this.require_mj_audio.playAduio('dapai');
                }),
                cc.moveTo(0.2, targetPos).easing(cc.easeQuarticActionOut(3.0)),
                cc.callFunc(mid2dapaiEnd.bind(this))
            );
            this.zhanshi_pai.node.runAction(seq);
        }

        this.require_mj_audio.playAduio('effect_sendcard');
        //插牌动画
        this.pluggedPai(userplayer, chupai_idx_in_shoupai);
    },

    play_chupai_ani_old: function (userplayer, chupai_idx_in_shoupai, last_chupai_idx, cardID) {
        //中间牌转变打牌end
        var mid2dapaiEnd = function () {
            this.mid2dapai_playing = false;
            this.zhanshi_pai.ani.off('finished', mid2dapaiEnd);
            if (this.zhanshi_pai.cardId != cardID) {
                cc.log("出牌动画-提前结束");
                return;
            }
            cc.log('中间牌-打牌-end');
            this.zhanshi_pai.node.active = false;
            if (this.chuPai.length <= 0) {
                return;
            }
            //var last_chupai_idx = this.chuPai.length - 1;
            this.chuPai[this.chuPai.length - 1].active = true;
            this.setZsq(this.chuPai[this.chuPai.length - 1], this.viewIdx);
            this.require_playerMgr.Instance().playerMoPaiAction();
        }.bind(this);
        //中间牌转变打牌
        var mid2dapai = function () {
            if (this.zhanshi_pai.cardId != cardID) {
                cc.log("出牌动画-提前结束");
                return;
            }
            cc.log('中间牌-打牌-start');
            if (this.chuPai.length <= 0) {
                return;
            }
            //var last_chupai_idx = this.chuPai.length - 1;
            cc.resources.load(this.getMid2DaPaiAniPath() + last_chupai_idx, function (err, clip) {
                if (err != null) {
                    cc.error(err.message);
                }
                if (this.zhanshi_pai.cardId != cardID) {
                    cc.log("出牌动画-提前结束");
                    return;
                }
                setTimeout(function () {
                    this.mid2dapai_playing = true;
                }.bind(this), 200);
                this.zhanshi_pai.ani.removeClip('mid2dapai');
                this.zhanshi_pai.ani.addClip(clip, 'mid2dapai');
                this.zhanshi_pai.ani.play('mid2dapai');
                this.zhanshi_pai.ani.on('finished', mid2dapaiEnd);
                this.require_mj_audio.playAduio('dapai');
            }.bind(this));
        }.bind(this);
        //手牌转变中间牌end
        var shou2midEnd = function () {
            this.zhanshi_pai.ani.off('finished', shou2midEnd);
            if (this.zhanshi_pai.cardId != cardID) {
                cc.log("出牌动画-提前结束");
                this.require_playerMgr.Instance().playing_shou2mid_ani = false;
                return;
            }
            cc.log('手牌-中间牌-end');

            // var id = this.require_playerMgr.Instance().shou2mid_id_list.pop();
            // this.require_playerMgr.Instance().mid2dapai_id_list.push(id);

            if (this.require_DeskData.Instance().dabaoing) {   //打宝中,暂停播放打牌动画
                // this.dapai_ani_paused = true;
                this.require_playerMgr.Instance().dabaoing_chupai_id = cardID;
                return;
            } else {
                setTimeout(function () {
                    this.require_playerMgr.Instance().playing_shou2mid_ani = false;
                    this.require_playerMgr.Instance().playerMoPaiAction();
                    if (this.require_playerMgr.Instance().mid2dapai_id_list.indexOf(cardID) != -1) {   //下家正常摸牌了,播放入牌海动画
                        cc.log('下家正常摸牌了,播放入牌海动画');
                        cc.dd._.pull(this.require_playerMgr.Instance().mid2dapai_id_list, cardID);
                        mid2dapai();
                    }
                }.bind(this), 300);
            }
        }.bind(this);

        this.require_playerMgr.Instance().playing_shou2mid_ani = true;
        this.chuPai[this.chuPai.length - 1].active = false;
        this.zhanshi_pai.setValue(cardID);

        //this.updateShouPai(this.require_UserPlayer);
        this.require_DeskData.Instance().sendCard = null;
        // this.zhanshi_pai.ani.on('finished', shou2midEnd);

        cc.log('手牌-中间牌-start');
        this.zhanshi_pai.node.active = true;
        this.zhanshi_pai.node.parent = this.zhanshi_pai_node;
        this.zhanshi_pai.node.stopAllActions();

        if (this.yidong_pai && this.yidong_pai.node) {
            this.yidong_pai.node.active = false;
        }

        this.reset_zhanshi_pai();
        var idx = chupai_idx_in_shoupai;
        if (chupai_idx_in_shoupai == this.require_UserPlayer.shoupai.length) { //打牌后,此时牌数据已经少了一张
            this.modepai.node.active = false;
            this.modepai.node.y = this.restPt_y();
            if (this.yidong_pai_show) {
                this.zhanshi_pai.node.x = this.yidong_pai.node.x;
                this.zhanshi_pai.node.y = this.yidong_pai.node.y;
                this.yidong_pai_show = null;
            } else {
                this.zhanshi_pai.node.x = this.modepai.node.x;
                this.zhanshi_pai.node.y = this.modepai.node.y + this.chupai_offset;
            }
        } else {
            var shoupai_visible_cfg = {
                1: [12],
                4: [9, 10, 11, 12],
                7: [6, 7, 8, 9, 10, 11, 12],
                10: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            };
            if (!shoupai_visible_cfg[this.require_UserPlayer.shoupai.length]) {
                cc.error('手牌数量不正确' + this.require_UserPlayer.shoupai.length, ' ' + pai3d_value.descs(this.require_UserPlayer.shoupai));
                setTimeout(function () {
                    this.require_playerMgr.Instance().playing_shou2mid_ani = false;
                    this.require_playerMgr.Instance().playerMoPaiAction();
                    if (this.require_playerMgr.Instance().mid2dapai_id_list.indexOf(cardID) != -1) {   //下家正常摸牌了,播放入牌海动画
                        cc.log('下家正常摸牌了,播放入牌海动画');
                        cc.dd._.pull(this.require_playerMgr.Instance().mid2dapai_id_list, cardID);
                        mid2dapaiEnd();
                    }
                }.bind(this), 180);
                return;
            }
            idx = shoupai_visible_cfg[this.require_UserPlayer.shoupai.length][chupai_idx_in_shoupai];
            this.shouPai[idx].node.active = false;
            this.shouPai[idx].node.y = this.restPt_y();
            if (this.yidong_pai_show) {
                this.zhanshi_pai.node.x = this.yidong_pai.node.x;
                this.zhanshi_pai.node.y = this.yidong_pai.node.y;
                this.yidong_pai_show = null;
            } else {
                this.zhanshi_pai.node.x = this.shouPai[idx].node.x;
                this.zhanshi_pai.node.y = this.shouPai[idx].node.y + this.chupai_offset;
            }
        }
        this.zhanshi_pai.node.stopAllActions();
        var seq = cc.sequence(
            cc.moveTo(0.05, cc.v2(0, -142)),
            cc.delayTime(0.03),
            cc.callFunc(shou2midEnd.bind(this))
        );
        this.zhanshi_pai.node.runAction(seq);
        this.require_mj_audio.playAduio('effect_sendcard');
        //插牌动画
        this.pluggedPai(userplayer, chupai_idx_in_shoupai);
    },

    pluggedPai: function (player, kongpai_idx) {
        if (!player.replaying && kongpai_idx != this.require_UserPlayer.shoupai.length) {
            //插牌动画
            if (this.chupai_act) {
                cc.log('【插入手牌动画中】退出');
                return;
            } else {
                this.chupai_act = true;
                cc.log('【插入手牌动画】 开始');
            }
            var paiShow = function () {
                if (!player.replaying) {
                    this.modepai.node.active = false;
                    cc.log('【更新手牌】 开始');
                    cc.log('【插入手牌动画】 结束');
                    this.updateShouPai(this.require_UserPlayer);
                    this.modepai.node.x = this.modepai.original_x;
                    this.modepai.node.y = this.modepai.original_y;
                    this.chupai_act = false;
                }
            }.bind(this);

            this.modepai.original_x = this.modepai.node.x;
            this.modepai.original_y = this.modepai.node.y;
            var px_id = 0;
            var shoupai_visible_cfg = {
                1: [12],
                4: [9, 10, 11, 12],
                7: [6, 7, 8, 9, 10, 11, 12],
                10: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                13: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            };

            var kp_idx = shoupai_visible_cfg[this.require_UserPlayer.shoupai.length][kongpai_idx];

            for (var i = 0, len = player.shoupai.length; i < len; ++i) {
                if (this.modepai.cardId == player.shoupai[i]) {
                    px_id = shoupai_visible_cfg[player.shoupai.length][i];
                    break;
                }
            }
            this.chapai_x = this.shouPai[px_id].node.x;
            this.chapai_y = this.shouPai[px_id].node.y;

            this.modepai.node.active = true;
            this.shouPai[kp_idx].node.active = false;

            //插牌动画
            if (px_id == this.shouPai.length - 1) {
                if (this.isNeimeng) {
                    this.modepai.node.runAction(cc.sequence(
                        cc.delayTime(0.05),
                        cc.moveTo(0, this.chapai_x, this.chapai_y).easing(cc.easeSineInOut()),
                        cc.callFunc(paiShow.bind(this))
                    ));
                } else {
                    this.modepai.node.runAction(cc.sequence(
                        cc.delayTime(0.4),
                        cc.moveTo(0.2, this.chapai_x, this.chapai_y).easing(cc.easeSineInOut()),
                        cc.callFunc(paiShow.bind(this))
                    ));
                }
            } else {
                if (this.isNeimeng) {
                    this.modepai.node.runAction(cc.sequence(
                        cc.delayTime(0.05),
                        cc.moveTo(0, this.chapai_x, this.chapai_y).easing(cc.easeSineInOut()),
                        cc.callFunc(paiShow.bind(this))
                    ));
                } else {
                    var start_pos = cc.v2(this.modepai.node.x, this.modepai.node.y + this.modepai.node.height);
                    var end_pos = cc.v2(this.chapai_x, this.chapai_y + this.modepai.node.height);
                    var q2x = start_pos.x + (end_pos.x - end_pos.x) / 2.0;
                    var q2 = cc.v2(q2x, start_pos.y);
                    var bezier = [start_pos, q2, end_pos];
                    this.modepai.node.runAction(cc.sequence(
                        cc.rotateBy(0.1, 30),
                        cc.bezierTo(0.2, bezier).easing(cc.easeSineOut()),
                        cc.spawn(
                            cc.rotateBy(0.1, -30),
                            cc.moveTo(0.1, this.chapai_x, this.chapai_y).easing(cc.easeSineInOut())
                        ),
                        cc.delayTime(0.1),
                        cc.callFunc(paiShow.bind(this))
                    ));
                }

            }

            let delayTime = 0.2;
            let moveTime = 0.1;

            if (this.isNeimeng) {
                delayTime = 0.05;
                moveTime = 0;
            }

            //合牌动画
            if (px_id > kp_idx) {
                for (var i = px_id; i > kp_idx; --i) {
                    var pai = this.shouPai[i];
                    pai.original_x = pai.node.x;
                    pai.original_y = pai.node.y;
                    pai.node.runAction(
                        cc.sequence(
                            cc.delayTime(delayTime),
                            cc.moveTo(moveTime, this.shouPai[i - 1].node.x, this.shouPai[i - 1].node.y).easing(cc.easeSineInOut())
                        )
                    );
                }
            } else if (px_id < kp_idx) {
                for (var i = px_id; i < kp_idx; ++i) {
                    var pai = this.shouPai[i];
                    pai.original_x = pai.node.x;
                    pai.original_y = pai.node.y;
                    pai.node.runAction(
                        cc.sequence(
                            cc.delayTime(delayTime),
                            cc.moveTo(moveTime, this.shouPai[i + 1].node.x, this.shouPai[i + 1].node.y).easing(cc.easeSineInOut())
                        )
                    );
                }
            }
        } else {
            // this.require_UserPlayer.mid2dapai_playing = false;
            this.updateShouPai(this.require_UserPlayer);
        }
    },

    update: function () {
        if (this.mid2dapai_playing && this.zhanshi_pai.node.active) {
            var length = this.chuPai.length;
            if (length >= 12) {
                var x = this.getDaPaiCfg()['frame_' + (length - 1)].x;
                var y = this.getDaPaiCfg()['frame_' + (length - 1)].y;
                var width = this.getDaPaiCfg()['frame_' + (length - 1)].sizeW;
                var height = this.getDaPaiCfg()['frame_' + (length - 1)].sizeH;
                var order_rect = cc.rect(x - width / 2, y - height / 2, width, height);
                if (order_rect.contains(this.zhanshi_pai.node.getPosition())) {
                    this.zhanshi_pai.node.active = false;
                    this.chuPai.forEach(function (pai) {
                        pai.active = true;
                    });
                    var last_chupai_idx = this.chuPai.length - 1;
                    this.setZsq(this.chuPai[last_chupai_idx], this.viewIdx);
                }
            }
        }
    },

    /**
     * 播放中间牌->打牌动作
     */
    play_mid2dapai_ani: function (id) {
        // if(!this.dapai_ani_paused){
        //     return;
        // }
        if (!this.zhanshi_pai.node.active) {
            return;
        }
        if (this.zhanshi_pai.cardId != id) {
            return;
        }
        // this.dapai_ani_paused = false;
        //中间牌转变打牌end
        var mid2dapaiEnd = function () {
            this.mid2dapai_playing = false;
            this.zhanshi_pai.ani.off('finished', mid2dapaiEnd);
            // if (this.zhanshi_pai.cardId != cardID) {
            //     cc.log("出牌动画-提前结束");
            //     return;
            // }
            cc.log('中间牌-打牌-end');
            this.zhanshi_pai.node.active = false;
            if (this.chuPai.length <= 0) {
                return;
            }
            var last_chupai_idx = this.chuPai.length - 1;
            this.chuPai[last_chupai_idx].active = true;
            this.setZsq(this.chuPai[last_chupai_idx], this.viewIdx);
            this.require_playerMgr.Instance().playerMoPaiAction();
        }.bind(this);
        //中间牌转变打牌
        var mid2dapai = function () {
            // if (this.zhanshi_pai.cardId != cardID) {
            //     cc.log("出牌动画-提前结束");
            //     return;
            // }
            cc.log('中间牌-打牌-start');
            if (this.chuPai.length <= 0) {
                return;
            }
            var player_list = this.require_playerMgr.Instance().playerList;
            var last_chupai_idx = this.chuPai.length - 1;
            if (player_list.length == 2) {
                // let count = this.require_DeskData.Instance().getIs2D() ? 19 : 18;
                // let total = 2;
                // var pos_id = total - Math.floor((this.chuPai.length - 1) / count);
                // var cur_pai = (this.chuPai.length - 1) % count;
                // last_chupai_idx = pos_id * count + cur_pai;
            }

            //var last_chupai_idx = this.chuPai.length - 1;
            cc.resources.load(this.getMid2DaPaiAniPath() + last_chupai_idx, function (err, clip) {
                if (err != null) {
                    cc.error(err.message);
                }
                // if (this.zhanshi_pai.cardId != cardID) {
                //     cc.log("出牌动画-提前结束");
                //     return;
                // }

                let timeOut = 200;
                if (this.isNeimeng) {
                    timeOut = 50;
                }

                setTimeout(function () {
                    this.mid2dapai_playing = true;
                }.bind(this), timeOut);
                this.zhanshi_pai.ani.removeClip('mid2dapai');
                this.zhanshi_pai.ani.addClip(clip, 'mid2dapai');
                this.zhanshi_pai.ani.play('mid2dapai');
                this.zhanshi_pai.ani.on('finished', mid2dapaiEnd);
                this.require_mj_audio.playAduio('dapai');
            }.bind(this));
        }.bind(this);

        this.zhanshi_pai.node.stopAllActions();
        this.zhanshi_pai.node.x = 0;
        this.zhanshi_pai.node.y = -142;
        mid2dapai();
    },

    /**
     * 打开叫牌信息
     * @param out_id
     */
    openJiaoInfo: function (out_id) {
        var jiaoInfo = this.require_UserPlayer.getJiaoInfo(out_id);
        if (!jiaoInfo) {
            return;
        }
        cc.dd.UIMgr.openUI(this.require_jlmj_prefab.JLMJ_JIAOPAI_INFO, function (ui) {
            var play_list = cc.find('Canvas/player_list').getComponent(mjComponentValue.playerList);
            var mj_jiao_info = ui.getComponent('mj_jiao_info');
            play_list.node.zIndex = UIZorder.MJ_JIAOINFO_UI;
            mj_jiao_info.init(play_list);
            mj_jiao_info.setJiaoPaiList(jiaoInfo.jiao_pai_list);
        }.bind(this));
    },

    /**
     * 关闭叫牌信息
     */
    closeJiaoInfo: function () {
        cc.dd.UIMgr.closeUI(this.require_jlmj_prefab.JLMJ_JIAOPAI_INFO);
    },

    /**
     * 获取手牌
     * @param id
     */
    getShouPai: function (id) {
        if (this.modepai.node.active && this.modepai.cardId == id) {
            return this.modepai;
        }
        for (var i = 0; i < this.shouPai.length; ++i) {
            var jlmj_pai = this.shouPai[i];
            if (jlmj_pai && jlmj_pai.cardId == id && jlmj_pai.node.active) {
                return jlmj_pai;
            }
        }
        return null;
    },
    /**
     * 显示或者隐藏牌的可操作
     * @param isShow
     * @param canCradList
     */
    showHideClickCard: function (isShow, canCradList, type) {
        this.touchCardMode = type || 1;
        isShow = isShow || false;
        if (isShow && canCradList) {//可以操作canCardList中牌
            this.openPaitouch(canCradList);
        } else {//全部牌可以操作
            //可以听牌时要把牌处理成不能选状态
            this.setShoupaiTouch(!this.require_UserPlayer.isBaoTing);
            if (this.modepai) {
                this.modepai.setTouchAble(true);
            }
        }
    },

    showDaPaiTing: function (isShow, canCradList, type) {
        this.setShoupaiTingbiaoji(false);
        this.touchCardMode = type || 4;
        isShow = isShow || false;
        if (isShow && canCradList) {//可以操作canCardList中牌
            for (var i = 0; i < canCradList.length; ++i) {
                var shoupai = this.getShouPai(canCradList[i]);
                if (shoupai && !shoupai.isHunPai) {
                    shoupai.setTouchAble(true);
                    shoupai.setTingPai(true);
                } else {
                    cc.error("【UI】" + "用户玩家中不存在牌:" + pai3d_value.desc[canCradList[i]]);
                }
            }
        }
    },

    /**
     * 开启部分牌的触摸
     * @param cardList
     */
    openPaitouch: function (canCradList) {

        if (this.modepai) {
            this.modepai.setTouchAble(false);
        }
        this.setShoupaiTingbiaoji(false);
        this.setShoupaiTouch(false);//关闭手牌的触摸
        for (var i = 0; i < canCradList.length; ++i) {
            var shoupai = this.getShouPai(canCradList[i]);
            if (shoupai) {
                shoupai.setTouchAble(true);
                if (this.touchCardMode == 3 && !shoupai.isHunPai) {
                    shoupai.setTingPai(true);
                }
            } else {
                cc.error("【UI】" + "用户玩家中不存在牌:" + pai3d_value.desc[canCradList[i]]);
            }
        }
    },


    /**
     * gm更新手牌
     */
    gmUpdateShouPai: function (data) {
        var userplayer = data[0];
        this.updateShouPai(userplayer);

    },

    /**
     * 听
     * @param data
     */
    ting: function (player) {
        this.updateShouPai(player);
        this.setShoupaiTouch(false);
        this.closeJiaoInfo();
        var desk_info = cc.find('Canvas/desk_info').getComponent(mjComponentValue.deskInfo);
        desk_info.setTingPaiUIActive(true);

        this.require_mj_audio.playAudioBySex("ting", player.sex);
        // this.tcp_ani.node.active = true;
        // this.tcp_ani.playAnimation('ting',1);
        // this.tcp_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.tcpAniCallback, this);

        this.playSpine(this.cpgtgh_ani, ['ting', 'tingXS']);

        this.require_DeskED.notifyEvent(this.require_DeskEvent.UPDATE_BAO_PAI, []);

    },

    /**
     * 潇洒
     * @param data
     */
    xiaosa: function (player) {
        this.updateShouPai(player);
        this.setShoupaiTouch(false);
        this.closeJiaoInfo();
        var desk_info = cc.find('Canvas/desk_info').getComponent(mjComponentValue.deskInfo);
        desk_info.setTingPaiUIActive(true);

        this.require_mj_audio.playAudioBySex("xiaosa", player.sex);
        // this.tcp_ani.node.active = true;
        // this.tcp_ani.playAnimation('ting',1);
        // this.tcp_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.tcpAniCallback, this);
        this.playSpine(this.xiaosa_ani, ['xiaosa', 'xiaosaXS']);
    },

    chiTing: function (player, isxiaosa) {
        this.resetBaiPai(player);
        this.updateShouPai(player);
        this.setShoupaiTouch(false);
        this.closeJiaoInfo();
        var desk_info = cc.find('Canvas/desk_info').getComponent(mjComponentValue.deskInfo);
        desk_info.setTingPaiUIActive(true);

        this.require_mj_audio.playAudioBySex("ting", player.sex);
        // this.ani2_ani.node.active = true;
        // this.ani2_ani.setAnimation(0,"chiting",false);
        // this.ani2_ani.scheduleOnce(function () {
        //     this.ani2_ani.clearTracks();
        //     this.ani2_ani.node.active = false;
        //     cc.log("tcp call back ---------");
        // }.bind(this), 2);
        this.playSpine(this.dgpt_ani, ['chiting', 'chitingXS']);
    },

    pengTing: function (player, isxiaosa) {
        this.resetBaiPai(player);
        this.updateShouPai(player);
        this.setShoupaiTouch(false);
        this.closeJiaoInfo();
        var desk_info = cc.find('Canvas/desk_info').getComponent(mjComponentValue.deskInfo);
        desk_info.setTingPaiUIActive(true);

        this.require_mj_audio.playAudioBySex("ting", player.sex);
        // this.ani2_ani.node.active = true;
        // this.ani2_ani.setAnimation(0,"chating",false);
        // this.ani2_ani.scheduleOnce(function () {
        //     this.ani2_ani.clearTracks();
        //     this.ani2_ani.node.active = false;
        //     cc.log("tcp call back ---------");
        // }.bind(this), 2);
        this.playSpine(this.dgpt_ani, ['chating', 'chatingXS']);
    },

    gangTing: function (player, isxiaosa) {
        this.resetBaiPai(player);
        this.updateShouPai(player);
        this.setShoupaiTouch(false);
        this.closeJiaoInfo();
        var desk_info = cc.find('Canvas/desk_info').getComponent(mjComponentValue.deskInfo);
        desk_info.setTingPaiUIActive(true);
        this.require_mj_audio.playAudioBySex("ting", player.sex);
        // this.db_hu_4.node.active = true;
        // this.db_hu_4.setAnimation(0,"gangtingCX",false);
        // this.db_hu_4.scheduleOnce(function () {
        //     this.db_hu_4.clearTracks();
        //     this.db_hu_4.node.active = false;
        //     cc.log("tcp call back ---------");
        // }.bind(this), 2);
        this.playSpine(this.dgpt_ani, ['gangting', 'gangtingXS']);
        if (isxiaosa) {
            setTimeout(() => {
                this.require_mj_audio.playAudioBySex("xiaosa", player.sex);
            }, 1700);
        }
    },

    /**
     * 彩虹杠
     */
    caiHonggang: function (data) {
        var player = data[0];
        var baipai_data = data[1];
        // this.addZFBGPai(baipai_data);
        this.resetBaiPai(data[0]);
        this.updateShouPai(player);
        if (!data[2]) {
            return;
        }
        this.require_mj_audio.playAudioBySex("gang", player.sex);
        //this.play_ani.play("jlmj_mingdan_texiao");
        // this.jbdga_ani.node.active = true;
        // this.jbdga_ani.playAnimation('caigang',1);
        // this.jbdga_ani.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.jbdgaAniCallback, this);
        this.playSpine(this.dgpt_ani, ['caigang', 'caigangXS']);
    },

    /**
     * 清理
     * @param data
     */
    clear: function (data) {
        this.zhanshi_pai.node.active = false;
        this.touchCardMode = TouchCardMode.CHU_PAI;

        cc.log("player_down_ui 清理桌子");
        this.shouPai.forEach(function (pai) {
            pai.setHunPai(false);
            pai.setTouchAble(true);
            pai.node.active = false;

            //todo 朋友场 临时处理
            pai.value.node.active = false;
            pai.mask.active = false;
        });

        this.chuPai.forEach(function (pai) {
            pai.destroy();
        });
        this.chuPai = [];

        this.baipai_ui_list.forEach(function (baipai_ui) {
            baipai_ui.clear();
        });
        this.baipai_ui_list = [];
        if (this.buhua_ui) {
            this.buhua_ui.clear();
        }
        this.buhua_ui = null;
        if (this.modepai) {
            this.modepai.node.active = false;
            this.modepai.setHunPai(false);
            //todo 朋友场 临时处理
            this.modepai.value.node.active = false;
            this.modepai.mask.active = false;
        }
        this.head.setZJ(false);
        this.head.setTing(false);
        if (this.chupai_prompt) {
            this.chupai_prompt.active = false;
        }
        this.clearHuPai();

        this.jbdga_ani_state(false);
        this.setFenPaiTouched(false);
        this.setShoupaiTingbiaoji(false);
    },
    /**
     * 打开 或者关闭手牌mask
     */
    setShoupaiTouch: function (isShow) {
        this.shouPai.forEach(function (pai) {
            pai.setTouchAble(isShow);
        });
    },

    setShoupaiTingbiaoji: function (isShow) {
        this.shouPai.forEach(function (pai) {
            pai.setTingPai(isShow);
        });
        this.modepai.setTingPai(isShow);
    },

    setFenPaiTouched: function (isShow) {
        this.fenpai_touched = isShow;
    },

    //切后台
    sysPause: function () {
        if (this.yidong_pai && this.yidong_pai.node) {
            this.yidong_pai.node.active = false;
        }
    },

    /**
     * 听牌发送
     * @param playCardId 出牌
     */
    sendTingPai: function (playCardId, tingType) {
        if (playCardId < 0) {
            cc.error("听后出的牌为空")
            return;
        }

        if (this.require_UserPlayer.shoupai.indexOf(playCardId) == -1) {
            cc.error('不存在要听的手牌' + playCardId);
            return;
        }

        this._sendTingPai(playCardId, tingType);
    },

    /**
     * 发送出牌
     */
    sendOutCard: function (cardID) {
        if (this.require_UserPlayer.waitTing) {
            return;
        }

        if (this.require_DeskData.Instance().waitForSendOutCard) {
            return
        }

        if (this.require_UserPlayer.shoupai.indexOf(cardID) == -1) {
            cc.error('不存在要出的手牌' + cardID);
            return;
        }

        this.require_DeskData.Instance().waitForSendOutCard = true;

        this.require_DeskData.Instance().sendCard = cardID;
        this.canTouchPaiAni = true;
        this.quxiaoBiaoji();

        this._sendOutCard(cardID);
    },

    /**
     * 听牌发送
     * @param playCardId 出牌
     */
    _sendTingPai: function (playCardId, tingType) {
        var out_card = new cc.pb.jilinmajiang.CardInfo();
        out_card.setId(playCardId);
        this.require_UserPlayer.waitTing = true;

        let sendTingType = this._getSendTingType();

        if (tingType == 2) {
            var chi_card = new cc.pb.jilinmajiang.CardInfo();
            chi_card.setId(this.require_UserPlayer.chi_pai);

            var chi_option = this.require_UserPlayer.chitingPaiId;
            var card_option = [];
            chi_option.forEach(function (id) {
                var card = new cc.pb.jilinmajiang.CardInfo();
                card.setId(id);
                card_option.push(card);
            });
            this.require_UserPlayer.chitingPaiId = null;
            var msg = new cc.pb.mjcommon.mj_req_chiting();
            msg.setChicard(chi_card);
            msg.setChoosecardsList(card_option);
            msg.setOutcard(out_card);
            msg.setTingtype(sendTingType);
            msg.setDdsjcardid(-1);
            msg.setLzbcardid(-1);
            cc.gateNet.Instance().sendMsg(cc.netCmd.mjcommon.cmd_mj_req_chiting, msg, "cmd_mj_req_chiting");
        } else if (tingType == 3) {
            var msg = new cc.pb.mjcommon.mj_req_pengting();

            msg.setOutcard(out_card);
            msg.setTingtype(sendTingType);
            msg.setDdsjcardid(-1);
            msg.setLzbcardid(-1);

            cc.gateNet.Instance().sendMsg(cc.netCmd.mjcommon.cmd_mj_req_pengting, msg, "cmd_mj_req_pengting");
        } else if (tingType == 5) {
        } else {
            var msg = new cc.pb.mjcommon.mj_req_tingpai_out_card();
            msg.setCardid(playCardId);
            msg.setTingtype(tingType);
            msg.setDdsjcardid(-1);
            msg.setLzbcardid(-1);
            cc.gateNet.Instance().sendMsg(cc.netCmd.mjcommon.cmd_mj_req_tingpai_out_card, msg, "cmd_mj_req_tingpai_out_card");
        }

        cc.dd.NetWaitUtil.net_wait_start();
    },

    /**
     * 发送出牌
     */
    _sendOutCard: function (cardID) {
        var msg = new cc.pb.mjcommon.mj_req_game_send_out_card();
        msg.setCardid(cardID);
        cc.gateNet.Instance().sendMsg(cc.netCmd.mjcommon.cmd_mj_req_game_send_out_card, msg, "cmd_mj_req_game_send_out_card");
        cc.dd.NetWaitUtil.net_wait_start();
    },

    /**
     * 有些吃听叉听的tingtype需要额外传参
     * @private
     */
    _getSendTingType() {
        return 1;
    },

    /**
     * 听牌类型（吃听叉听杠听普通听)
     * @returns {number}
     */
    getTingType() {
        return 1;
    },

    checkChuPaiPromot(player) {
        return player.hasMoPai() && this.require_DeskData.Instance().isGameStart && !this.require_playerMgr.Instance().playing_fapai_ani && !player.isBaoTing && player.state != this.require_PlayerState.HUPAI && !this.require_DeskData.Instance().isFenZhang;
    },

    /**
     * 发送出牌
     */
    initHuPai: function () {
        cc.log("-----------------------no implements base_mj_player_down_ui initHuPai-----------------------")
    },

    /**
     * 发送出牌
     */
    clearHuPai: function () {
        cc.log("-----------------------no implements base_mj_player_down_ui clearHuPai-----------------------")
    },

    customTouchEndSendOutCard: function () {
        cc.log("-----------------------no implements base_mj_player_down_ui customTouchEndSendOutCard-----------------------")
    },

    initMJComponet() {
        cc.log("-----------------------no implements base_mj_player_down_ui initMJComponet-----------------------")
        return require('mjComponentValue').base_mj;
    }
});

module.exports = down;

