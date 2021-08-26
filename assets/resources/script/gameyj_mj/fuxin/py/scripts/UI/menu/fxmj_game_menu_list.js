var DeskData = require('fxmj_desk_data').DeskData;

var hupai_type = require("fxmj_game_menu").hupai_type;

var menu_type = require("fxmj_game_menu").menu_type;

var jlmj_game_menu_list = require('jlmj_game_menu_list');

var playerMgr = require('fxmj_player_mgr');

var UserPlayer = require("fxmj_userPlayer_data").Instance();

cc.Class({
    extends: jlmj_game_menu_list,

    /**
     * 增加指定类型菜单
     * @param type
     * @returns {*|Component|cc.Component}
     */
    onLoad: function () {
        this._super();
    },

    addMenu: function (type) {
        var menu_node = cc.instantiate(this.menu_prefab);
        var menu = menu_node.getComponent("fxmj_game_menu");
        this.menu =  menu;
        if(!menu){
            cc.error("fxmj_game_menu预制没有挂在fxmj_game_menu组件");
            return;
        }
        menu.type = type;
        this.node.addChild(menu_node);
        return menu;
    },

    /**
     * 设置菜单
     * @param player
     */
    setMenus: function(player){
        if(playerMgr.Instance().playing_fapai_ani){ //发牌动画,不显示操作菜单
            return;
        }
        if(!player.hasCaozuo()){
            this.closeMenuAndOptions();
            return;
        }
        this.onShow_list = [];
        var player_list = playerMgr.Instance().playerList;

        //if(player.canhu && !UserPlayer.canting && !player.isBaoTing && !player.isXiaoSa && player_list.length > 2) {
        //    this.onShow_list.push(this.getMenu(this.menu_list,menu_type.GUO));
        //}else if(player_list.length > 2 && !player.isBaoTing && !player.isXiaoSa && player.canhu) {
        //    this.onShow_list.push(this.getMenu(this.menu_list,menu_type.GUO));
        //}else if(player_list.length > 2 && !player.canhu){
        if(player.canxiaosa){
            this.onShow_list.push(this.getMenu(this.menu_list,menu_type.GUO_2));
        }else{
            this.onShow_list.push(this.getMenu(this.menu_list,menu_type.GUO));
        }
        //}

        if(player_list.length == 2) {
            this.onShow_list.push(this.getMenu(this.menu_list,menu_type.GUO));
        }
        if(player.canhu){//有胡牌时不能过牌
            if(player.canhu == hupai_type.CAN_HU_TRUE_NORMAL){
                this.onShow_list.push(this.getMenu(this.menu_list,UserPlayer.modepai != null?menu_type.ZIMO:menu_type.HU));
            }else{
                this.onShow_list.push(this.getMenu(this.menu_list,player.modepai != null?menu_type.ZIMO:menu_type.HU));
            }
        }
        if(player.canting){
            this.onShow_list.push(this.getMenu(this.menu_list, menu_type.TING));
        }

        if(player.cangang ){
            this.onShow_list.push(this.getMenu(this.menu_list, menu_type.GANG));
        }

        if(player.canpeng){
            this.onShow_list.push(this.getMenu(this.menu_list, menu_type.PENG));
        }

        if(player.canchi){
            this.onShow_list.push(this.getMenu(this.menu_list,menu_type.CHI));
        }

        if(player.canchiting){
            this.onShow_list.push(this.getMenu(this.menu_list,menu_type.CHITING));
        }

        if(player.canpengting){
            this.onShow_list.push(this.getMenu(this.menu_list,menu_type.PENGTING));
        }

        if(player.cangangting){
            this.onShow_list.push(this.getMenu(this.menu_list,menu_type.GANGTING));
        }

        this.openMenu(this.onShow_list);
    },

    setPlayerMenus: function(player){
        if(playerMgr.Instance().playing_fapai_ani){ //发牌动画,不显示操作菜单
            return;
        }
        this.onShow_list = [];

        if(player.canxiaosa){
            this.onShow_list.push(this.getMenu(this.menu_list,menu_type.GUO_2));
            this.menu.setclickCallback(player.fun);
        }else{
            this.onShow_list.push(this.getMenu(this.menu_list,menu_type.GUO));
        }


        if(player.canting){
            this.onShow_list.push(this.getMenu(this.menu_list, menu_type.TING));
        }

        if(player.cangang ){
            this.onShow_list.push(this.getMenu(this.menu_list, menu_type.GANG));
        }

        if(player.canpeng){
            this.onShow_list.push(this.getMenu(this.menu_list, menu_type.PENG));
        }

        if(player.canchi){
            this.onShow_list.push(this.getMenu(this.menu_list,menu_type.CHI));
        }

        if(player.canchiting){
            this.onShow_list.push(this.getMenu(this.menu_list,menu_type.CHITING));
        }

        if(player.canxiaosa){
            this.onShow_list.push(this.getMenu(this.menu_list,menu_type.XIAOSA));
            this.menu.setclickCallback(player.fun);
        }
        this.openMenu(this.onShow_list);
    },
    // update (dt) {},
});
