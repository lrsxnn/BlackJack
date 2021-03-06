let friend_info2 = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.uid = this.uid;
        content.name = this.name;
        content.head = this.head;
        content.sex = this.sex;
        content.curStatus = this.curStatus;
        content.coin = this.coin;
        content.vipLevel = this.vipLevel;

        return content;
    },
    setUid(uid){
        this.uid = uid;
    },
    setName(name){
        this.name = name;
    },
    setHead(head){
        this.head = head;
    },
    setSex(sex){
        this.sex = sex;
    },
    setCurStatus(curStatus){
        this.curStatus = curStatus;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setVipLevel(vipLevel){
        this.vipLevel = vipLevel;
    },

});

module.exports.friend_info2 = friend_info2;

let friend_apply_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.info = this.info;
        content.addTime = this.addTime;
        content.captcha = this.captcha;

        return content;
    },
    setInfo(info){
        this.info = info;
    },
    setAddTime(addTime){
        this.addTime = addTime;
    },
    setCaptcha(captcha){
        this.captcha = captcha;
    },

});

module.exports.friend_apply_info = friend_apply_info;

let friend_message_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.friendId = this.friendId;
        content.msg = this.msg;
        content.timestamp = this.timestamp;

        return content;
    },
    setFriendId(friendId){
        this.friendId = friendId;
    },
    setMsg(msg){
        this.msg = msg;
    },
    setTimestamp(timestamp){
        this.timestamp = timestamp;
    },

});

module.exports.friend_message_info = friend_message_info;

let friend_game_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.playedTimes = this.playedTimes;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setPlayedTimes(playedTimes){
        this.playedTimes = playedTimes;
    },

});

module.exports.friend_game_info = friend_game_info;

let friend_champion_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.times = this.times;
        content.firstTime = this.firstTime;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setTimes(times){
        this.times = times;
    },
    setFirstTime(firstTime){
        this.firstTime = firstTime;
    },

});

module.exports.friend_champion_info = friend_champion_info;

let friend_detail_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.uid = this.uid;
        content.coin = this.coin;
        content.firstPlayTime = this.firstPlayTime;
        content.favoriteGame = this.favoriteGame;
        content.luckiestWins = this.luckiestWins;
        content.inGameType = this.inGameType;
        content.inRoomCfgId = this.inRoomCfgId;
        content.inRoomId = this.inRoomId;
        content.ip = this.ip;
        content.mood = this.mood;
        content.lastLoginTime = this.lastLoginTime;
        content.remarks = this.remarks;
        content.city = this.city;
        content.gamesList = this.gamesList;
        content.champsList = this.champsList;

        return content;
    },
    setUid(uid){
        this.uid = uid;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setFirstPlayTime(firstPlayTime){
        this.firstPlayTime = firstPlayTime;
    },
    setFavoriteGame(favoriteGame){
        this.favoriteGame = favoriteGame;
    },
    setLuckiestWins(luckiestWins){
        this.luckiestWins = luckiestWins;
    },
    setInGameType(inGameType){
        this.inGameType = inGameType;
    },
    setInRoomCfgId(inRoomCfgId){
        this.inRoomCfgId = inRoomCfgId;
    },
    setInRoomId(inRoomId){
        this.inRoomId = inRoomId;
    },
    setIp(ip){
        this.ip = ip;
    },
    setMood(mood){
        this.mood = mood;
    },
    setLastLoginTime(lastLoginTime){
        this.lastLoginTime = lastLoginTime;
    },
    setRemarks(remarks){
        this.remarks = remarks;
    },
    setCity(city){
        this.city = city;
    },
    setGamesList(gamesList){
        this.gamesList = gamesList;
    },
    setChampsList(champsList){
        this.champsList = champsList;
    },

});

module.exports.friend_detail_info = friend_detail_info;

let msg_friend_list_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_friend_list_req = msg_friend_list_req;

let msg_friend_list_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.listList = this.listList;

        return content;
    },
    setListList(listList){
        this.listList = listList;
    },

});

module.exports.msg_friend_list_ret = msg_friend_list_ret;

let msg_friend_apply_list_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_friend_apply_list_req = msg_friend_apply_list_req;

let msg_friend_apply_list_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.listList = this.listList;

        return content;
    },
    setListList(listList){
        this.listList = listList;
    },

});

module.exports.msg_friend_apply_list_ret = msg_friend_apply_list_ret;

let msg_friend_detail_info_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.friendId = this.friendId;

        return content;
    },
    setFriendId(friendId){
        this.friendId = friendId;
    },

});

module.exports.msg_friend_detail_info_req = msg_friend_detail_info_req;

let msg_friend_detail_info_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.code = this.code;
        content.detail = this.detail;

        return content;
    },
    setCode(code){
        this.code = code;
    },
    setDetail(detail){
        this.detail = detail;
    },

});

module.exports.msg_friend_detail_info_ret = msg_friend_detail_info_ret;

let msg_lookup_friend_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.idOrName = this.idOrName;

        return content;
    },
    setIdOrName(idOrName){
        this.idOrName = idOrName;
    },

});

module.exports.msg_lookup_friend_req = msg_lookup_friend_req;

let msg_lookup_friend_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.listList = this.listList;

        return content;
    },
    setListList(listList){
        this.listList = listList;
    },

});

module.exports.msg_lookup_friend_ret = msg_lookup_friend_ret;

let msg_add_friend_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.friendId = this.friendId;
        content.captcha = this.captcha;

        return content;
    },
    setFriendId(friendId){
        this.friendId = friendId;
    },
    setCaptcha(captcha){
        this.captcha = captcha;
    },

});

module.exports.msg_add_friend_req = msg_add_friend_req;

let msg_add_friend_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.code = this.code;

        return content;
    },
    setCode(code){
        this.code = code;
    },

});

module.exports.msg_add_friend_ret = msg_add_friend_ret;

let msg_be_add_friend = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.info = this.info;

        return content;
    },
    setInfo(info){
        this.info = info;
    },

});

module.exports.msg_be_add_friend = msg_be_add_friend;

let msg_reply_add_friend_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.friendId = this.friendId;
        content.isAgree = this.isAgree;

        return content;
    },
    setFriendId(friendId){
        this.friendId = friendId;
    },
    setIsAgree(isAgree){
        this.isAgree = isAgree;
    },

});

module.exports.msg_reply_add_friend_req = msg_reply_add_friend_req;

let msg_reply_add_friend_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.code = this.code;

        return content;
    },
    setCode(code){
        this.code = code;
    },

});

module.exports.msg_reply_add_friend_ret = msg_reply_add_friend_ret;

let msg_add_friend_succ = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.list = this.list;

        return content;
    },
    setList(list){
        this.list = list;
    },

});

module.exports.msg_add_friend_succ = msg_add_friend_succ;

let msg_del_friend_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.friendId = this.friendId;

        return content;
    },
    setFriendId(friendId){
        this.friendId = friendId;
    },

});

module.exports.msg_del_friend_req = msg_del_friend_req;

let msg_del_friend_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.code = this.code;

        return content;
    },
    setCode(code){
        this.code = code;
    },

});

module.exports.msg_del_friend_ret = msg_del_friend_ret;

let msg_be_del_friend_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.friendId = this.friendId;

        return content;
    },
    setFriendId(friendId){
        this.friendId = friendId;
    },

});

module.exports.msg_be_del_friend_ret = msg_be_del_friend_ret;

let msg_send_friend_coin_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.friendId = this.friendId;
        content.coin = this.coin;

        return content;
    },
    setFriendId(friendId){
        this.friendId = friendId;
    },
    setCoin(coin){
        this.coin = coin;
    },

});

module.exports.msg_send_friend_coin_req = msg_send_friend_coin_req;

let msg_send_friend_coin_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.code = this.code;

        return content;
    },
    setCode(code){
        this.code = code;
    },

});

module.exports.msg_send_friend_coin_ret = msg_send_friend_coin_ret;

let msg_chat_friend_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.msgType = this.msgType;
        content.id = this.id;
        content.msg = this.msg;
        content.time = this.time;
        content.toUserId = this.toUserId;

        return content;
    },
    setMsgType(msgType){
        this.msgType = msgType;
    },
    setId(id){
        this.id = id;
    },
    setMsg(msg){
        this.msg = msg;
    },
    setTime(time){
        this.time = time;
    },
    setToUserId(toUserId){
        this.toUserId = toUserId;
    },

});

module.exports.msg_chat_friend_req = msg_chat_friend_req;

let msg_chat_friend_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.msgType = this.msgType;
        content.id = this.id;
        content.msg = this.msg;
        content.time = this.time;
        content.fromUserId = this.fromUserId;

        return content;
    },
    setMsgType(msgType){
        this.msgType = msgType;
    },
    setId(id){
        this.id = id;
    },
    setMsg(msg){
        this.msg = msg;
    },
    setTime(time){
        this.time = time;
    },
    setFromUserId(fromUserId){
        this.fromUserId = fromUserId;
    },

});

module.exports.msg_chat_friend_ret = msg_chat_friend_ret;

let msg_friend_messages_list_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_friend_messages_list_req = msg_friend_messages_list_req;

let msg_friend_messages_list_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.listList = this.listList;

        return content;
    },
    setListList(listList){
        this.listList = listList;
    },

});

module.exports.msg_friend_messages_list_ret = msg_friend_messages_list_ret;

let msg_friend_modify_mood_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.mood = this.mood;

        return content;
    },
    setMood(mood){
        this.mood = mood;
    },

});

module.exports.msg_friend_modify_mood_req = msg_friend_modify_mood_req;

let msg_friend_modify_mood_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.code = this.code;

        return content;
    },
    setCode(code){
        this.code = code;
    },

});

module.exports.msg_friend_modify_mood_ret = msg_friend_modify_mood_ret;

let msg_friend_set_remarks_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.friendId = this.friendId;
        content.remarks = this.remarks;

        return content;
    },
    setFriendId(friendId){
        this.friendId = friendId;
    },
    setRemarks(remarks){
        this.remarks = remarks;
    },

});

module.exports.msg_friend_set_remarks_req = msg_friend_set_remarks_req;

let msg_friend_set_remarks_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.code = this.code;

        return content;
    },
    setCode(code){
        this.code = code;
    },

});

module.exports.msg_friend_set_remarks_ret = msg_friend_set_remarks_ret;

let msg_similar_friend_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_similar_friend_req = msg_similar_friend_req;

let msg_similar_friend_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.listList = this.listList;

        return content;
    },
    setListList(listList){
        this.listList = listList;
    },

});

module.exports.msg_similar_friend_ret = msg_similar_friend_ret;

