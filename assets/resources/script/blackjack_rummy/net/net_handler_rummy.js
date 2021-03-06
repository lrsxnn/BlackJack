const RummyData = require("RummyData").RummyData.Instance();
const RummyGameMgr = require("RummyGameMgr").Instance();
const RoomMgr = require('jlmj_room_mgr').RoomMgr;

var handler = {
    on_msg_rm_ready_ack(msg) {

    },

    on_msg_rm_action_change(msg) {
        RummyData.turn = msg.userId;
        RummyGameMgr.actionChange(msg);
    },

    on_msg_rm_state_change_2c(msg) {
        RummyData.changeState(msg);
        RummyGameMgr.changeState();
    },

    on_msg_rm_info(msg) {
        RummyData.setGameInfo(msg);
        RoomMgr.Instance().player_mgr.updatePlayerGameInfo(msg.usersList, msg.banker);
        RoomMgr.Instance().player_mgr.playerEnterGame();
        RummyGameMgr.updateUI();
    },

    on_msg_rm_poker_ack(msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_rm_poker_req');

        if(msg.ret === 0){
        }else{
            let str = msg.ret;
            switch (msg.ret){
                case 1:
                    str = '没有找到用户';
                    break;
                case 2:
                    str = '不是该玩家的回合';
                    break;
                case 3:
                    str = '不能拿这张牌';
                    break;
            }
            cc.dd.PromptBoxUtil.show(str);
        }
    },

    on_msg_rm_deal_poker(msg) {
        RummyGameMgr.faPai(msg);
    },

    on_msg_rm_deal_poker_broadcast(msg) {
        RummyGameMgr.dealPoker(msg);
    },

    on_msg_rm_give_up_poker_ack(msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_rm_give_up_poker_req');

        if(msg.ret === 0){
            RummyData.giveUp = msg.card;
            RummyGameMgr.giveUpPoker({userId: cc.dd.user.id, card: msg.card, groupId: msg.groupId});
        }else{
            let str = msg.ret;
            switch (msg.ret){
                case 1:
                    str = '没有找到用户';
                    break;
                case 2:
                    str = '不是该玩家的回合';
                    break;
                case 3:
                    str = '没有这张牌';
                    break;
            }
            cc.dd.PromptBoxUtil.show(str);
            RummyGameMgr.updatePoker();
            // var msg = new cc.pb.rummy.msg_rm_sort_req();
            // cc.gateNet.Instance().sendMsg(cc.netCmd.rummy.cmd_msg_rm_sort_req, msg, "msg_rm_sort_req", true);
            // cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_rm_sort_req');
        }
    },

    on_msg_rm_give_up_poker_broadcast(msg) {
        RummyData.giveUp = msg.card;
        RummyGameMgr.giveUpPoker(msg);
    },

    on_msg_rm_syn_giveup_poker(msg) {
        RummyGameMgr.synGiveupPoker(msg);
    },

    on_msg_rm_show_ack(msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_rm_show_req');

        if(msg.ret === 0){
            RummyGameMgr.showCard(msg);
        }else{
            let str = msg.ret;
            switch (msg.ret){
                case -1:
                    if(msg.uid === cc.dd.user.id){
                        RummyGameMgr.showInvalidShow();
                        RummyGameMgr.loseGame(msg.uid);
                    }
                    return;
                case 1:
                    str = '没有找到用户';
                    break;
                case 2:
                    str = '不是该玩家的回合';
                    break;
                case 3:
                    str = '没有这张牌';
                    break;
                case 4:
                    str = '牌组不对';
                    break;
            }
            cc.dd.PromptBoxUtil.show(str);
            RummyGameMgr.updatePoker();
            // var msg = new cc.pb.rummy.msg_rm_sort_req();
            // cc.gateNet.Instance().sendMsg(cc.netCmd.rummy.cmd_msg_rm_sort_req, msg, "msg_rm_sort_req", true);
            // cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_rm_sort_req');
        }
    },

    on_msg_rm_group_ack(msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_rm_group_req');
        if(msg.ret !== 0){
            cc.error(`group failed ${msg.ret}`);
        }
        //
        // RummyGameMgr.resetGroup(msg.ret !== 0);
    },

    on_msg_rm_commit_ack(msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_rm_commit_req');

        if(msg.ret === 0) {
            RummyGameMgr.commit(msg);
        }
    },

    on_msg_rm_sort_ack(msg) {
        // cc.dd.NetWaitUtil.net_wait_end('msg_rm_sort_req');
        //
        // if(msg.ret === 0){
        //     RummyGameMgr.updatePoker(msg.groupsList);
        // }else{
        //     let str = msg.ret;
        //     switch (msg.ret){
        //         case 1:
        //             str = '没有找到用户';
        //             break;
        //         case 2:
        //             str = '请求过于频繁';
        //             break;
        //         case 3:
        //             str = '非法用户';
        //             break;
        //         case 4:
        //             str = '已经结算';
        //             break;
        //     }
        //     // cc.dd.PromptBoxUtil.show(str);
        //     cc.error(`on_msg_rm_sort_ack ${str}`);
        // }
    },

    on_msg_rm_drop_ack(msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_rm_drop_req');

        if(msg.ret === 0) {
            RummyGameMgr.loseGame(msg.userId);
        }
    },

    on_msg_drop_score(msg){
        RummyGameMgr.updateDropCoin(msg.score);
    },

    on_msg_rm_result(msg) {
        RummyGameMgr.gameResult(msg);
    },

    on_rm_tips_ack(msg){
        cc.dd.NetWaitUtil.net_wait_end('rm_tips_req');

        if(msg.result === 0){
            RummyGameMgr.giveTips(msg);
        }
    }
};

module.exports = handler;