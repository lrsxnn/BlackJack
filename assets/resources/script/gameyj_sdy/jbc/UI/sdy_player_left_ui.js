var PlayerState = require('sdy_player_data').PlayerState;
var PlayerMgr = require('sdy_player_mgr').PlayerMgr;
var RoomData = require('sdy_room_data').RoomData;
var view_idx = 3;

cc.Class({
    extends: require('sdy_player_base_ui'),

    properties: {

    },

    initUI: function () {
        cc.log('sdy_player_left_ui: initUI');
        this.view_idx = view_idx;
        var player = PlayerMgr.Instance().getPlayerByViewIdx(this.view_idx);
        if(player == null){
            return;
        }
        this.setHeadData(player);
        switch (player.player_state){
            case PlayerState.SDY_PLAYER_STATE_INIT:
                break;
            case PlayerState.SDY_PLAYER_STATE_CALLING:
                this.calling(player);
                break;
            case PlayerState.SDY_PLAYER_STATE_CALLED:
                this.called(player);
                break;
            case PlayerState.SDY_PLAYER_STATE_SELECTING:
                this.selecting(player);
                break;
            case PlayerState.SDY_PLAYER_STATE_SELECTED:
                this.selected(player);
                break;
            case PlayerState.SDY_PLAYER_STATE_KOUING:
                this.kouing(player);
                break;
            case PlayerState.SDY_PLAYER_STATE_KOUED:
                this.koued(player);
                break;
            case PlayerState.SDY_PLAYER_STATE_SENDING:
                this.sending(player);
                break;
            case PlayerState.SDY_PLAYER_STATE_SENDED:
                this.sended(player);
                break;
        }
        this.update_shoupai(player);
    },

});