let base_mj_player_base_ui = require('base_mj_player_base_ui');

let left = cc.Class({
    extends: base_mj_player_base_ui,

    properties: {

    },

    resetConfig(){
        if(this.isNeimeng){
            let use2D = cc.sys.localStorage.getItem(cc.dd.user.id + '_chifeng_use2D') === 'true';
            this.pai3dCfg = require("nmmj_pai3d_left").Instance();
            let path = '';
            if(use2D){
                let pa2d = this.require_DeskData.Instance().get2DPai();
                path = '_2d_'+pa2d;
                this.pai3dCfg = require("nmmj_pai3d_left_2d_"+pa2d).Instance();
            }
            this.shou2mid_ani_path = 'gameyj_mj_neimenggu/common/animations/pai'+path+'/left/nmmj_shou2mid_left_';
        }else{
            let use2D = cc.sys.localStorage.getItem(cc.dd.AppCfg.GAME_ID + '_' + cc.dd.user.id + '_use2D') === 'true';
            this.pai3dCfg = use2D ? require("jlmj_pai3d_left_2d").Instance() : require("jlmj_pai3d_left").Instance();
            let path = use2D ? '_2d' : '';
            this.shou2mid_ani_path = 'gameyj_mj/common/animations/pai'+path+'/left/jlmj_shou2mid_left_';
        }
    },

    initPlayerPai: function (res_pai) {
        this.viewIdx = 3;
        this.ccgpai_prefab = res_pai.getComponent('mj_res_pai').jlmj_ccgpai_left;
        if(cc.find("Canvas/desk_node/left_head_button")){
            cc.find("Canvas/desk_node/left_head_button").active = true;
        }
    },

    initPlayerUI() {
        this.zhanshi_pai = cc.find("Canvas/desk_node/zhanshi_pais/jlmj_zhanshi_pai_left").getComponent('jlmj_pai');     //展示牌
        this.chupai_node = cc.find("Canvas/desk_node/chupai_left_node");
        cc.log('mj_player_left_ui onLoad');
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this.zhanli();
    },

    /**
     * 获取打牌动画路径
     * @returns {*}
     */
    getMid2DaPaiAniPath: function () {
        let path = '';
        if(this.require_DeskData.Instance().getIs2D()){
            let pai2d = this.require_DeskData.Instance().get2DPai();
            if(cc.dd._.isNull(pai2d)){
                path = '_2d';
            }else{
                path = '_2d_'+pai2d;
            }
        }

        if(this.isNeimeng) {
            switch (this.require_playerMgr.Instance().playerList.length) {
                case 3:
                    return 'gameyj_mj_neimenggu/common/animations/pai3' + path + '/left/nmmj_mid2dapai_left_';
                case 2:
                    return 'gameyj_mj_neimenggu/common/animations/pai2' + path + '/left/nmmj_mid2dapai_left_';
                default:
                    return 'gameyj_mj_neimenggu/common/animations/pai' + path + '/left/nmmj_mid2dapai_left_';
            }
        }else{
            switch (this.require_playerMgr.Instance().playerList.length){
                case 3:
                    return 'gameyj_mj/common/animations/pai3'+path+'/left/jlmj_mid2dapai_left_';
                case 2:
                    return 'gameyj_mj/common/animations/pai2'+path+'/left/jlmj_mid2dapai_left_';
                default:
                    return 'gameyj_mj/common/animations/pai'+path+'/left/jlmj_mid2dapai_left_';
            }
        }
    },

    mopai: function (player) {
        this.updateShouPai(player);
    },

    getMoPaiShouPaiDis: function (state) {
        //摸牌
        var zhanli = {
            offsetX:0,
            offsetY:-10,
        };
        //摆牌间隔
        var daopai = null;
        if(!this.require_DeskData.Instance().getIs2D()) {
            daopai = {
                13: {x: -522.8, y: -100.6},
                10: {x: -518.4, y: -70.6},
                7: {x: -506, y: -15.8},
                4: {x: -500.9, y: 11.2},
                1: {x: -490.7, y: 63.8},
            };
        }else{
            daopai = {
                13: {x: -515, y: -114.2},
                10: {x: -515, y: -85.2},
                7: {x: -515, y: -34.2},
                4: {x: -515, y: -8},
                1: {x: -515, y: 45.1},
            };
        }

        //开牌
        var kaipai = {
            offsetX:0,
            offsetY:-10,
        };

        if(state == this.require_PlayerState.DAPAI){
            return zhanli;
        }else if(state == this.require_PlayerState.TINGPAI){
            return daopai;
        }else{
            return kaipai;
        }
    },

    /**
     * 获取居中对齐的偏移Y
     */
    getBaiPaiAlignCenterOffsetY: function () {
        var offset_y = 0;
        var first_pai = null;
        var last_pai = null;
        if(this.baipai_ui_list.length>0){
            var first_baipai_ui = this.baipai_ui_list[0];
            var last_baipai_ui = this.baipai_ui_list[this.baipai_ui_list.length-1];
            first_pai = first_baipai_ui.pais[0].node;
            last_pai = last_baipai_ui.pais[last_baipai_ui.pais.length-1].node;
        }
        var offset_y = (Math.abs(first_pai.y) - Math.abs(last_pai.y))/2;
        if(Math.abs(first_pai.y) > Math.abs(last_pai.y)){
            offset_y = -Math.abs(offset_y);
        }else{
            offset_y = Math.abs(offset_y);
        }
        offset_y = parseFloat(offset_y.toFixed(1));
        return offset_y;
    },

    /**
     * 获取居中对齐的偏移Y
     */
    getAlignCenterOffsetY: function () {
        var offset_y = 0;
        var first_pai = null;
        var last_pai = null;
        if(this.baipai_ui_list.length>0){
            var first_baipai_ui = this.baipai_ui_list[0];
            first_pai = first_baipai_ui.pais[0].node;
        }
        for(var i=0; i<this.shouPai.length; ++i){
            if(this.shouPai[i].node.active){
                if(!first_pai){
                    first_pai = this.shouPai[i].node;
                }
                last_pai = this.shouPai[i].node;
            }
        }
        if(this.modepai.node.active){
            last_pai = this.modepai.node;
        }
        var offset_y = (Math.abs(first_pai.y) - Math.abs(last_pai.y))/2;
        if(Math.abs(first_pai.y) > Math.abs(last_pai.y)){
            offset_y = -Math.abs(offset_y);
        }else{
            offset_y = Math.abs(offset_y);
        }
        offset_y = parseFloat(offset_y.toFixed(1));
        // cc.log('座号=',this.viewIdx);
        // cc.log('第一张牌位置Y=',first_pai.y);
        // cc.log('最后一张牌位置Y=',last_pai.y);
        // cc.log('居中偏移Y=',offset_y);
        return offset_y;
    },

    updateShouPai: function (player) {
        if(this.isResetBaiPai){
            this.needUpdateShouPai = true;
            return;
        }

        var player = this.require_playerMgr.Instance().getPlayerByViewIdx(this.viewIdx);
        if(!player){
            return;
        }
        //测试结算开牌
        // player.state = this.require_PlayerState.HUPAI;

        //胡牌时,摆牌先重置,再排版
        if(player.state == this.require_PlayerState.HUPAI){
            this.resetBaiPai(player);
        }

        if(player.shoupai.length == 0){
            return;
        }
        var shouPaiLen = player.shoupai.length;
        if(player.hasMoPai()){
            shouPaiLen = player.shoupai.length - 1;
        }

        var shoupai_visible_cfg = {
            1:  [6],
            4:  [5,6,7,8],
            7:  [3,4,5,6,7,8,9],
            10: [2,3,4,5,6,7,8,9,10,11],
            13: [0,1,2,3,4,5,6,7,8,9,10,11,12],
        };

        if(!shoupai_visible_cfg[shouPaiLen]){
            cc.error("上家手牌数量错误  =", shouPaiLen);

            if(!cc.dd._mj_shoupai_reconnectd){
                cc.dd._mj_shoupai_reconnectd = true;

                cc.log("开始重连麻将"+cc.dd.AppCfg.GAME_ID+"玩家ID"+player.userId);
                var login_module = require('LoginModule');
                login_module.Instance().reconnectWG();
                return;
            }
        }

        //手牌
        var count = 0;
        for(var i=0; i<this.shouPai.length; ++i){
            if(shoupai_visible_cfg[shouPaiLen] && shoupai_visible_cfg[shouPaiLen].indexOf(i) != -1){
                this.shouPai[i].node.active = true;
                if(player.state == this.require_PlayerState.HUPAI){  //胡牌时,开牌配置要加上摆牌数目
                    this.setShouPaiAppearance(i,player.state, player.getBaiPaiNum()+count);
                }else{
                    this.setShouPaiAppearance(i,player.state);
                }
                this.shouPai[i].setValue(player.shoupai[count]);
                if(player.state == this.require_PlayerState.HUPAI){
                    this.biaojiBaoPaiInShouPai(this.shouPai[i]);
                }
                if(player.state == this.require_PlayerState.HUPAI || player.replaying){
                    this.shouPai[i].setHunPai(this.require_DeskData.Instance().isHunPai(player.shoupai[count]) && !this.require_playerMgr.Instance().playing_fapai_ani);
                }
                count++;
            }else{
                this.shouPai[i].node.active = false;
            }
        }

        //摸牌
        if (player.hasMoPai()) {//说明手牌中是包含
            this.modepai.node.active = true;
            var shoupai_count = shoupai_visible_cfg[shouPaiLen].length;
            var mopaiIdx = shoupai_visible_cfg[shouPaiLen][shoupai_count-1]+1;
            if(player.state == this.require_PlayerState.HUPAI) {  //胡牌时,开牌配置要加上摆牌数目
                this.setMoPaiAppearance(mopaiIdx,player.state,player.getBaiPaiNum()+count);
            }else{
                this.setMoPaiAppearance(mopaiIdx,player.state);
            }
            if(player.state == this.require_PlayerState.TINGPAI){
                var pos = this.getMoPaiShouPaiDis(player.state)[shouPaiLen];
                this.modepai.node.setPosition(pos.x, pos.y);
            }else{
                var lastPos = this.modepai.node.getPosition();
                this.modepai.node.setPosition(lastPos.x + this.getMoPaiShouPaiDis(player.state).offsetX, lastPos.y + this.getMoPaiShouPaiDis(player.state).offsetY);
            }
            this.modepai.setValue(player.shoupai[shouPaiLen]);
            if(player.state == this.require_PlayerState.HUPAI){
                this.biaojiBaoPaiInShouPai(this.modepai);
            }
            if(player.state == this.require_PlayerState.HUPAI || player.replaying){
                this.modepai.setHunPai(this.require_DeskData.Instance().isHunPai(player.shoupai[shouPaiLen]) && !this.require_playerMgr.Instance().playing_fapai_ani);
            }
        }else{
            this.modepai.node.active = false;
        }

        //胡牌时有摆牌,位置偏移
        if(player.state == this.require_PlayerState.HUPAI && this.baipai_ui_list.length>0){
            // var mj_index = this.baipai_ui_list.length;
            var mj_index = player.getBaiPaiNum();
            for(var i=0; i<this.shouPai.length; ++i){
                if(this.shouPai[i].node.active){
                    var pos_cfg = this.shouPai[i].node.getPosition();
                    var pos_space = cc.v2(this.pai3dCfg.baipai_space.x * mj_index, this.pai3dCfg.baipai_space.y * mj_index);
                    this.shouPai[i].node.setPosition(pos_cfg.add(pos_space));
                    //加上摆牌和开牌偏移
                    // this.shouPai[i].node.x += -3;
                    // this.shouPai[i].node.y += -6;
                }
            }
            mj_index += 1;
            var pos_cfg = this.modepai.node.getPosition();
            var pos_space = cc.v2(this.pai3dCfg.baipai_space.x * mj_index, this.pai3dCfg.baipai_space.y * mj_index);
            this.modepai.node.setPosition(pos_cfg.add(pos_space));
            //加上摆牌和开牌偏移
            // this.modepai.node.x += -3;
            // this.modepai.node.y += -6;
        }

        this.hideShouPaiInFaPaiAction();

        //开牌居中
        if(player.state == this.require_PlayerState.HUPAI){
            this.shouPaiAlignCenterV();
        }
    },

    /**
     * 发送出牌
     */
    initHuPai: function (){
        cc.log("-----------------------no implements base_mj_player_left_ui initHuPai-----------------------")
    },

    /**
     * 发送出牌
     */
    clearHuPai: function (){
        cc.log("-----------------------no implements base_mj_player_left_ui clearHuPai-----------------------")
    },

    initMJComponet(){
        cc.log("-----------------------no implements base_mj_player_left_ui initMJComponet-----------------------")
        return require('mjComponentValue').base_mj;
    }
});

module.exports = left;
