
    const msg = {};
    var handler = require('jlmj_net_handler_ddz');
    var recvFuncs = {
        [3800]:{ package_name:'msg', msg_name:'ddz_desk_info', name:msg.ddz_desk_info, func:handler.on_ddz_desk_info, func_name:'on_ddz_desk_info', logtag:'[3800:ddz_desk_info ]' },
        [3801]:{ package_name:'msg', msg_name:'ddz_player_info', name:msg.ddz_player_info, func:handler.on_ddz_player_info, func_name:'on_ddz_player_info', logtag:'[3801:ddz_player_info ]' },
        [3802]:{ package_name:'msg', msg_name:'ddz_room_info', name:msg.ddz_room_info, func:handler.on_ddz_room_info, func_name:'on_ddz_room_info', logtag:'[3802:ddz_room_info ]' },
        [3803]:{ package_name:'msg', msg_name:'ddz_reconnect_room_info', name:msg.ddz_reconnect_room_info, func:handler.on_ddz_reconnect_room_info, func_name:'on_ddz_reconnect_room_info', logtag:'[3803:ddz_reconnect_room_info ]' },
        [3804]:{ package_name:'msg', msg_name:'ddz_update_desk_status', name:msg.ddz_update_desk_status, func:handler.on_ddz_update_desk_status, func_name:'on_ddz_update_desk_status', logtag:'[3804:ddz_update_desk_status ]' },
        [3805]:{ package_name:'msg', msg_name:'ddz_update_base_score', name:msg.ddz_update_base_score, func:handler.on_ddz_update_base_score, func_name:'on_ddz_update_base_score', logtag:'[3805:ddz_update_base_score ]' },
        [3806]:{ package_name:'msg', msg_name:'ddz_stack_poker_req', name:msg.ddz_stack_poker_req, func:handler.on_ddz_stack_poker_req, func_name:'on_ddz_stack_poker_req', logtag:'[3806:ddz_stack_poker_req ]' },
        [3807]:{ package_name:'msg', msg_name:'ddz_stack_poker_ack', name:msg.ddz_stack_poker_ack, func:handler.on_ddz_stack_poker_ack, func_name:'on_ddz_stack_poker_ack', logtag:'[3807:ddz_stack_poker_ack ]' },
        [3808]:{ package_name:'msg', msg_name:'ddz_hand_poker_list', name:msg.ddz_hand_poker_list, func:handler.on_ddz_hand_poker_list, func_name:'on_ddz_hand_poker_list', logtag:'[3808:ddz_hand_poker_list ]' },
        [3809]:{ package_name:'msg', msg_name:'ddz_change_poker_req', name:msg.ddz_change_poker_req, func:handler.on_ddz_change_poker_req, func_name:'on_ddz_change_poker_req', logtag:'[3809:ddz_change_poker_req ]' },
        [3810]:{ package_name:'msg', msg_name:'ddz_change_poker_ack', name:msg.ddz_change_poker_ack, func:handler.on_ddz_change_poker_ack, func_name:'on_ddz_change_poker_ack', logtag:'[3810:ddz_change_poker_ack ]' },
        [3811]:{ package_name:'msg', msg_name:'ddz_change_poker_result', name:msg.ddz_change_poker_result, func:handler.on_ddz_change_poker_result, func_name:'on_ddz_change_poker_result', logtag:'[3811:ddz_change_poker_result ]' },
        [3812]:{ package_name:'msg', msg_name:'ddz_call_score_req', name:msg.ddz_call_score_req, func:handler.on_ddz_call_score_req, func_name:'on_ddz_call_score_req', logtag:'[3812:ddz_call_score_req ]' },
        [3813]:{ package_name:'msg', msg_name:'ddz_call_score_ack', name:msg.ddz_call_score_ack, func:handler.on_ddz_call_score_ack, func_name:'on_ddz_call_score_ack', logtag:'[3813:ddz_call_score_ack ]' },
        [3814]:{ package_name:'msg', msg_name:'ddz_call_score_result', name:msg.ddz_call_score_result, func:handler.on_ddz_call_score_result, func_name:'on_ddz_call_score_result', logtag:'[3814:ddz_call_score_result ]' },
        [3815]:{ package_name:'msg', msg_name:'ddz_double_score_req', name:msg.ddz_double_score_req, func:handler.on_ddz_double_score_req, func_name:'on_ddz_double_score_req', logtag:'[3815:ddz_double_score_req ]' },
        [3816]:{ package_name:'msg', msg_name:'ddz_double_score_ack', name:msg.ddz_double_score_ack, func:handler.on_ddz_double_score_ack, func_name:'on_ddz_double_score_ack', logtag:'[3816:ddz_double_score_ack ]' },
        [3817]:{ package_name:'msg', msg_name:'ddz_play_role_score_change_info', name:msg.ddz_play_role_score_change_info, func:handler.on_ddz_play_role_score_change_info, func_name:'on_ddz_play_role_score_change_info', logtag:'[3817:ddz_play_role_score_change_info ]' },
        [3818]:{ package_name:'msg', msg_name:'ddz_play_result', name:msg.ddz_play_result, func:handler.on_ddz_play_result, func_name:'on_ddz_play_result', logtag:'[3818:ddz_play_result ]' },
        [3819]:{ package_name:'msg', msg_name:'ddz_player_offline_ack', name:msg.ddz_player_offline_ack, func:handler.on_ddz_player_offline_ack, func_name:'on_ddz_player_offline_ack', logtag:'[3819:ddz_player_offline_ack ]' },
        [3820]:{ package_name:'msg', msg_name:'ddz_player_auto_req', name:msg.ddz_player_auto_req, func:handler.on_ddz_player_auto_req, func_name:'on_ddz_player_auto_req', logtag:'[3820:ddz_player_auto_req ]' },
        [3821]:{ package_name:'msg', msg_name:'ddz_player_auto_ack', name:msg.ddz_player_auto_ack, func:handler.on_ddz_player_auto_ack, func_name:'on_ddz_player_auto_ack', logtag:'[3821:ddz_player_auto_ack ]' },
        [3822]:{ package_name:'msg', msg_name:'ddz_play_poker_req', name:msg.ddz_play_poker_req, func:handler.on_ddz_play_poker_req, func_name:'on_ddz_play_poker_req', logtag:'[3822:ddz_play_poker_req ]' },
        [3823]:{ package_name:'msg', msg_name:'ddz_play_poker_ack', name:msg.ddz_play_poker_ack, func:handler.on_ddz_play_poker_ack, func_name:'on_ddz_play_poker_ack', logtag:'[3823:ddz_play_poker_ack ]' },
        [3824]:{ package_name:'msg', msg_name:'ddz_reconnect_req', name:msg.ddz_reconnect_req, func:handler.on_ddz_reconnect_req, func_name:'on_ddz_reconnect_req', logtag:'[3824:ddz_reconnect_req]' },
        [3825]:{ package_name:'msg', msg_name:'ddz_get_all_poker_req', name:msg.ddz_get_all_poker_req, func:handler.on_ddz_get_all_poker_req, func_name:'on_ddz_get_all_poker_req', logtag:'[3825:ddz_get_all_poker_req ]' },
        [3826]:{ package_name:'msg', msg_name:'ddz_role_poker_info', name:msg.ddz_role_poker_info, func:handler.on_ddz_role_poker_info, func_name:'on_ddz_role_poker_info', logtag:'[3826:ddz_role_poker_info ]' },
        [3827]:{ package_name:'msg', msg_name:'ddz_get_all_poker_ack', name:msg.ddz_get_all_poker_ack, func:handler.on_ddz_get_all_poker_ack, func_name:'on_ddz_get_all_poker_ack', logtag:'[3827:ddz_get_all_poker_ack ]' },
        [3828]:{ package_name:'msg', msg_name:'ddz_record_user_change_poker', name:msg.ddz_record_user_change_poker, func:handler.on_ddz_record_user_change_poker, func_name:'on_ddz_record_user_change_poker', logtag:'[3828:ddz_record_user_change_poker]' },
        [3829]:{ package_name:'msg', msg_name:'ddz_record_change_poker', name:msg.ddz_record_change_poker, func:handler.on_ddz_record_change_poker, func_name:'on_ddz_record_change_poker', logtag:'[3829:ddz_record_change_poker]' },
        [3830]:{ package_name:'msg', msg_name:'ddz_friend_last_player_info', name:msg.ddz_friend_last_player_info, func:handler.on_ddz_friend_last_player_info, func_name:'on_ddz_friend_last_player_info', logtag:'[3830:ddz_friend_last_player_info ]' },
        [3831]:{ package_name:'msg', msg_name:'ddz_friend_last_info', name:msg.ddz_friend_last_info, func:handler.on_ddz_friend_last_info, func_name:'on_ddz_friend_last_info', logtag:'[3831:ddz_friend_last_info ]' },
        [3832]:{ package_name:'msg', msg_name:'ddz_control_poker_info', name:msg.ddz_control_poker_info, func:handler.on_ddz_control_poker_info, func_name:'on_ddz_control_poker_info', logtag:'[3832:ddz_control_poker_info ]' },
        [3833]:{ package_name:'msg', msg_name:'record_player_info', name:msg.record_player_info, func:handler.on_record_player_info, func_name:'on_record_player_info', logtag:'[3833:record_player_info ]' },
        [3834]:{ package_name:'msg', msg_name:'record_desk_info', name:msg.record_desk_info, func:handler.on_record_desk_info, func_name:'on_record_desk_info', logtag:'[3834:record_desk_info ]' },
        [3835]:{ package_name:'msg', msg_name:'record_room_info', name:msg.record_room_info, func:handler.on_record_room_info, func_name:'on_record_room_info', logtag:'[3835:record_room_info]' },
        [3836]:{ package_name:'msg', msg_name:'ddz_play_poker_timeout', name:msg.ddz_play_poker_timeout, func:handler.on_ddz_play_poker_timeout, func_name:'on_ddz_play_poker_timeout', logtag:'[3836:ddz_play_poker_timeout]' },

    };
    module.exports = {
        name:"c_msg_doudizhu_func",
        handler:handler,
        recvFuncs:recvFuncs,
    }
