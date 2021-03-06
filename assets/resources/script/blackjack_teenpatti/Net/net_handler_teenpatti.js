// create by wj 2019/03/28

var deskData = require('teenpatti_desk').Teenpatti_Desk_Data.Instance();
var playerMgr = require('teenpatti_player_manager').Teenpatti_PlayerMgr.Instance();
var deskEvent = require('teenpatti_desk').Teenpatti_Desk_Event;
var deskEd = require('teenpatti_desk').Teenpatti_Desk_Ed;

var hanlder = {
    //断线重连/创建房间信息
    on_msg_teenpatti_state_info: function(msg){
        deskData.initDeskData(msg);
    },

    //看牌消息返回
    on_msg_teenpatti_watch_ret: function(msg){
        cc.dd.NetWaitUtil.net_wait_end('sendWatch');
        if(msg.retCode != 0)
            return;
        playerMgr.playerPokerInfo(msg.poker);
    },

    //请求比牌消息广播
    on_msg_cmp_broadcast:function(msg){
        deskEd.notifyEvent(deskEvent.TEENPATTI_DEDSK_COMPARE, msg.userId);
    },

    on_msg_cmp_agree_ack:function(msg){
        deskEd.notifyEvent(deskEvent.TEENPATTI_DEDSK_COMPARE_AGREE, msg);
    },

    //比牌消息返回
    on_msg_teenpatti_cmp_ret: function(msg){
        cc.dd.NetWaitUtil.net_wait_end('sendCmpOp');
        if(msg.retCode != 0)
            return;
        switch(msg.cmpType){
            case 1://玩家比牌下注
                deskData.playerCmpOp(msg.userId, msg.bet);
                deskData.setLastOpUser(msg.userId);
                deskData.setCurOpUser(msg.nextOpUserId);
                deskEd.notifyEvent(deskEvent.TEENPATTI_DEDSK_COMPARE, msg.userId);
                break;
            case 2: //比牌结果
                deskData.playerCmpResult(msg.userId, msg.cmpId, msg.winner, msg.bet);
                deskData.setLastOpUser(msg.userId);
                deskData.setCurOpUser(msg.nextOpUserId);
                deskEd.notifyEvent(deskEvent.TEENPATTI_DEDSK_COMPARE_RESULT, msg);
                break;
        }
    },


    //操作消息返回
    on_msg_teenpatti_op_ret: function(msg){
        if(msg.retCode != 0){
            switch(msg.retCode){
                case 1:
                    cc.dd.PromptBoxUtil.show('当前属于其他玩家操作时间');
                    deskEd.notifyEvent(deskEvent.TEENPATTI_DEDSK_ERROR);
                    break;
                case 2:
                    cc.dd.PromptBoxUtil.show('当前不可操作');
                    break;
            }
            return;
        }
        var opState = 1;
        var opBet = 0;
        var betLevel = 0;
        switch(msg.opType){
            case 1:
                opBet = msg.bet;
                opState = 3;
                betLevel = msg.betLevel;
                break;
            case 2:
                opBet = msg.bet;
                opState = 4;
                betLevel = msg.betLevel;
                break;
            case 3:
                opState = 13;
                break;
        }
        deskData.playerNormalOp(msg.userId, opBet, opState);
        if(msg.nextOpUserId != 0){
            deskData.setLastOpUser(msg.userId);
            deskData.setCurOpUser(msg.nextOpUserId);
        }
        if(msg.opType != 3){
            deskData.setCurBetLevel(betLevel);
            deskEd.notifyEvent(deskEvent.TEENPATTI_DEDSK_CALL, msg.userId);
        }
        else
            deskEd.notifyEvent(deskEvent.TEENPATTI_DEDSK_FOLD, msg.userId);
    },

    //轮数更新
    on_msg_teenpatti_update: function(msg){
        deskData.setCurCircle(msg.value);
        deskEd.notifyEvent(deskEvent.TEENPATTI_DEDSK_UPDATE_CIRCLE);
    },

    //结束结算
    on_msg_teenpatti_result: function(msg){
        if( msg.time == 0){ //单局结算
            deskData.setPlayerPokers(msg.pokersList);
           // deskData.setServerPay(msg.severPay);
            deskEd.notifyEvent(deskEvent.TEENPATTI_DEDSK_SHOW_ROUND_RESULE, msg.scoreResultList);
        }else{ //总结算
            deskEd.notifyEvent(deskEvent.TEENPATTI_DEDSK_SHOW_RESULE, msg);
        }   
    },

    //再次准备开始
    on_room_prepare_ack: function(msg){ 
        var player = playerMgr.getPlayer(msg.userId);
        if (player) {
            player.setReady(true);
        }
    },

    //解散请求
    on_room_dissolve_agree_ack: function(msg){
        deskEd.notifyEvent(deskEvent.TEENPATTI_DEDSK_DISSOVlE, msg);
    },

    //解散请求结果
    on_room_dissolve_agree_result: function(msg){
        deskEd.notifyEvent(deskEvent.TEENPATTI_DEDSK_DISSOVLE_RESULT, msg);
    },

    //金币场玩家数据消息
    on_teenpatti_user_info: function(msg){
        var player = playerMgr.getPlayer(msg.userId);
        if (player) {
            player.setPlayerGameInfo(msg);
        }
    },
    //充值增加时间
    on_msg_teenpatti_recharge_ret: function(msg){
        deskEd.notifyEvent(deskEvent.TEENPATTI_DEDSK_QUICK_RECHARGE, msg);
    },

    //取消托管消息返回
    on_msg_teenpatti_cancel_auto_ret: function(msg){
        if(msg.code == true)
            cc.dd.PromptBoxUtil.show('取消托管成功');
        else
            cc.dd.PromptBoxUtil.show('取消托管失败');
    },

    //托管状态广播
    on_msg_teenpatti_auto_status: function(msg){
        var player = playerMgr.getPlayer(msg.userId);
        if (player) {
            player.setPlayerAutoState(msg.status);
        }
    },

    //预公布牌消息返回
    on_msg_show_card_ack: function(msg){
        if(msg.result == 0)
            playerMgr.setPlayerShowPoker(cc.dd.user.id);
    },
};
module.exports = hanlder;
