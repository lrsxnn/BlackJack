
    const msg = {};
    var handler = require('no_use');
    var recvFuncs = {
        [8000]:{ package_name:'msg', msg_name:'EndLotteryInfo', name:msg.EndLotteryInfo, func:handler.on_EndLotteryInfo, func_name:'on_EndLotteryInfo', logtag:'[8000:EndLotteryInfo ]' },
        [8001]:{ package_name:'msg', msg_name:'PlayerCard', name:msg.PlayerCard, func:handler.on_PlayerCard, func_name:'on_PlayerCard', logtag:'[8001:PlayerCard ]' },
        [8002]:{ package_name:'msg', msg_name:'HoldCardInfo', name:msg.HoldCardInfo, func:handler.on_HoldCardInfo, func_name:'on_HoldCardInfo', logtag:'[8002:HoldCardInfo ]' },
        [8003]:{ package_name:'msg', msg_name:'ChiOverTurn', name:msg.ChiOverTurn, func:handler.on_ChiOverTurn, func_name:'on_ChiOverTurn', logtag:'[8003:ChiOverTurn ]' },
        [8004]:{ package_name:'msg', msg_name:'PlayerCoinInfo', name:msg.PlayerCoinInfo, func:handler.on_PlayerCoinInfo, func_name:'on_PlayerCoinInfo', logtag:'[8004:PlayerCoinInfo ]' },
        [8005]:{ package_name:'msg', msg_name:'user_coin_bean', name:msg.user_coin_bean, func:handler.on_user_coin_bean, func_name:'on_user_coin_bean', logtag:'[8005:user_coin_bean ]' },
        [8006]:{ package_name:'msg', msg_name:'BuCardInfo', name:msg.BuCardInfo, func:handler.on_BuCardInfo, func_name:'on_BuCardInfo', logtag:'[8006:BuCardInfo ]' },
        [8007]:{ package_name:'msg', msg_name:'ComposeCard', name:msg.ComposeCard, func:handler.on_ComposeCard, func_name:'on_ComposeCard', logtag:'[8007:ComposeCard ]' },
        [8008]:{ package_name:'msg', msg_name:'mj_hupai_type', name:msg.mj_hupai_type, func:handler.on_mj_hupai_type, func_name:'on_mj_hupai_type', logtag:'[8008:mj_hupai_type]' },
        [8009]:{ package_name:'msg', msg_name:'DeskGameInfo', name:msg.DeskGameInfo, func:handler.on_DeskGameInfo, func_name:'on_DeskGameInfo', logtag:'[8009:DeskGameInfo ]' },
        [8010]:{ package_name:'msg', msg_name:'PlayerInfo', name:msg.PlayerInfo, func:handler.on_PlayerInfo, func_name:'on_PlayerInfo', logtag:'[8010:PlayerInfo ]' },
        [8011]:{ package_name:'msg', msg_name:'FinallyTotal', name:msg.FinallyTotal, func:handler.on_FinallyTotal, func_name:'on_FinallyTotal', logtag:'[8011:FinallyTotal ]' },
        [8012]:{ package_name:'msg', msg_name:'JiaoInfo', name:msg.JiaoInfo, func:handler.on_JiaoInfo, func_name:'on_JiaoInfo', logtag:'[8012:JiaoInfo ]' },
        [8013]:{ package_name:'msg', msg_name:'JiaoPaiInfo', name:msg.JiaoPaiInfo, func:handler.on_JiaoPaiInfo, func_name:'on_JiaoPaiInfo', logtag:'[8013:JiaoPaiInfo ]' },
        [8014]:{ package_name:'msg', msg_name:'GangOverTurn', name:msg.GangOverTurn, func:handler.on_GangOverTurn, func_name:'on_GangOverTurn', logtag:'[8014:GangOverTurn ]' },
        [8015]:{ package_name:'msg', msg_name:'BuGangOverTurn', name:msg.BuGangOverTurn, func:handler.on_BuGangOverTurn, func_name:'on_BuGangOverTurn', logtag:'[8015:BuGangOverTurn ]' },
        [8016]:{ package_name:'msg', msg_name:'CtrlCard', name:msg.CtrlCard, func:handler.on_CtrlCard, func_name:'on_CtrlCard', logtag:'[8016:CtrlCard ]' },
        [8017]:{ package_name:'msg', msg_name:'CardArr', name:msg.CardArr, func:handler.on_CardArr, func_name:'on_CardArr', logtag:'[8017:CardArr]' },
        [8018]:{ package_name:'msg', msg_name:'CardInfo', name:msg.CardInfo, func:handler.on_CardInfo, func_name:'on_CardInfo', logtag:'[8018:CardInfo ]' },
        [8019]:{ package_name:'msg', msg_name:'mj_desk_info', name:msg.mj_desk_info, func:handler.on_mj_desk_info, func_name:'on_mj_desk_info', logtag:'[8019:mj_desk_info ]' },
        [8020]:{ package_name:'msg', msg_name:'mj_game_ack_act_hu', name:msg.mj_game_ack_act_hu, func:handler.on_mj_game_ack_act_hu, func_name:'on_mj_game_ack_act_hu', logtag:'[8020:mj_game_ack_act_hu ]' },
        [8021]:{ package_name:'msg', msg_name:'mj_ack_send_current_result', name:msg.mj_ack_send_current_result, func:handler.on_mj_ack_send_current_result, func_name:'on_mj_ack_send_current_result', logtag:'[8021:mj_ack_send_current_result ]' },
        [8022]:{ package_name:'msg', msg_name:'mj_ack_game_opening', name:msg.mj_ack_game_opening, func:handler.on_mj_ack_game_opening, func_name:'on_mj_ack_game_opening', logtag:'[8022:mj_ack_game_opening ]' },
        [8023]:{ package_name:'msg', msg_name:'mj_ack_roomInit', name:msg.mj_ack_roomInit, func:handler.on_mj_ack_roomInit, func_name:'on_mj_ack_roomInit', logtag:'[8023:mj_ack_roomInit]' },
        [8024]:{ package_name:'msg', msg_name:'mj_ack_createDesk', name:msg.mj_ack_createDesk, func:handler.on_mj_ack_createDesk, func_name:'on_mj_ack_createDesk', logtag:'[8024:mj_ack_createDesk ]' },
        [8025]:{ package_name:'msg', msg_name:'mj_req_enterDesk', name:msg.mj_req_enterDesk, func:handler.on_mj_req_enterDesk, func_name:'on_mj_req_enterDesk', logtag:'[8025:mj_req_enterDesk ]' },
        [8026]:{ package_name:'msg', msg_name:'mj_ack_enterDesk', name:msg.mj_ack_enterDesk, func:handler.on_mj_ack_enterDesk, func_name:'on_mj_ack_enterDesk', logtag:'[8026:mj_ack_enterDesk ]' },
        [8027]:{ package_name:'msg', msg_name:'mj_req_leave_status', name:msg.mj_req_leave_status, func:handler.on_mj_req_leave_status, func_name:'on_mj_req_leave_status', logtag:'[8027:mj_req_leave_status ]' },
        [8028]:{ package_name:'msg', msg_name:'mj_ack_leave_status', name:msg.mj_ack_leave_status, func:handler.on_mj_ack_leave_status, func_name:'on_mj_ack_leave_status', logtag:'[8028:mj_ack_leave_status ]' },
        [8029]:{ package_name:'msg', msg_name:'mj_req_sponsor_dissolve_room', name:msg.mj_req_sponsor_dissolve_room, func:handler.on_mj_req_sponsor_dissolve_room, func_name:'on_mj_req_sponsor_dissolve_room', logtag:'[8029:mj_req_sponsor_dissolve_room ]' },
        [8030]:{ package_name:'msg', msg_name:'mj_ack_sponsor_dissolve_room', name:msg.mj_ack_sponsor_dissolve_room, func:handler.on_mj_ack_sponsor_dissolve_room, func_name:'on_mj_ack_sponsor_dissolve_room', logtag:'[8030:mj_ack_sponsor_dissolve_room ]' },
        [8031]:{ package_name:'msg', msg_name:'mj_req_response_dissolve_room', name:msg.mj_req_response_dissolve_room, func:handler.on_mj_req_response_dissolve_room, func_name:'on_mj_req_response_dissolve_room', logtag:'[8031:mj_req_response_dissolve_room ]' },
        [8032]:{ package_name:'msg', msg_name:'mj_ack_response_dissolve_room', name:msg.mj_ack_response_dissolve_room, func:handler.on_mj_ack_response_dissolve_room, func_name:'on_mj_ack_response_dissolve_room', logtag:'[8032:mj_ack_response_dissolve_room ]' },
        [8033]:{ package_name:'msg', msg_name:'mj_req_dissolve_room', name:msg.mj_req_dissolve_room, func:handler.on_mj_req_dissolve_room, func_name:'on_mj_req_dissolve_room', logtag:'[8033:mj_req_dissolve_room ]' },
        [8034]:{ package_name:'msg', msg_name:'mj_ack_dissolve_room', name:msg.mj_ack_dissolve_room, func:handler.on_mj_ack_dissolve_room, func_name:'on_mj_ack_dissolve_room', logtag:'[8034:mj_ack_dissolve_room ]' },
        [8035]:{ package_name:'msg', msg_name:'mj_req_exit_room', name:msg.mj_req_exit_room, func:handler.on_mj_req_exit_room, func_name:'on_mj_req_exit_room', logtag:'[8035:mj_req_exit_room ]' },
        [8036]:{ package_name:'msg', msg_name:'mj_ack_exit_room', name:msg.mj_ack_exit_room, func:handler.on_mj_ack_exit_room, func_name:'on_mj_ack_exit_room', logtag:'[8036:mj_ack_exit_room ]' },
        [8037]:{ package_name:'msg', msg_name:'mj_ack_playerEnter', name:msg.mj_ack_playerEnter, func:handler.on_mj_ack_playerEnter, func_name:'on_mj_ack_playerEnter', logtag:'[8037:mj_ack_playerEnter ]' },
        [8038]:{ package_name:'msg', msg_name:'mj_req_ready', name:msg.mj_req_ready, func:handler.on_mj_req_ready, func_name:'on_mj_req_ready', logtag:'[8038:mj_req_ready ]' },
        [8039]:{ package_name:'msg', msg_name:'mj_ack_ready', name:msg.mj_ack_ready, func:handler.on_mj_ack_ready, func_name:'on_mj_ack_ready', logtag:'[8039:mj_ack_ready ]' },
        [8040]:{ package_name:'msg', msg_name:'mj_ack_opening', name:msg.mj_ack_opening, func:handler.on_mj_ack_opening, func_name:'on_mj_ack_opening', logtag:'[8040:mj_ack_opening ]' },
        [8041]:{ package_name:'msg', msg_name:'mj_bc_moPai', name:msg.mj_bc_moPai, func:handler.on_mj_bc_moPai, func_name:'on_mj_bc_moPai', logtag:'[8041:mj_bc_moPai ]' },
        [8042]:{ package_name:'msg', msg_name:'mj_ack_game_overturn', name:msg.mj_ack_game_overturn, func:handler.on_mj_ack_game_overturn, func_name:'on_mj_ack_game_overturn', logtag:'[8042:mj_ack_game_overturn ]' },
        [8043]:{ package_name:'msg', msg_name:'mj_ack_game_deal_cards', name:msg.mj_ack_game_deal_cards, func:handler.on_mj_ack_game_deal_cards, func_name:'on_mj_ack_game_deal_cards', logtag:'[8043:mj_ack_game_deal_cards ]' },
        [8044]:{ package_name:'msg', msg_name:'mj_ack_game_send_out_card', name:msg.mj_ack_game_send_out_card, func:handler.on_mj_ack_game_send_out_card, func_name:'on_mj_ack_game_send_out_card', logtag:'[8044:mj_ack_game_send_out_card ]' },
        [8045]:{ package_name:'msg', msg_name:'mj_game_send_end_lottery', name:msg.mj_game_send_end_lottery, func:handler.on_mj_game_send_end_lottery, func_name:'on_mj_game_send_end_lottery', logtag:'[8045:mj_game_send_end_lottery ]' },
        [8046]:{ package_name:'msg', msg_name:'mj_req_game_send_out_card', name:msg.mj_req_game_send_out_card, func:handler.on_mj_req_game_send_out_card, func_name:'on_mj_req_game_send_out_card', logtag:'[8046:mj_req_game_send_out_card ]' },
        [8047]:{ package_name:'msg', msg_name:'mj_req_chi', name:msg.mj_req_chi, func:handler.on_mj_req_chi, func_name:'on_mj_req_chi', logtag:'[8047:mj_req_chi ]' },
        [8048]:{ package_name:'msg', msg_name:'mj_ack_chi', name:msg.mj_ack_chi, func:handler.on_mj_ack_chi, func_name:'on_mj_ack_chi', logtag:'[8048:mj_ack_chi ]' },
        [8049]:{ package_name:'msg', msg_name:'mj_req_game_act_peng', name:msg.mj_req_game_act_peng, func:handler.on_mj_req_game_act_peng, func_name:'on_mj_req_game_act_peng', logtag:'[8049:mj_req_game_act_peng ]' },
        [8050]:{ package_name:'msg', msg_name:'mj_ack_game_act_peng', name:msg.mj_ack_game_act_peng, func:handler.on_mj_ack_game_act_peng, func_name:'on_mj_ack_game_act_peng', logtag:'[8050:mj_ack_game_act_peng ]' },
        [8051]:{ package_name:'msg', msg_name:'mj_req_game_act_gang', name:msg.mj_req_game_act_gang, func:handler.on_mj_req_game_act_gang, func_name:'on_mj_req_game_act_gang', logtag:'[8051:mj_req_game_act_gang ]' },
        [8052]:{ package_name:'msg', msg_name:'mj_ack_game_act_gang', name:msg.mj_ack_game_act_gang, func:handler.on_mj_ack_game_act_gang, func_name:'on_mj_ack_game_act_gang', logtag:'[8052:mj_ack_game_act_gang ]' },
        [8053]:{ package_name:'msg', msg_name:'mj_req_game_act_bugang', name:msg.mj_req_game_act_bugang, func:handler.on_mj_req_game_act_bugang, func_name:'on_mj_req_game_act_bugang', logtag:'[8053:mj_req_game_act_bugang ]' },
        [8054]:{ package_name:'msg', msg_name:'mj_ack_game_act_bugang', name:msg.mj_ack_game_act_bugang, func:handler.on_mj_ack_game_act_bugang, func_name:'on_mj_ack_game_act_bugang', logtag:'[8054:mj_ack_game_act_bugang ]' },
        [8055]:{ package_name:'msg', msg_name:'mj_req_game_act_guo', name:msg.mj_req_game_act_guo, func:handler.on_mj_req_game_act_guo, func_name:'on_mj_req_game_act_guo', logtag:'[8055:mj_req_game_act_guo ]' },
        [8056]:{ package_name:'msg', msg_name:'mj_ack_game_act_guo', name:msg.mj_ack_game_act_guo, func:handler.on_mj_ack_game_act_guo, func_name:'on_mj_ack_game_act_guo', logtag:'[8056:mj_ack_game_act_guo ]' },
        [8057]:{ package_name:'msg', msg_name:'mj_req_game_act_hu', name:msg.mj_req_game_act_hu, func:handler.on_mj_req_game_act_hu, func_name:'on_mj_req_game_act_hu', logtag:'[8057:mj_req_game_act_hu ]' },
        [8058]:{ package_name:'msg', msg_name:'mj_req_game_ting', name:msg.mj_req_game_ting, func:handler.on_mj_req_game_ting, func_name:'on_mj_req_game_ting', logtag:'[8058:mj_req_game_ting ]' },
        [8059]:{ package_name:'msg', msg_name:'mj_ack_game_ting', name:msg.mj_ack_game_ting, func:handler.on_mj_ack_game_ting, func_name:'on_mj_ack_game_ting', logtag:'[8059:mj_ack_game_ting ]' },
        [8060]:{ package_name:'msg', msg_name:'mj_ack_game_dabao', name:msg.mj_ack_game_dabao, func:handler.on_mj_ack_game_dabao, func_name:'on_mj_ack_game_dabao', logtag:'[8060:mj_ack_game_dabao ]' },
        [8061]:{ package_name:'msg', msg_name:'mj_ack_game_changbao', name:msg.mj_ack_game_changbao, func:handler.on_mj_ack_game_changbao, func_name:'on_mj_ack_game_changbao', logtag:'[8061:mj_ack_game_changbao ]' },
        [8062]:{ package_name:'msg', msg_name:'mj_req_remain_majiang', name:msg.mj_req_remain_majiang, func:handler.on_mj_req_remain_majiang, func_name:'on_mj_req_remain_majiang', logtag:'[8062:mj_req_remain_majiang ]' },
        [8063]:{ package_name:'msg', msg_name:'mj_ack_remain_majiang', name:msg.mj_ack_remain_majiang, func:handler.on_mj_ack_remain_majiang, func_name:'on_mj_ack_remain_majiang', logtag:'[8063:mj_ack_remain_majiang ]' },
        [8064]:{ package_name:'msg', msg_name:'mj_req_change_majiang', name:msg.mj_req_change_majiang, func:handler.on_mj_req_change_majiang, func_name:'on_mj_req_change_majiang', logtag:'[8064:mj_req_change_majiang ]' },
        [8065]:{ package_name:'msg', msg_name:'mj_ack_change_majiang', name:msg.mj_ack_change_majiang, func:handler.on_mj_ack_change_majiang, func_name:'on_mj_ack_change_majiang', logtag:'[8065:mj_ack_change_majiang ]' },
        [8066]:{ package_name:'msg', msg_name:'mj_ask_show_tingpai_tips', name:msg.mj_ask_show_tingpai_tips, func:handler.on_mj_ask_show_tingpai_tips, func_name:'on_mj_ask_show_tingpai_tips', logtag:'[8066:mj_ask_show_tingpai_tips]' },
        [8067]:{ package_name:'msg', msg_name:'mj_ack_rob_remove_card', name:msg.mj_ack_rob_remove_card, func:handler.on_mj_ack_rob_remove_card, func_name:'on_mj_ack_rob_remove_card', logtag:'[8067:mj_ack_rob_remove_card]' },
        [8068]:{ package_name:'msg', msg_name:'mj_ack_update_user_status', name:msg.mj_ack_update_user_status, func:handler.on_mj_ack_update_user_status, func_name:'on_mj_ack_update_user_status', logtag:'[8068:mj_ack_update_user_status]' },
        [8069]:{ package_name:'msg', msg_name:'mj_req_reconnect', name:msg.mj_req_reconnect, func:handler.on_mj_req_reconnect, func_name:'on_mj_req_reconnect', logtag:'[8069:mj_req_reconnect]' },
        [8070]:{ package_name:'msg', msg_name:'mj_ack_reconnect', name:msg.mj_ack_reconnect, func:handler.on_mj_ack_reconnect, func_name:'on_mj_ack_reconnect', logtag:'[8070:mj_ack_reconnect ]' },
        [8071]:{ package_name:'msg', msg_name:'mj_ack_send_player_handinfo', name:msg.mj_ack_send_player_handinfo, func:handler.on_mj_ack_send_player_handinfo, func_name:'on_mj_ack_send_player_handinfo', logtag:'[8071:mj_ack_send_player_handinfo]' },
        [8072]:{ package_name:'msg', msg_name:'mj_req_reloading_ok', name:msg.mj_req_reloading_ok, func:handler.on_mj_req_reloading_ok, func_name:'on_mj_req_reloading_ok', logtag:'[8072:mj_req_reloading_ok]' },
        [8073]:{ package_name:'msg', msg_name:'mj_ack_reloading_ok', name:msg.mj_ack_reloading_ok, func:handler.on_mj_ack_reloading_ok, func_name:'on_mj_ack_reloading_ok', logtag:'[8073:mj_ack_reloading_ok]' },
        [8074]:{ package_name:'msg', msg_name:'mj_ack_finally_result', name:msg.mj_ack_finally_result, func:handler.on_mj_ack_finally_result, func_name:'on_mj_ack_finally_result', logtag:'[8074:mj_ack_finally_result]' },
        [8075]:{ package_name:'msg', msg_name:'mj_ack_fen_zhang', name:msg.mj_ack_fen_zhang, func:handler.on_mj_ack_fen_zhang, func_name:'on_mj_ack_fen_zhang', logtag:'[8075:mj_ack_fen_zhang ]' },
        [8076]:{ package_name:'msg', msg_name:'mj_ack_user_info', name:msg.mj_ack_user_info, func:handler.on_mj_ack_user_info, func_name:'on_mj_ack_user_info', logtag:'[8076:mj_ack_user_info ]' },
        [8077]:{ package_name:'msg', msg_name:'mj_req_tingpai_out_card', name:msg.mj_req_tingpai_out_card, func:handler.on_mj_req_tingpai_out_card, func_name:'on_mj_req_tingpai_out_card', logtag:'[8077:mj_req_tingpai_out_card ]' },
        [8078]:{ package_name:'msg', msg_name:'mj_game_ack_act_huangzhuangpais', name:msg.mj_game_ack_act_huangzhuangpais, func:handler.on_mj_game_ack_act_huangzhuangpais, func_name:'on_mj_game_ack_act_huangzhuangpais', logtag:'[8078:mj_game_ack_act_huangzhuangpais ]' },
        [8079]:{ package_name:'msg', msg_name:'mj_ack_operator', name:msg.mj_ack_operator, func:handler.on_mj_ack_operator, func_name:'on_mj_ack_operator', logtag:'[8079:mj_ack_operator]' },
        [8080]:{ package_name:'msg', msg_name:'mj_ack_dont_win_zero', name:msg.mj_ack_dont_win_zero, func:handler.on_mj_ack_dont_win_zero, func_name:'on_mj_ack_dont_win_zero', logtag:'[8080:mj_ack_dont_win_zero]' },
        [8081]:{ package_name:'msg', msg_name:'mj_req_enter_match', name:msg.mj_req_enter_match, func:handler.on_mj_req_enter_match, func_name:'on_mj_req_enter_match', logtag:'[8081:mj_req_enter_match]' },
        [8082]:{ package_name:'msg', msg_name:'mj_ack_enter_match', name:msg.mj_ack_enter_match, func:handler.on_mj_ack_enter_match, func_name:'on_mj_ack_enter_match', logtag:'[8082:mj_ack_enter_match]' },
        [8083]:{ package_name:'msg', msg_name:'mj_req_update_deposit', name:msg.mj_req_update_deposit, func:handler.on_mj_req_update_deposit, func_name:'on_mj_req_update_deposit', logtag:'[8083:mj_req_update_deposit]' },
        [8084]:{ package_name:'msg', msg_name:'mj_ack_update_deposit', name:msg.mj_ack_update_deposit, func:handler.on_mj_ack_update_deposit, func_name:'on_mj_ack_update_deposit', logtag:'[8084:mj_ack_update_deposit]' },
        [8085]:{ package_name:'msg', msg_name:'mj_ack_update_coin', name:msg.mj_ack_update_coin, func:handler.on_mj_ack_update_coin, func_name:'on_mj_ack_update_coin', logtag:'[8085:mj_ack_update_coin]' },
        [8086]:{ package_name:'msg', msg_name:'mj_ack_bao', name:msg.mj_ack_bao, func:handler.on_mj_ack_bao, func_name:'on_mj_ack_bao', logtag:'[8086:mj_ack_bao]' },
        [8087]:{ package_name:'msg', msg_name:'mj_req_paofen', name:msg.mj_req_paofen, func:handler.on_mj_req_paofen, func_name:'on_mj_req_paofen', logtag:'[8087:mj_req_paofen]' },
        [8088]:{ package_name:'msg', msg_name:'mj_ack_paofen', name:msg.mj_ack_paofen, func:handler.on_mj_ack_paofen, func_name:'on_mj_ack_paofen', logtag:'[8088:mj_ack_paofen]' },
        [8089]:{ package_name:'msg', msg_name:'mj_one_hu_data', name:msg.mj_one_hu_data, func:handler.on_mj_one_hu_data, func_name:'on_mj_one_hu_data', logtag:'[8089:mj_one_hu_data ]' },
        [8090]:{ package_name:'msg', msg_name:'mj_PlayerCoinInfo', name:msg.mj_PlayerCoinInfo, func:handler.on_mj_PlayerCoinInfo, func_name:'on_mj_PlayerCoinInfo', logtag:'[8090:mj_PlayerCoinInfo ]' },
        [8091]:{ package_name:'msg', msg_name:'mj_OthersOperateTips', name:msg.mj_OthersOperateTips, func:handler.on_mj_OthersOperateTips, func_name:'on_mj_OthersOperateTips', logtag:'[8091:mj_OthersOperateTips ]' },
        [8092]:{ package_name:'msg', msg_name:'mj_req_buhua', name:msg.mj_req_buhua, func:handler.on_mj_req_buhua, func_name:'on_mj_req_buhua', logtag:'[8092:mj_req_buhua]' },
        [8093]:{ package_name:'msg', msg_name:'mj_ack_buhua', name:msg.mj_ack_buhua, func:handler.on_mj_ack_buhua, func_name:'on_mj_ack_buhua', logtag:'[8093:mj_ack_buhua]' },
        [8094]:{ package_name:'msg', msg_name:'mj_req_chiting', name:msg.mj_req_chiting, func:handler.on_mj_req_chiting, func_name:'on_mj_req_chiting', logtag:'[8094:mj_req_chiting ]' },
        [8095]:{ package_name:'msg', msg_name:'mj_ack_chiting', name:msg.mj_ack_chiting, func:handler.on_mj_ack_chiting, func_name:'on_mj_ack_chiting', logtag:'[8095:mj_ack_chiting ]' },
        [8096]:{ package_name:'msg', msg_name:'mj_chiting_jiaoInfos', name:msg.mj_chiting_jiaoInfos, func:handler.on_mj_chiting_jiaoInfos, func_name:'on_mj_chiting_jiaoInfos', logtag:'[8096:mj_chiting_jiaoInfos ]' },
        [8097]:{ package_name:'msg', msg_name:'mj_req_pengting', name:msg.mj_req_pengting, func:handler.on_mj_req_pengting, func_name:'on_mj_req_pengting', logtag:'[8097:mj_req_pengting ]' },
        [8098]:{ package_name:'msg', msg_name:'mj_ack_pengting', name:msg.mj_ack_pengting, func:handler.on_mj_ack_pengting, func_name:'on_mj_ack_pengting', logtag:'[8098:mj_ack_pengting ]' },
        [8099]:{ package_name:'msg', msg_name:'mj_req_gangting', name:msg.mj_req_gangting, func:handler.on_mj_req_gangting, func_name:'on_mj_req_gangting', logtag:'[8099:mj_req_gangting ]' },
        [8100]:{ package_name:'msg', msg_name:'mj_ack_gangting', name:msg.mj_ack_gangting, func:handler.on_mj_ack_gangting, func_name:'on_mj_ack_gangting', logtag:'[8100:mj_ack_gangting ]' },

    };
    module.exports = {
        name:"c_msg_mjcommon_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }