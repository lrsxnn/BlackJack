var playerED = require("jzmj_player_data").PlayerED;
var PlayerState = require("jzmj_player_data").PlayerState;
var playerMgr = require('jzmj_player_mgr');
var DeskData = require("jzmj_desk_data").DeskData;

var UIZorder = require("mj_ui_zorder");
cc.Class({
    extends: require('jzmj_player_base_ui'),

    properties: {

    },

    resetConfig(){
        let use2D = cc.sys.localStorage.getItem(cc.dd.AppCfg.GAME_ID + '_' + cc.dd.user.id + '_use2D') === 'true';
        this.pai3dCfg = use2D ? require("jlmj_pai3d_right_2d").Instance() : require("jlmj_pai3d_right").Instance();
        let path = use2D ? '_2d' : '';
        this.shou2mid_ani_path = 'gameyj_mj/common/animations/pai'+path+'/right/jlmj_shou2mid_right_';
    },

    initPai: function () {
        this.resetConfig();
        this.viewIdx = 1;
        var res_pai = cc.find('Canvas/mj_res_pai');
        if(!res_pai){
            return null;
        }
        this.ccgpai_prefab = res_pai.getComponent('mj_res_pai').jlmj_ccgpai_right;
    },

    // use this for initialization
    onLoad: function () {
        cc.log('jzmj_player_right_ui onLoad');
        this.zhanshi_pai = cc.find("Canvas/desk_node/zhanshi_pais/jlmj_zhanshi_pai_right").getComponent('jlmj_pai');     //展示牌
        // cc.find("Canvas/desk_node/jlmj_player_right_ui/mj_playerHead").zIndex = UIZorder.MJ_LAYER_TOP;
        this.chupai_node = cc.find("Canvas/desk_node/chupai_right_node");

        this.initPai();
        this.dgpt_ani = cc.find("Canvas/desk_node/play_anis/dgpt_r").getComponent(sp.Skeleton);
        // this.baozhongbao_ani = cc.find("Canvas/desk_node/play_anis/baozhongbao_r").getComponent(sp.Skeleton);
        // this.chajiaohuazhu_ani = cc.find("Canvas/desk_node/play_anis/chajiaohuazhu_r").getComponent(sp.Skeleton);
        this.cpgtgh_ani = cc.find("Canvas/desk_node/play_anis/cpgtgh_r").getComponent(sp.Skeleton);
        // this.liangzhang_ani = cc.find("Canvas/desk_node/play_anis/liangzhang_r").getComponent(sp.Skeleton);
        this.piaohu_ani = cc.find("Canvas/desk_node/play_anis/piaohu_r").getComponent(sp.Skeleton);
        this.qys_ani = cc.find("Canvas/desk_node/play_anis/qys_r").getComponent(sp.Skeleton);
        // this.xiaosa_ani = cc.find("Canvas/desk_node/play_anis/xiaosa_r").getComponent(sp.Skeleton);

        this.dgpt_ani.node.active = false;
        // this.baozhongbao_ani.node.active = false;
        // this.chajiaohuazhu_ani.node.active = false;
        this.cpgtgh_ani.node.active = false;
        // this.liangzhang_ani.node.active = false;
        this.piaohu_ani.node.active = false;
        this.qys_ani.node.active = false;
        // this.xiaosa_ani.node.active = false;

        this.initShouPai();
        this.initModepai();
        this.zhanli();
        // this.initUI();
        playerED.addObserver(this);

        // this.head.node.setLocalZOrder(UIZorder.MJ_LAYER_TOP);

    },

    onDestroy: function () {
        playerED.removeObserver(this);
    },

    /**
     * 获取打牌动画路径
     * @returns {*}
     */
    getMid2DaPaiAniPath: function () {
        let path = DeskData.Instance().getIs2D() ? '_2d' : '';

        switch (playerMgr.Instance().playerList.length){
            case 3:
                return 'gameyj_mj/common/animations/pai3'+path+'/right/jlmj_mid2dapai_right_';
            case 2:
                return 'gameyj_mj/common/animations/pai2'+path+'/right/jlmj_mid2dapai_right_';
            default:
                return 'gameyj_mj/common/animations/pai'+path+'/right/jlmj_mid2dapai_right_';
        }
    },

    mopai: function (player) {
        this.updateShouPai(player);
        // if (DeskData.Instance().isFenZhang) {
        //     DeskED.notifyEvent(DeskData.Instance().MO_PAI_FEN_ZHANG, ++DeskData.Instance().fenzhangCount);
        // }
    },

    getMoPaiShouPaiDis: function (state) {
        //摸牌
        var zhanli = {
            offsetX:0,
            offsetY:10,
        };
        //摆牌间隔
        var daopai = null;
        if(!DeskData.Instance().getIs2D()) {
            daopai = {
                13: {x: 457.2, y: 273.6},
                10: {x: 459.4, y: 252.4},
                7: {x: 468.9, y: 206.3},
                4: {x: 471.8, y: 183.6},
                1: {x: 480.6, y: 136.8},
            };
        }else{
            daopai = {
                13: {x: 515, y: 250},
                10: {x: 515, y: 223},
                7: {x: 515, y: 172},
                4: {x: 515, y: 144},
                1: {x: 515, y: 92},
            };
        }
        //开牌
        var kaipai = {
            offsetX:0,
            offsetY:10,
        };

        if(state == PlayerState.DAPAI){
            return zhanli;
        }else if(state == PlayerState.TINGPAI){
            return daopai;
        }else{
            return kaipai;
        }
    },

    /**
     * 获取居中对齐的偏移
     */
    getAlignCenterOffset: function () {
        var offset_pos = cc.v2(0,0);
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
        var offset_y = (Math.abs(first_pai.y) - Math.abs(last_pai.y))/2;
        if(Math.abs(first_pai.y) > Math.abs(last_pai.y)){
            offset_pos.y = -Math.abs(offset_y);
        }else{
            offset_pos.y = Math.abs(offset_y);
        }
        return offset_pos;
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
            offset_y = Math.abs(offset_y);
        }else{
            offset_y = -Math.abs(offset_y);
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
            offset_y = Math.abs(offset_y);
        }else{
            offset_y = -Math.abs(offset_y);
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
        var player = playerMgr.Instance().getPlayerByViewIdx(this.viewIdx);
        if(!player){
            return;
        }
        //测试结算开牌
        // player.state = PlayerState.HUPAI;

        //胡牌时,摆牌先重置,再排版
        if(player.state == PlayerState.HUPAI){
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
            cc.error("下家手牌数量错误  =", shouPaiLen);

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
                if(player.state == PlayerState.HUPAI){  //胡牌时,开牌配置要加上摆牌数目
                    this.setShouPaiAppearance(i,player.state,player.getBaiPaiNum()+count);
                }else{
                    this.setShouPaiAppearance(i,player.state);
                }
                this.shouPai[i].setValue(player.shoupai[count]);
                if(player.state == PlayerState.HUPAI){
                    this.biaojiBaoPaiInShouPai(this.shouPai[i]);
                }

                if(player.state == PlayerState.HUPAI || player.replaying){
                    this.shouPai[i].setHunPai(DeskData.Instance().isHunPai(player.shoupai[count]) && !playerMgr.Instance().playing_fapai_ani, true);
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
            if(player.state == PlayerState.HUPAI) {  //胡牌时,开牌配置要加上摆牌数目
                this.setMoPaiAppearance(mopaiIdx,player.state,player.getBaiPaiNum()+count);
            }else{
                this.setMoPaiAppearance(mopaiIdx,player.state);
            }
            if(player.state == PlayerState.TINGPAI){
                var pos = this.getMoPaiShouPaiDis(player.state)[shouPaiLen];
                this.modepai.node.setPosition(pos.x, pos.y);
            }else{
                var lastPos = this.modepai.node.getPosition();
                this.modepai.node.setPosition(lastPos.x + this.getMoPaiShouPaiDis(player.state).offsetX, lastPos.y + this.getMoPaiShouPaiDis(player.state).offsetY);
            }
            this.modepai.setValue(player.shoupai[shouPaiLen]);
            if(player.state == PlayerState.HUPAI){
                this.biaojiBaoPaiInShouPai(this.modepai);
            }

            if(player.state == PlayerState.HUPAI || player.replaying){
                this.modepai.setHunPai(DeskData.Instance().isHunPai(player.shoupai[shouPaiLen]) && !playerMgr.Instance().playing_fapai_ani, true);
            }
        }else{
            this.modepai.node.active = false;
        }

        //胡牌时有摆牌,位置偏移
        if(player.state == PlayerState.HUPAI && this.baipai_ui_list.length>0){
            // var mj_index = this.baipai_ui_list.length;
            var mj_index = player.getBaiPaiNum();
            for(var i=0; i<this.shouPai.length; ++i){
                if(this.shouPai[i].node.active){
                    var pos_cfg = this.shouPai[i].node.getPosition();
                    var pos_space = cc.v2(this.pai3dCfg.baipai_space.x * mj_index, this.pai3dCfg.baipai_space.y * mj_index);
                    this.shouPai[i].node.setPosition(pos_cfg.add(pos_space));
                    //加上摆牌和开牌偏移
                    // this.shouPai[i].node.x += -9;
                    // this.shouPai[i].node.y += 31;
                }
            }
            mj_index += 1;
            var pos_cfg = this.modepai.node.getPosition();
            var pos_space = cc.v2(this.pai3dCfg.baipai_space.x * mj_index, this.pai3dCfg.baipai_space.y * mj_index);
            this.modepai.node.setPosition(pos_cfg.add(pos_space));
            //加上摆牌和开牌偏移
            // this.modepai.node.x += -9;
            // this.modepai.node.y += 31;
        }

        this.hideShouPaiInFaPaiAction();

        //开牌居中
        if(player.state == PlayerState.HUPAI){
            this.shouPaiAlignCenterV();
        }
    },

    update: function () {
        if(this.mid2dapai_playing&&this.zhanshi_pai.node.active){
            var length = this.chuPai.length;
            if(length>=2){
                var x = this.getDaPaiCfg()['frame_'+(length-1)].x;
                var y = this.getDaPaiCfg()['frame_'+(length-1)].y;
                var width = this.getDaPaiCfg()['frame_'+(length-1)].sizeW;
                var height = this.getDaPaiCfg()['frame_'+(length-1)].sizeH;
                var order_rect = cc.rect(x-width/2,y-height/2,width,height-15);
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
});
