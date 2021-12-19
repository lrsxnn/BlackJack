
var netCmd = cc.netCmd = {};
var pb = cc.pb = {};
var proto_file = cc.proto_file = ['msg'];
cc.proto = {};
cc.gateNet = require('GateNet');

netCmd.yq_pin3 = require('c_msg_yq_pin3_cmd');
netCmd.club_1 = require('c_msg_club_1_cmd');
netCmd.hall = require('c_msg_hall_cmd');
netCmd.gandengyan = require('c_msg_gandengyan_cmd');
netCmd.fkps = require('c_msg_fkps_cmd');
netCmd.player_world_var = require('c_msg_player_world_var_cmd');
netCmd.rank = require('c_msg_rank_cmd');
netCmd.baoxianxiang = require('c_msg_baoxianxiang_cmd');
netCmd.pk = require('c_msg_pk_cmd');
netCmd.baoxianxiang_coin = require('c_msg_baoxianxiang_coin_cmd');
netCmd.rummy = require('c_msg_rummy_cmd');
netCmd.pin3 = require('c_msg_pin3_cmd');
netCmd.fish = require('c_msg_fish_cmd');
netCmd.hb = require('c_msg_hb_cmd');
netCmd.blackjack = require('c_msg_blackjack_cmd');
netCmd.horse = require('c_msg_horse_cmd');
netCmd.paodekuai = require('c_msg_paodekuai_cmd');
netCmd.sdy = require('c_msg_sdy_cmd');
netCmd.match = require('c_msg_match_cmd');
netCmd.zhajinhua = require('c_msg_zhajinhua_cmd');
netCmd.club = require('c_msg_club_cmd');
netCmd.br_tb = require('c_msg_br_tb_cmd');
netCmd.login = require('c_msg_login_cmd');
netCmd.doudizhu = require('c_msg_doudizhu_cmd');
netCmd.suoha = require('c_msg_suoha_cmd');
netCmd.bisai = require('c_msg_bisai_cmd');
netCmd.fqzs = require('c_msg_fqzs_cmd');
netCmd.common = require('c_msg_common_cmd');
netCmd.room_mgr = require('c_msg_room_mgr_cmd');
netCmd.mjcommon = require('c_msg_mjcommon_cmd');
netCmd.game_rule = require('c_msg_game_rule_cmd');
netCmd.xiyou = require('c_msg_xiyou_cmd');
netCmd.turn = require('c_msg_turn_cmd');
netCmd.paoyao = require('c_msg_paoyao_cmd');
netCmd.tiandakeng = require('c_msg_tiandakeng_cmd');
netCmd.qka_fish_master = require('c_msg_qka_fish_master_cmd');
netCmd.cluster = require('c_msg_cluster_cmd');
netCmd.texas = require('c_msg_texas_cmd');
netCmd.douniu = require('c_msg_douniu_cmd');
netCmd.slot = require('c_msg_slot_cmd');
netCmd.activity_collect = require('c_msg_activity_collect_cmd');
netCmd.race = require('c_msg_race_cmd');

pb.activity_collect = require('c_msg_activity_collect_pb');
pb.club_1 = require('c_msg_club_1_pb');
pb.qka_fish_master = require('c_msg_qka_fish_master_pb');
pb.paoyao = require('c_msg_paoyao_pb');
pb.douniu = require('c_msg_douniu_pb');
pb.zhajinhua = require('c_msg_zhajinhua_pb');
pb.br_tb = require('c_msg_br_tb_pb');
pb.pin3 = require('c_msg_pin3_pb');
pb.common = require('c_msg_common_pb');
pb.match = require('c_msg_match_pb');
pb.baoxianxiang_coin = require('c_msg_baoxianxiang_coin_pb');
pb.fqzs = require('c_msg_fqzs_pb');
pb.rummy = require('c_msg_rummy_pb');
pb.texas = require('c_msg_texas_pb');
pb.hall = require('c_msg_hall_pb');
pb.login = require('c_msg_login_pb');
pb.xiyou = require('c_msg_xiyou_pb');
pb.doudizhu = require('c_msg_doudizhu_pb');
pb.game_rule = require('c_msg_game_rule_pb');
pb.gandengyan = require('c_msg_gandengyan_pb');
pb.horse = require('c_msg_horse_pb');
pb.hb = require('c_msg_hb_pb');
pb.fish = require('c_msg_fish_pb');
pb.mjcommon = require('c_msg_mjcommon_pb');
pb.room_mgr = require('c_msg_room_mgr_pb');
pb.yq_pin3 = require('c_msg_yq_pin3_pb');
pb.turn = require('c_msg_turn_pb');
pb.blackjack = require('c_msg_blackjack_pb');
pb.paodekuai = require('c_msg_paodekuai_pb');
pb.player_world_var = require('c_msg_player_world_var_pb');
pb.tiandakeng = require('c_msg_tiandakeng_pb');
pb.fkps = require('c_msg_fkps_pb');
pb.slot = require('c_msg_slot_pb');
pb.rank = require('c_msg_rank_pb');
pb.cluster = require('c_msg_cluster_pb');
pb.sdy = require('c_msg_sdy_pb');
pb.club = require('c_msg_club_pb');
pb.baoxianxiang = require('c_msg_baoxianxiang_pb');
pb.pk = require('c_msg_pk_pb');
pb.suoha = require('c_msg_suoha_pb');
pb.bisai = require('c_msg_bisai_pb');
pb.race = require('c_msg_race_pb');

    