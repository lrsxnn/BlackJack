
    const msg = {};
    var handler = require('jlmj_net_handler_roomMgr');
    var recvFuncs = {
        [3200]:{ package_name:'msg', msg_name:'common_game', name:msg.common_game, func:handler.on_common_game, func_name:'on_common_game', logtag:'[3200:common_game]' },
        [3201]:{ package_name:'msg', msg_name:'common_game_header', name:msg.common_game_header, func:handler.on_common_game_header, func_name:'on_common_game_header', logtag:'[3201:common_game_header]' },
        [3202]:{ package_name:'msg', msg_name:'common_role', name:msg.common_role, func:handler.on_common_role, func_name:'on_common_role', logtag:'[3202:common_role]' },
        [3203]:{ package_name:'msg', msg_name:'msg_create_game_ret', name:msg.msg_create_game_ret, func:handler.on_msg_create_game_ret, func_name:'on_msg_create_game_ret', logtag:'[3203:msg_create_game_ret]' },
        [3204]:{ package_name:'msg', msg_name:'msg_enter_game_req', name:msg.msg_enter_game_req, func:handler.on_msg_enter_game_req, func_name:'on_msg_enter_game_req', logtag:'[3204:msg_enter_game_req]' },
        [3205]:{ package_name:'msg', msg_name:'msg_enter_game_ret', name:msg.msg_enter_game_ret, func:handler.on_msg_enter_game_ret, func_name:'on_msg_enter_game_ret', logtag:'[3205:msg_enter_game_ret]' },
        [3206]:{ package_name:'msg', msg_name:'msg_enter_game_other', name:msg.msg_enter_game_other, func:handler.on_msg_enter_game_other, func_name:'on_msg_enter_game_other', logtag:'[3206:msg_enter_game_other]' },
        [3207]:{ package_name:'msg', msg_name:'msg_leave_game_req', name:msg.msg_leave_game_req, func:handler.on_msg_leave_game_req, func_name:'on_msg_leave_game_req', logtag:'[3207:msg_leave_game_req]' },
        [3208]:{ package_name:'msg', msg_name:'msg_leave_game_ret', name:msg.msg_leave_game_ret, func:handler.on_msg_leave_game_ret, func_name:'on_msg_leave_game_ret', logtag:'[3208:msg_leave_game_ret]' },
        [3209]:{ package_name:'msg', msg_name:'msg_stand_game_req', name:msg.msg_stand_game_req, func:handler.on_msg_stand_game_req, func_name:'on_msg_stand_game_req', logtag:'[3209:msg_stand_game_req]' },
        [3210]:{ package_name:'msg', msg_name:'msg_stand_game_ret', name:msg.msg_stand_game_ret, func:handler.on_msg_stand_game_ret, func_name:'on_msg_stand_game_ret', logtag:'[3210:msg_stand_game_ret]' },
        [3211]:{ package_name:'msg', msg_name:'msg_prepare_game_req', name:msg.msg_prepare_game_req, func:handler.on_msg_prepare_game_req, func_name:'on_msg_prepare_game_req', logtag:'[3211:msg_prepare_game_req]' },
        [3212]:{ package_name:'msg', msg_name:'msg_prepare_game_ret', name:msg.msg_prepare_game_ret, func:handler.on_msg_prepare_game_ret, func_name:'on_msg_prepare_game_ret', logtag:'[3212:msg_prepare_game_ret]' },
        [3213]:{ package_name:'msg', msg_name:'msg_g2h_create_room_ack', name:msg.msg_g2h_create_room_ack, func:handler.on_msg_g2h_create_room_ack, func_name:'on_msg_g2h_create_room_ack', logtag:'[3213:msg_g2h_create_room_ack]' },
        [3214]:{ package_name:'msg', msg_name:'msg_g2h_update_room_state', name:msg.msg_g2h_update_room_state, func:handler.on_msg_g2h_update_room_state, func_name:'on_msg_g2h_update_room_state', logtag:'[3214:msg_g2h_update_room_state]' },
        [3215]:{ package_name:'msg', msg_name:'chat_info', name:msg.chat_info, func:handler.on_chat_info, func_name:'on_chat_info', logtag:'[3215:chat_info]' },
        [3216]:{ package_name:'msg', msg_name:'msg_chat_message_req', name:msg.msg_chat_message_req, func:handler.on_msg_chat_message_req, func_name:'on_msg_chat_message_req', logtag:'[3216:msg_chat_message_req]' },
        [3217]:{ package_name:'msg', msg_name:'msg_chat_message_ret', name:msg.msg_chat_message_ret, func:handler.on_msg_chat_message_ret, func_name:'on_msg_chat_message_ret', logtag:'[3217:msg_chat_message_ret]' },
        [3218]:{ package_name:'msg', msg_name:'msg_game_rule_req', name:msg.msg_game_rule_req, func:handler.on_msg_game_rule_req, func_name:'on_msg_game_rule_req', logtag:'[3218:msg_game_rule_req]' },
        [3219]:{ package_name:'msg', msg_name:'msg_h2g_create_game', name:msg.msg_h2g_create_game, func:handler.on_msg_h2g_create_game, func_name:'on_msg_h2g_create_game', logtag:'[3219:msg_h2g_create_game]' },
        [3220]:{ package_name:'msg', msg_name:'msg_update_room_role_state', name:msg.msg_update_room_role_state, func:handler.on_msg_update_room_role_state, func_name:'on_msg_update_room_role_state', logtag:'[3220:msg_update_room_role_state]' },
        [3221]:{ package_name:'msg', msg_name:'msg_g2h_create_match_ack', name:msg.msg_g2h_create_match_ack, func:handler.on_msg_g2h_create_match_ack, func_name:'on_msg_g2h_create_match_ack', logtag:'[3221:msg_g2h_create_match_ack ]' },
        [3222]:{ package_name:'msg', msg_name:'common_coin', name:msg.common_coin, func:handler.on_common_coin, func_name:'on_common_coin', logtag:'[3222:common_coin]' },
        [3223]:{ package_name:'msg', msg_name:'msg_change_room_req', name:msg.msg_change_room_req, func:handler.on_msg_change_room_req, func_name:'on_msg_change_room_req', logtag:'[3223:msg_change_room_req]' },
        [3224]:{ package_name:'msg', msg_name:'msg_enter_coin_game_ret', name:msg.msg_enter_coin_game_ret, func:handler.on_msg_enter_coin_game_ret, func_name:'on_msg_enter_coin_game_ret', logtag:'[3224:msg_enter_coin_game_ret]' },
        [3225]:{ package_name:'msg', msg_name:'coin_result', name:msg.coin_result, func:handler.on_coin_result, func_name:'on_coin_result', logtag:'[3225:coin_result]' },
        [3226]:{ package_name:'msg', msg_name:'msg_g2h_coin_result', name:msg.msg_g2h_coin_result, func:handler.on_msg_g2h_coin_result, func_name:'on_msg_g2h_coin_result', logtag:'[3226:msg_g2h_coin_result]' },
        [3227]:{ package_name:'msg', msg_name:'tdk_rule_info', name:msg.tdk_rule_info, func:handler.on_tdk_rule_info, func_name:'on_tdk_rule_info', logtag:'[3227:tdk_rule_info ]' },
        [3228]:{ package_name:'msg', msg_name:'msg_change_room_ret', name:msg.msg_change_room_ret, func:handler.on_msg_change_room_ret, func_name:'on_msg_change_room_ret', logtag:'[3228:msg_change_room_ret]' },
        [3229]:{ package_name:'msg', msg_name:'msg_h2g_update_coin', name:msg.msg_h2g_update_coin, func:handler.on_msg_h2g_update_coin, func_name:'on_msg_h2g_update_coin', logtag:'[3229:msg_h2g_update_coin]' },
        [3230]:{ package_name:'msg', msg_name:'p16_req_createdesk', name:msg.p16_req_createdesk, func:handler.on_p16_req_createdesk, func_name:'on_p16_req_createdesk', logtag:'[3230:p16_req_createdesk]' },
        [3231]:{ package_name:'msg', msg_name:'p16_ack_desk_rule', name:msg.p16_ack_desk_rule, func:handler.on_p16_ack_desk_rule, func_name:'on_p16_ack_desk_rule', logtag:'[3231:p16_ack_desk_rule]' },
        [3232]:{ package_name:'msg', msg_name:'msg_enter_coin_game_req', name:msg.msg_enter_coin_game_req, func:handler.on_msg_enter_coin_game_req, func_name:'on_msg_enter_coin_game_req', logtag:'[3232:msg_enter_coin_game_req]' },
        [3233]:{ package_name:'msg', msg_name:'xl_game_rule', name:msg.xl_game_rule, func:handler.on_xl_game_rule, func_name:'on_xl_game_rule', logtag:'[3233:xl_game_rule]' },
        [3234]:{ package_name:'msg', msg_name:'sdy_rule_info', name:msg.sdy_rule_info, func:handler.on_sdy_rule_info, func_name:'on_sdy_rule_info', logtag:'[3234:sdy_rule_info]' },
        [3235]:{ package_name:'msg', msg_name:'ddz_rule_info', name:msg.ddz_rule_info, func:handler.on_ddz_rule_info, func_name:'on_ddz_rule_info', logtag:'[3235:ddz_rule_info]' },
        [3236]:{ package_name:'msg', msg_name:'ps_rule_info', name:msg.ps_rule_info, func:handler.on_ps_rule_info, func_name:'on_ps_rule_info', logtag:'[3236:ps_rule_info]' },
        [3237]:{ package_name:'msg', msg_name:'py_rule_info', name:msg.py_rule_info, func:handler.on_py_rule_info, func_name:'on_py_rule_info', logtag:'[3237:py_rule_info]' },
        [3238]:{ package_name:'msg', msg_name:'na_req_createdesk', name:msg.na_req_createdesk, func:handler.on_na_req_createdesk, func_name:'on_na_req_createdesk', logtag:'[3238:na_req_createdesk]' },
        [3239]:{ package_name:'msg', msg_name:'na_ack_desk_rule', name:msg.na_ack_desk_rule, func:handler.on_na_ack_desk_rule, func_name:'on_na_ack_desk_rule', logtag:'[3239:na_ack_desk_rule ]' },
        [3240]:{ package_name:'msg', msg_name:'room_result_detail', name:msg.room_result_detail, func:handler.on_room_result_detail, func_name:'on_room_result_detail', logtag:'[3240:room_result_detail ]' },
        [3241]:{ package_name:'msg', msg_name:'msg_room_user_info', name:msg.msg_room_user_info, func:handler.on_msg_room_user_info, func_name:'on_msg_room_user_info', logtag:'[3241:msg_room_user_info]' },
        [3242]:{ package_name:'msg', msg_name:'msg_room_user_coin_info', name:msg.msg_room_user_coin_info, func:handler.on_msg_room_user_coin_info, func_name:'on_msg_room_user_coin_info', logtag:'[3242:msg_room_user_coin_info]' },
        [3243]:{ package_name:'msg', msg_name:'msg_create_game_req', name:msg.msg_create_game_req, func:handler.on_msg_create_game_req, func_name:'on_msg_create_game_req', logtag:'[3243:msg_create_game_req]' },
        [3244]:{ package_name:'msg', msg_name:'latlng', name:msg.latlng, func:handler.on_latlng, func_name:'on_latlng', logtag:'[3244:latlng ]' },
        [3245]:{ package_name:'msg', msg_name:'msg_player_location_req', name:msg.msg_player_location_req, func:handler.on_msg_player_location_req, func_name:'on_msg_player_location_req', logtag:'[3245:msg_player_location_req]' },
        [3246]:{ package_name:'msg', msg_name:'msg_player_location_ack', name:msg.msg_player_location_ack, func:handler.on_msg_player_location_ack, func_name:'on_msg_player_location_ack', logtag:'[3246:msg_player_location_ack]' },
        [3247]:{ package_name:'msg', msg_name:'msg_room_coin_update', name:msg.msg_room_coin_update, func:handler.on_msg_room_coin_update, func_name:'on_msg_room_coin_update', logtag:'[3247:msg_room_coin_update]' },
        [3248]:{ package_name:'msg', msg_name:'msg_room_reconnect_req', name:msg.msg_room_reconnect_req, func:handler.on_msg_room_reconnect_req, func_name:'on_msg_room_reconnect_req', logtag:'[3248:msg_room_reconnect_req]' },
        [3249]:{ package_name:'msg', msg_name:'room_dissolve_agree_req', name:msg.room_dissolve_agree_req, func:handler.on_room_dissolve_agree_req, func_name:'on_room_dissolve_agree_req', logtag:'[3249:room_dissolve_agree_req ]' },
        [3250]:{ package_name:'msg', msg_name:'room_dissolve_agree_ack', name:msg.room_dissolve_agree_ack, func:handler.on_room_dissolve_agree_ack, func_name:'on_room_dissolve_agree_ack', logtag:'[3250:room_dissolve_agree_ack ]' },
        [3251]:{ package_name:'msg', msg_name:'room_dissolve_agree_result', name:msg.room_dissolve_agree_result, func:handler.on_room_dissolve_agree_result, func_name:'on_room_dissolve_agree_result', logtag:'[3251:room_dissolve_agree_result ]' },
        [3252]:{ package_name:'msg', msg_name:'room_prepare_req', name:msg.room_prepare_req, func:handler.on_room_prepare_req, func_name:'on_room_prepare_req', logtag:'[3252:room_prepare_req ]' },
        [3253]:{ package_name:'msg', msg_name:'room_prepare_ack', name:msg.room_prepare_ack, func:handler.on_room_prepare_ack, func_name:'on_room_prepare_ack', logtag:'[3253:room_prepare_ack ]' },
        [3254]:{ package_name:'msg', msg_name:'msg_plan_leave_game_req', name:msg.msg_plan_leave_game_req, func:handler.on_msg_plan_leave_game_req, func_name:'on_msg_plan_leave_game_req', logtag:'[3254:msg_plan_leave_game_req]' },
        [3255]:{ package_name:'msg', msg_name:'msg_plan_leave_game_ret', name:msg.msg_plan_leave_game_ret, func:handler.on_msg_plan_leave_game_ret, func_name:'on_msg_plan_leave_game_ret', logtag:'[3255:msg_plan_leave_game_ret]' },
        [3256]:{ package_name:'msg', msg_name:'msg_rank_req', name:msg.msg_rank_req, func:handler.on_msg_rank_req, func_name:'on_msg_rank_req', logtag:'[3256:msg_rank_req]' },
        [3257]:{ package_name:'msg', msg_name:'role_rank_info', name:msg.role_rank_info, func:handler.on_role_rank_info, func_name:'on_role_rank_info', logtag:'[3257:role_rank_info]' },
        [3258]:{ package_name:'msg', msg_name:'history_rank_info', name:msg.history_rank_info, func:handler.on_history_rank_info, func_name:'on_history_rank_info', logtag:'[3258:history_rank_info ]' },
        [3259]:{ package_name:'msg', msg_name:'msg_rank_ret', name:msg.msg_rank_ret, func:handler.on_msg_rank_ret, func_name:'on_msg_rank_ret', logtag:'[3259:msg_rank_ret]' },
        [3260]:{ package_name:'msg', msg_name:'msg_room_pre_enter_req', name:msg.msg_room_pre_enter_req, func:handler.on_msg_room_pre_enter_req, func_name:'on_msg_room_pre_enter_req', logtag:'[3260:msg_room_pre_enter_req]' },
        [3261]:{ package_name:'msg', msg_name:'msg_room_pre_enter_ret', name:msg.msg_room_pre_enter_ret, func:handler.on_msg_room_pre_enter_ret, func_name:'on_msg_room_pre_enter_ret', logtag:'[3261:msg_room_pre_enter_ret]' },
        [3262]:{ package_name:'msg', msg_name:'pin3_rule_info', name:msg.pin3_rule_info, func:handler.on_pin3_rule_info, func_name:'on_pin3_rule_info', logtag:'[3262:pin3_rule_info]' },
        [3263]:{ package_name:'msg', msg_name:'msg_room_change_seat_req', name:msg.msg_room_change_seat_req, func:handler.on_msg_room_change_seat_req, func_name:'on_msg_room_change_seat_req', logtag:'[3263:msg_room_change_seat_req]' },
        [3264]:{ package_name:'msg', msg_name:'msg_room_change_seat_ret', name:msg.msg_room_change_seat_ret, func:handler.on_msg_room_change_seat_ret, func_name:'on_msg_room_change_seat_ret', logtag:'[3264:msg_room_change_seat_ret]' },
        [3265]:{ package_name:'msg', msg_name:'suoha_rule_info', name:msg.suoha_rule_info, func:handler.on_suoha_rule_info, func_name:'on_suoha_rule_info', logtag:'[3265:suoha_rule_info]' },
        [3266]:{ package_name:'msg', msg_name:'seat_role', name:msg.seat_role, func:handler.on_seat_role, func_name:'on_seat_role', logtag:'[3266:seat_role]' },
        [3267]:{ package_name:'msg', msg_name:'jlb_ps_rule_info', name:msg.jlb_ps_rule_info, func:handler.on_jlb_ps_rule_info, func_name:'on_jlb_ps_rule_info', logtag:'[3267:jlb_ps_rule_info]' },
        [3268]:{ package_name:'msg', msg_name:'msg_g2h_immediately_update_room_state', name:msg.msg_g2h_immediately_update_room_state, func:handler.on_msg_g2h_immediately_update_room_state, func_name:'on_msg_g2h_immediately_update_room_state', logtag:'[3268:msg_g2h_immediately_update_room_state]' },
        [3269]:{ package_name:'msg', msg_name:'gdy_rule_info', name:msg.gdy_rule_info, func:handler.on_gdy_rule_info, func_name:'on_gdy_rule_info', logtag:'[3269:gdy_rule_info]' },
        [3270]:{ package_name:'msg', msg_name:'hb_rule_info', name:msg.hb_rule_info, func:handler.on_hb_rule_info, func_name:'on_hb_rule_info', logtag:'[3270:hb_rule_info]' },
        [3271]:{ package_name:'msg', msg_name:'msg_view_friend_game_req', name:msg.msg_view_friend_game_req, func:handler.on_msg_view_friend_game_req, func_name:'on_msg_view_friend_game_req', logtag:'[3271:msg_view_friend_game_req]' },
        [3272]:{ package_name:'msg', msg_name:'msg_view_friend_game_ret', name:msg.msg_view_friend_game_ret, func:handler.on_msg_view_friend_game_ret, func_name:'on_msg_view_friend_game_ret', logtag:'[3272:msg_view_friend_game_ret]' },
        [3273]:{ package_name:'msg', msg_name:'msg_view_friend_game_other', name:msg.msg_view_friend_game_other, func:handler.on_msg_view_friend_game_other, func_name:'on_msg_view_friend_game_other', logtag:'[3273:msg_view_friend_game_other]' },
        [3274]:{ package_name:'msg', msg_name:'yq_pin3_rule_info', name:msg.yq_pin3_rule_info, func:handler.on_yq_pin3_rule_info, func_name:'on_yq_pin3_rule_info', logtag:'[3274:yq_pin3_rule_info]' },
        [3275]:{ package_name:'msg', msg_name:'msg_get_room_user_info_req', name:msg.msg_get_room_user_info_req, func:handler.on_msg_get_room_user_info_req, func_name:'on_msg_get_room_user_info_req', logtag:'[3275:msg_get_room_user_info_req]' },
        [3276]:{ package_name:'msg', msg_name:'msg_get_room_user_info_ret', name:msg.msg_get_room_user_info_ret, func:handler.on_msg_get_room_user_info_ret, func_name:'on_msg_get_room_user_info_ret', logtag:'[3276:msg_get_room_user_info_ret]' },
        [3277]:{ package_name:'msg', msg_name:'room_user_info', name:msg.room_user_info, func:handler.on_room_user_info, func_name:'on_room_user_info', logtag:'[3277:room_user_info]' },
        [3278]:{ package_name:'msg', msg_name:'msg_get_room_self_build_req', name:msg.msg_get_room_self_build_req, func:handler.on_msg_get_room_self_build_req, func_name:'on_msg_get_room_self_build_req', logtag:'[3278:msg_get_room_self_build_req]' },
        [3279]:{ package_name:'msg', msg_name:'room_self_build_info', name:msg.room_self_build_info, func:handler.on_room_self_build_info, func_name:'on_room_self_build_info', logtag:'[3279:room_self_build_info]' },
        [3280]:{ package_name:'msg', msg_name:'msg_get_room_self_build_ret', name:msg.msg_get_room_self_build_ret, func:handler.on_msg_get_room_self_build_ret, func_name:'on_msg_get_room_self_build_ret', logtag:'[3280:msg_get_room_self_build_ret]' },
        [3281]:{ package_name:'msg', msg_name:'msg_check_room_info_req', name:msg.msg_check_room_info_req, func:handler.on_msg_check_room_info_req, func_name:'on_msg_check_room_info_req', logtag:'[3281:msg_check_room_info_req]' },
        [3282]:{ package_name:'msg', msg_name:'msg_check_room_info_ret', name:msg.msg_check_room_info_ret, func:handler.on_msg_check_room_info_ret, func_name:'on_msg_check_room_info_ret', logtag:'[3282:msg_check_room_info_ret]' },
        [3283]:{ package_name:'msg', msg_name:'xl_game_rule_public', name:msg.xl_game_rule_public, func:handler.on_xl_game_rule_public, func_name:'on_xl_game_rule_public', logtag:'[3283:xl_game_rule_public ]' },
        [3284]:{ package_name:'msg', msg_name:'msg_friend_create_room_req', name:msg.msg_friend_create_room_req, func:handler.on_msg_friend_create_room_req, func_name:'on_msg_friend_create_room_req', logtag:'[3284:msg_friend_create_room_req ]' },
        [3285]:{ package_name:'msg', msg_name:'friend_room', name:msg.friend_room, func:handler.on_friend_room, func_name:'on_friend_room', logtag:'[3285:friend_room]' },
        [3286]:{ package_name:'msg', msg_name:'msg_friend_create_room_ret', name:msg.msg_friend_create_room_ret, func:handler.on_msg_friend_create_room_ret, func_name:'on_msg_friend_create_room_ret', logtag:'[3286:msg_friend_create_room_ret ]' },
        [3287]:{ package_name:'msg', msg_name:'coin_result_item', name:msg.coin_result_item, func:handler.on_coin_result_item, func_name:'on_coin_result_item', logtag:'[3287:coin_result_item ]' },
        [3288]:{ package_name:'msg', msg_name:'g2h_sync_room_round', name:msg.g2h_sync_room_round, func:handler.on_g2h_sync_room_round, func_name:'on_g2h_sync_room_round', logtag:'[3288:g2h_sync_room_round]' },
        [3289]:{ package_name:'msg', msg_name:'jisu_req_createdesk', name:msg.jisu_req_createdesk, func:handler.on_jisu_req_createdesk, func_name:'on_jisu_req_createdesk', logtag:'[3289:jisu_req_createdesk]' },

    };
    module.exports = {
        name:"c_msg_room_mgr_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
