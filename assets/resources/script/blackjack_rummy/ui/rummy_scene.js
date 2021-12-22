const RummyData = require("RummyData").RummyData.Instance();
const RummyED = require("RummyData").RummyED;
const RummyEvent = require("RummyData").RummyEvent;
const GAME_STATE = require("RummyData").GAME_STATE;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
let RoomMgr = require("jlmj_room_mgr").RoomMgr;
let HallCommonObj = require('hall_common_data');
let HallCommonEd = HallCommonObj.HallCommonEd;
let HallCommonEvent = HallCommonObj.HallCommonEvent;
const RummyGameMgr = require("RummyGameMgr");

var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        perPointLabel: cc.Label,
        maxWinLabel: cc.Label,

        bottomNode: cc.Node,
        tipsLabel: require('LanguageLabel'),
        tipsNode: cc.Node,
        switchButtonNode: cc.Node,

        showcard: cc.Node,
        showcardNode: cc.Node,
        cardsNode: cc.Node,
        discardNode: cc.Node,

        dropNode: cc.Node,
        invalidShowNode: cc.Node,
        showNode: cc.Node,
        resultNode: cc.Node,

        dropButton: cc.Button,
        dropLabel: cc.Label,
        showButton: cc.Node,
        confirmButton: cc.Node,

        cardPrefab: cc.Prefab,
        cardListNode: cc.Prefab,

        centerChipNode: cc.Node,
        dropDes: require('LanguageLabel'),

        _fixedTimeStep: 1/30,
        _lastTime: 0,
    },

    editor:{
        menu:"Rummy/rummy_scene"
    },

    // LIFE-CYCLE CALLBACKS:

    start(){
        let handler = require("net_handler_rummy");
        cc.tween(this.node)
            .delay(1)
            .call(()=>{
                console.error('on_msg_rm_info')
                handler.on_msg_rm_info({ usersList:
                        [ { pokersList: [],
                            groupsList: [],
                            userId: cc.dd.user.id,
                            userState: 1,
                            dropCoin: 1000 },
                            { pokersList: [],
                                groupsList: [],
                                userId: 419432432,
                                userState: 1,
                                dropCoin: 1000 },
                            { pokersList: [],
                                groupsList: [],
                                userId: 704645120,
                                userState: 1,
                                dropCoin: 1000 },
                            { pokersList: [],
                                groupsList: [],
                                userId: 553651326,
                                userState: 1,
                                dropCoin: 1000 }],
                    bjState: 0,
                    lastTime: 1,
                    roomConfigId: 18501,
                    turn: cc.dd.user.id,
                    turnLeftTime: 1,
                    banker: cc.dd.user.id,
                    dropScores: 0,
                    xcard: 0,
                    giveUp: 0 });
            })
            .delay(1)
            .call(()=>{
                console.error('on_msg_rm_info')
                handler.on_msg_rm_info({ usersList: [ { pokersList: [],
                        groupsList: [],
                        userId: cc.dd.user.id,
                        userState: 1,
                        dropCoin: 1000 },
                        { pokersList: [],
                            groupsList: [],
                            userId: 419432432,
                            userState: 1,
                            dropCoin: 1000 },
                        { pokersList: [],
                            groupsList: [],
                            userId: 704645120,
                            userState: 1,
                            dropCoin: 1000 },
                        { pokersList: [],
                            groupsList: [],
                            userId: 553651326,
                            userState: 1,
                            dropCoin: 1000 }],
                    bjState: 1,
                    lastTime: 10,
                    roomConfigId: 18502,
                    turn: cc.dd.user.id,
                    turnLeftTime: 15,
                    banker: cc.dd.user.id,
                    dropScores: 0,
                    xcard: 11,
                    giveUp: 103 });
            })
            .delay(0.1)
            .call(()=>{
                console.error('on_msg_rm_deal_poker')
                // handler.on_msg_rm_deal_poker({ cardsList: [ [21, 31, 81, 101, 121], [72, 112, 132, 12], [73, 83, 93, 103] ],
                //     handCardsList: [ 132, 83, 72, 93, 101, 121, 81, 31, 21, 112, 73, 12, 103 ],
                //     userId: cc.dd.user.id });
                handler.on_msg_rm_deal_poker({ cardsList: [ [21, 31, 81, 101, 121], [72, 112, 132, 12], [73, 83, 83] ,[44] ],
                    handCardsList: [ 132, 83, 72, 83, 101, 121, 81, 31, 21, 112, 73, 12, 44 ],
                    userId: cc.dd.user.id });
            })
            .delay(10)
            .call(()=>{
                console.error('msg_rm_state_change_2c')
                handler.on_msg_rm_state_change_2c({ roomState: 2, curRound: 0, banker: cc.dd.user.id });
            })
            .delay(0.1)
            .call(()=>{
                console.error('msg_rm_action_change')
                handler.on_msg_rm_action_change({ userId: cc.dd.user.id });
            })
            // .delay(1)
            // .call(()=>{
            //     RummyData.cardType="0";
            //     console.error('on_msg_rm_deal_poker')
            //     // handler.on_msg_rm_deal_poker({ cardsList: [ [21, 31, 81, 101, 121], [72, 112, 132, 12], [73, 83, 93, 103],  [54] ],
            //     //     handCardsList: [ 132, 83, 72, 93, 101, 121, 81, 31, 21, 112, 73, 12, 103, 54 ],
            //     //     card: 54,
            //     //     userId: cc.dd.user.id });
            //     handler.on_msg_rm_deal_poker({ cardsList: [ [21, 31, 81, 101, 121], [72, 112, 132, 12], [73, 83, 83],  [44, 54] ],
            //         handCardsList: [ 132, 83, 72, 83, 101, 121, 81, 31, 21, 112, 73, 12, 44, 54 ],
            //         card: 54,
            //         userId: cc.dd.user.id });
            // })
            // .delay(3)
            // .call(()=>{
            //     console.error('on_msg_rm_give_up_poker_ack')
            //     handler.on_msg_rm_give_up_poker_ack({ ret: 0,
            //         card: 132});
            // })
            // .delay(0.4)
            // .call(()=>{
            //     console.error('msg_rm_action_change')
            //     handler.on_msg_rm_action_change({ userId: 419432432 });
            // })
            // .delay(1)
            // .call(()=>{
            //     console.error('msg_rm_deal_poker_broadcast')
            //     handler.on_msg_rm_deal_poker_broadcast({ userId: 419432432,
            //         type: 0,
            //         cardList: [0]
            //     });
            // })
            // .delay(3)
            // .call(()=>{
            //     console.error('msg_rm_give_up_poker_broadcast')
            //     handler.on_msg_rm_give_up_poker_broadcast({ userId: 419432432,
            //         type: 0,
            //         card: 64,
            //     });
            // })
            // .delay(0.4)
            // .call(()=>{
            //     console.error('msg_rm_action_change')
            //     handler.on_msg_rm_action_change({ userId: 704645120 });
            // })
            // .delay(1)
            // .call(()=>{
            //     console.error('msg_rm_deal_poker_broadcast')
            //     handler.on_msg_rm_deal_poker_broadcast({ userId: 704645120,
            //         type: 1,
            //         cardList: [64]
            //     });
            // })
            // .delay(3)
            // .call(()=>{
            //     console.error('msg_rm_give_up_poker_broadcast')
            //     handler.on_msg_rm_give_up_poker_broadcast({ userId: 704645120,
            //         type: 0,
            //         card: 64,
            //     });
            // })
            // .delay(0.4)
            // .call(()=>{
            //     console.error('msg_rm_action_change')
            //     handler.on_msg_rm_action_change({ userId: 553651326 });
            // })
            // .delay(3)
            // .call(()=>{
            //     console.error('msg_rm_drop_ack')
            //     handler.on_msg_rm_drop_ack({ ret: 0,
            //         userId: 553651326 });
            // })
            // .delay(0.5)
            // .call(()=>{
            //     console.error('msg_drop_score')
            //     handler.on_msg_drop_score({ score: 2000});
            // })
            // .delay(0.4)
            // .call(()=>{
            //     console.error('msg_rm_action_change')
            //     handler.on_msg_rm_action_change({ userId: cc.dd.user.id });
            // })
            // .delay(1)
            // .call(()=>{
            //     RummyData.cardType="1";
            //     console.error('on_msg_rm_deal_poker')
            //     // handler.on_msg_rm_deal_poker({ cardsList: [ [21, 31, 81, 101, 121], [72, 112, 132, 12], [73, 83, 93, 103],  [54] ],
            //     //     handCardsList: [ 132, 83, 72, 93, 101, 121, 81, 31, 21, 112, 73, 12, 103, 54 ],
            //     //     card: 54,
            //     //     userId: cc.dd.user.id });
            //     handler.on_msg_rm_deal_poker({ cardsList: [ [21, 31, 81, 101, 121], [72, 112, 12], [73, 83, 83],  [44, 54, 64] ],
            //         handCardsList: [ 83, 72, 83, 101, 121, 81, 31, 21, 112, 73, 12, 44, 54, 64 ],
            //         card: 64,
            //         userId: cc.dd.user.id });
            // })
            // .delay(3)
            // .call(()=>{
            //     console.error('on_msg_rm_give_up_poker_ack')
            //     handler.on_msg_rm_give_up_poker_ack({ ret: 0,
            //         card: 83});
            // })
            // .delay(0.4)
            // .call(()=>{
            //     console.error('msg_rm_action_change')
            //     handler.on_msg_rm_action_change({ userId: 419432432 });
            // })
            // .delay(3)
            // .call(()=>{
            //     console.error('msg_rm_show_ack')
            //     handler.on_msg_rm_show_ack({ ret: 0,
            //         uid: 419432432,
            //         showCard: 13
            //     });
            // })
            // .delay(0.4)
            // .call(()=>{
            //     console.error('msg_rm_state_change_2c')
            //     handler.on_msg_rm_state_change_2c({ roomState: 3, curRound: 0, banker: cc.dd.user.id });
            // })
            // .delay(5)
            // .call(()=>{
            //     console.error('msg_rm_commit_ack')
            //     handler.on_msg_rm_commit_ack({ ret: 0, uid: 704645120, coin: 1000 });
            // })
            // .delay(5)
            // .call(()=>{
            //     console.error('msg_rm_state_change_2c')
            //     handler.on_msg_rm_state_change_2c({ roomState: 4, curRound: 0, banker: cc.dd.user.id });
            // })
            // .call(()=>{
            //     console.error('msg_rm_result')
            //     handler.on_msg_rm_result({ resultsList: [
            //             {userId:cc.dd.user.id, userName:'guest1639315697', headUrl:'', score:65, coin:-1000, allCoin:3000, groupsList:[[21, 31, 81, 101, 121], [72, 112, 12], [73, 83],  [44, 54, 64]], xcard:11, isdrop:false},
            //             {userId:419432432, userName:'Azfaris Sirafza', headUrl:'2032.png', score:65, coin:3000, allCoin:3000, groupsList:[[21, 31, 81, 101, 121], [72, 112, 12], [73, 83],  [44, 54, 64]], xcard:11, isdrop:false},
            //             {userId:704645120, userName:'Djamel Pokam', headUrl:'2048.png', score:65, coin:-1000, allCoin:3000, groupsList:[[21, 31, 81, 101, 121], [72, 112, 12], [73, 83],  [44, 54, 64]], xcard:11, isdrop:false},
            //             {userId:553651326, userName:'Xavier', headUrl:'3198.png', score:65, coin:-1000, allCoin:3000, groupsList:[[21, 31, 81, 101, 121], [72, 112, 12], [73, 83],  [44, 54, 64]], xcard:11, isdrop:true},
            //         ] });
            // })
            // .delay(2)
            // .call(()=>{
            //     console.error('on_msg_rm_info')
            //     handler.on_msg_rm_info({ usersList:
            //             [ { pokersList: [],
            //                 groupsList: [],
            //                 userId: cc.dd.user.id,
            //                 userState: 1,
            //                 dropCoin: 1000 },
            //                 { pokersList: [],
            //                     groupsList: [],
            //                     userId: 419432432,
            //                     userState: 1,
            //                     dropCoin: 1000 },
            //                 { pokersList: [],
            //                     groupsList: [],
            //                     userId: 704645120,
            //                     userState: 1,
            //                     dropCoin: 1000 },
            //                 { pokersList: [],
            //                     groupsList: [],
            //                     userId: 553651326,
            //                     userState: 1,
            //                     dropCoin: 1000 }],
            //         bjState: 0,
            //         lastTime: 5,
            //         roomConfigId: 18501,
            //         turn: cc.dd.user.id,
            //         turnLeftTime: 5,
            //         banker: cc.dd.user.id,
            //         dropScores: 0,
            //         xcard: 0,
            //         giveUp: 0 });
            // })
            // .delay(5)
            // .call(()=>{
            //     console.error('on_msg_rm_info')
            //     handler.on_msg_rm_info({ usersList: [ { pokersList: [],
            //             groupsList: [],
            //             userId: cc.dd.user.id,
            //             userState: 1,
            //             dropCoin: 1000 },
            //             { pokersList: [],
            //                 groupsList: [],
            //                 userId: 419432432,
            //                 userState: 1,
            //                 dropCoin: 1000 },
            //             { pokersList: [],
            //                 groupsList: [],
            //                 userId: 704645120,
            //                 userState: 1,
            //                 dropCoin: 1000 },
            //             { pokersList: [],
            //                 groupsList: [],
            //                 userId: 553651326,
            //                 userState: 1,
            //                 dropCoin: 1000 }],
            //         bjState: 1,
            //         lastTime: 10,
            //         roomConfigId: 18502,
            //         turn: cc.dd.user.id,
            //         turnLeftTime: 15,
            //         banker: cc.dd.user.id,
            //         dropScores: 0,
            //         xcard: 11,
            //         giveUp: 103 });
            // })
            .start()
    },


    onLoad() {
        RoomED.addObserver(this);
        RummyED.addObserver(this);
        HallCommonEd.addObserver(this);

        this.perPointLabel.string = "";
        this.maxWinLabel.string = "";

        this.clear();
    },

    onDestroy() {
        RoomED.removeObserver(this);
        RummyED.removeObserver(this);
        HallCommonEd.removeObserver(this);
    },

    update(dt){
        this._lastTime += dt;
        let fixedTime = this._lastTime / this._fixedTimeStep;
        for (let i = 0; i < fixedTime; i++) {
            this.fixedUpdate();
        }
        this._lastTime = this._lastTime % this._fixedTimeStep;

        if(RummyData.state === GAME_STATE.WAITING){
            if(this.lastTime >= 0){
                this.lastTime -= dt;

                this.tipsLabel.setText('rummy_text25', '', '', Math.floor(this.lastTime));
            }
        }
    },

    fixedUpdate(){

    },

    onEventMessage: function (event, data) {
        switch (event) {
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                RummyData.clear();
                cc.dd.SceneManager.enterHall();
                break;
            case RoomEvent.on_coin_room_enter:
                break;
            case RoomEvent.on_room_join:
                this.playerJoin(data[0]);
                break;
            case RoomEvent.on_room_leave:
                this.playerLeave(data[0]);
                break;
            case RoomEvent.on_player_stand:
                this.playerStand(data[0]);
                break;
            case RoomEvent.on_room_replace:
                if(data[0].retCode === 0){
                    RummyData.clear();
                    RoomMgr.Instance().player_mgr.updatePlayerNum();
                    this.clear();
                }
                break;
            case RummyEvent.UPDATE_UI:
                this.updateUI();
                break;
            case RummyEvent.UPDATE_STATE:
                this.updateState();
                break;
            case RummyEvent.SYN_DESK:
                this.updateDesk();
                break;
            case RummyEvent.SHOW_RESULT:
                this.resultInfo = data;
                this.scheduleOnce(this.showResult.bind(this), 2)
                break;
            case RummyEvent.PLAYER_TURN:
                break;
            case RummyEvent.CHECK_BUTTON:
                this.checkButton();
                break;
            case RummyEvent.LOSE_GAME:
                this.bottomNode.active = false;
                this.switchButtonNode.active = true;
                break;
            case RummyEvent.UPDATE_DROP_COIN:
                this.updateDropCoin();
                break;
            case RummyEvent.PLAYER_COMMIT:
                this.bottomNode.active = false;
                break;
            default:
                break;
        }
    },

    clear(){
        cc.Tween.stopAllByTarget(this.showcardNode);

        this.cardsNode.removeAllChildren();
        this.discardNode.removeAllChildren();
        this.showcardNode.removeAllChildren();

        this.cardsNode.active = false;
        this.showcard.active = false;
        this.showcardNode.active = false;
        this.discardNode.active = false;

        this.bottomNode.active = false;
        this.tipsNode.active = false;
        this.switchButtonNode.active = false;

        this.centerChipNode.active = false;

        this.dropNode.active = false;
        this.invalidShowNode.active = false;
        this.showNode.active = false;

        if(RummyData.state === GAME_STATE.WAITING && RummyData.lastState === GAME_STATE.RESULTING){
        }else{
            this.unschedule(this.showResult.bind(this));
            this.resultNode.active = false;
        }

        this.showButton.active = true;
        this.confirmButton.active = false;
    },

    checkButton(){
        let player = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
        if(player && RummyData.turn === cc.dd.user.id){
            this.dropButton.interactable = player.handsList.length === 13 && RummyData.state === GAME_STATE.PLAYING;
        }else{
            this.dropButton.interactable = false;
        }
    },

    onClickRule(event, data){
        hall_audio_mgr.com_btn_click();

        cc.dd.UIMgr.openUI("blackjack_blackjack/prefab/blackjack_rule");
    },

    onClickSetting(event, data){
        hall_audio_mgr.com_btn_click();

        cc.dd.UIMgr.openUI("blackjack_blackjack/prefab/blackjack_setting");
    },

    onClickExit(event, data){
        hall_audio_mgr.com_btn_click();

        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
        gameInfoPB.setRoomId(RummyData.roomConfigId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    onClickChat(event, data){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI("blackjack_common/prefab/chat/blackjack_chat", ui=>{
            let widget = cc.find('duanyu_list', ui).getComponent(cc.Widget);
            widget.top = 123.92;
            widget.isAlignTop = true;
            widget.isAlignBottom = false;
            widget.updateAlignment();
        });
    },

    onClickEmoj(event, data){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI("blackjack_common/prefab/chat/blackjack_biaoqing", ui=>{
            let widget = cc.find('biaoqing_grid', ui).getComponent(cc.Widget);
            widget.top = 116.44;
            widget.isAlignTop = true;
            widget.isAlignBottom = false;
            widget.updateAlignment();
        });
    },

    onClickBet(event, data){
        hall_audio_mgr.com_btn_click();

        var msg = new cc.pb.rummy.rm_tips_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.rummy.cmd_rm_tips_req, msg, "rm_tips_req", true);
    },

    onClickSwitch(event, data){
        hall_audio_mgr.com_btn_click();

        var pbData = new cc.pb.room_mgr.msg_change_room_req();
        pbData.setGameType(RoomMgr.Instance().gameId);
        pbData.setRoomCoinId(RummyData.roomConfigId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_change_room_req, pbData, 'msg_change_room_req', true);

    },

    onClickShowDrop(event, data){
        hall_audio_mgr.com_btn_click();
        this.dropNode.active = true;
    },

    onClickShowShow(event, data){
        hall_audio_mgr.com_btn_click();
        this.showNode.active = true;
    },

    onClickCloseDrop(event, data){
        hall_audio_mgr.com_btn_click();
        this.dropNode.active = false;
    },

    onClickCloseShow(event, data){
        hall_audio_mgr.com_btn_click();
        this.showNode.active = false;
    },

    onClickDrop(event, data){
        hall_audio_mgr.com_btn_click();
        var msg = new cc.pb.rummy.msg_rm_drop_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.rummy.cmd_msg_rm_drop_req, msg, "msg_rm_drop_req", true);
    },

    playerJoin(data){
        RoomMgr.Instance().player_mgr.otherPlayerEnter(data.roleInfo.userId);
    },

    playerLeave(data){
        if(data.userId == cc.dd.user.id || !data.hasOwnProperty("userId")){
            RummyData.clear();
            cc.dd.SceneManager.enterHall();
        }
    },

    playerStand(data){
        if(data.userId == cc.dd.user.id){
            RummyData.hasUserPlayer = false;
            this.playerList[0].head.stand();

            // this.sitBtn.active = true;
            // this.standBtn.active = false;
        }else{
            RummyGameMgr.playerExit(data.userId);
        }
    },

    showResult(){
        this.resultNode.active = true;
        this.resultNode.getComponent("rummy_result").setData(this.resultInfo.resultsList);
    },

    /**
     * 初始化桌子
     */
    updateUI(){
        this.clear();

        this.perPointLabel.string = "";
        this.maxWinLabel.string = "";

        this.updateDropCoin();

        this.centerChipNode.active = RummyData.dropScores !== 0;
        this.centerChipNode.getComponentInChildren(cc.Label).string = RummyData.dropScores;

        this.showButton.active = RummyData.state !== GAME_STATE.GROUPING;
        this.confirmButton.active = RummyData.state === GAME_STATE.GROUPING;

        if(RummyData.state === GAME_STATE.WAITING) {
            this.tipsNode.active = true;
            this.tipsLabel.setText('rummy_text25', '', '', RummyData.lastTime);
            this.lastTime = RummyData.lastTime;
            this.switchButtonNode.active = true;
        }else{
            this.cardsNode.active = true;
            this.showcard.active = true;
            this.showcardNode.active = true;
            this.discardNode.active = true;

            if(RoomMgr.Instance().player_mgr.isUserPlaying()){
                if(RummyData.state !== GAME_STATE.DEALING && RummyData.state !== GAME_STATE.RESULTING){
                    this.bottomNode.active = true;
                }

                if(RummyData.lastState === GAME_STATE.WAITING && RummyData.state === GAME_STATE.DEALING){
                    let cardsPos = this.cardsNode.position;

                    this.cardsNode.position = this.showcardNode.position;

                    let paidui1 = cc.instantiate(this.cardListNode);
                    this.cardsNode.addChild(paidui1);
                    paidui1.y = -4;

                    let node = cc.instantiate(this.cardPrefab);
                    node.scaleX = 0.538;
                    node.scaleY= 0.538;
                    node.name = "baida";
                    this.cardsNode.addChild(node);
                    node.getComponent("rummy_card").init(0);

                    let paidui2 = cc.instantiate(this.cardListNode);
                    this.cardsNode.addChild(paidui2);

                    let discard = cc.instantiate(this.cardPrefab);
                    discard.scaleX = 0.538;
                    discard.scaleY= 0.538;
                    this.discardNode.addChild(discard);
                    discard.getComponent("rummy_card").init(0);

                    let worldPos = this.showcardNode.convertToWorldSpaceAR(cc.v2(0, 0));
                    let startPos = this.discardNode.convertToNodeSpaceAR(worldPos);
                    discard.position = startPos;

                    let discardTween = cc.tween(discard)
                        .parallel(
                            cc.tween().to(0.5, {position: cc.v2(0, 0)}, { easing: 'quadOut'}),
                            cc.tween().to(0.25, {scaleX: 0, scaleY: 0.5918}).call(()=>{
                                discard.getComponent("rummy_card").init(RummyData.giveUp);
                            }).to(0.25, {scaleX: 0.538, scaleY: 0.538})
                        );

                    let cardsNodeTween = cc.tween(this.cardsNode)
                        .to(0.5, {position: cardsPos}, { easing: 'quadOut'});

                    let baidaNodeTween = cc.tween(node)
                        .to(0.5, {position: cc.v2(-130, 0)}, { easing: 'expoOut'})
                        .call(()=>{
                            node.zIndex = 0;
                        })
                        .delay(0.5)
                        .to(0.2, {scale: 0.5918}, { easing: 'quintIn'})
                        .to(0.25, {scaleX: 0})
                        .call(()=> {
                            node.getComponent("rummy_card").init(RummyData.xcard);
                            node.getComponent("rummy_card").showMask();
                        })
                        .to(0.25, {scaleX: 0.5918})
                        .to(0.2, {scale: 0.538}, { easing: 'quintOut'})
                        .delay(0.3)
                        .to(0.6, {position: cc.v2(-28.66, -1.144), angle: 11.5}, { easing: 'sineInOut'})

                    cc.tween(this.showcardNode)
                        .delay(5)
                        .call(()=>{
                            discardTween.start()
                        })
                        .delay(0.8)
                        .call(()=>{
                            cardsNodeTween.start()
                        })
                        .delay(1)
                        .call(()=>{
                            baidaNodeTween.start()
                        })
                        .start();
                }else{
                    let discard = cc.instantiate(this.cardPrefab);
                    discard.scaleX = 0.538;
                    discard.scaleY= 0.538;
                    this.discardNode.addChild(discard);

                    discard.getComponent("rummy_card").init(RummyData.giveUp);

                    let node = cc.instantiate(this.cardPrefab);
                    this.cardsNode.addChild(node);
                    node.scaleX = 0.538;
                    node.scaleY= 0.538;
                    node.x = -28.66;
                    node.y = -1.144;
                    node.angle = -11.5;
                    node.name = "baida";

                    node.getComponent("rummy_card").init(RummyData.xcard);
                    node.getComponent("rummy_card").showMask();

                    let paidui1 = cc.instantiate(this.cardListNode);
                    this.cardsNode.addChild(paidui1);
                    paidui1.y = -4;

                    let paidui2 = cc.instantiate(this.cardListNode);
                    this.cardsNode.addChild(paidui2);

                    let player = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
                    if(player){
                        player.setPaiTouch(RummyData.state === 2 || RummyData.state === 3)
                    }
                }
            }else{
                this.tipsNode.active = true;
                this.tipsLabel.setText('WAITING');

                let discard = cc.instantiate(this.cardPrefab);
                discard.scaleX = 0.538;
                discard.scaleY= 0.538;
                this.discardNode.addChild(discard);

                discard.getComponent("rummy_card").init(172);

                let node = cc.instantiate(this.cardPrefab);
                node.scaleX = 0.538;
                node.scaleY= 0.538;
                this.cardsNode.addChild(node);

                node.getComponent("rummy_card").init(172);
            }
        }
    },

    /**
     * 更新状态
     */
    updateState(){
        // this.bottomNode.active = false;
        // this.tipsNode.active = false;
        // this.switchButtonNode.active = false;
        //
        // this.dropNode.active = false;
        // this.invalidShowNode.active = false;
        // this.showNode.active = false;
        //
        // this.cardsNode.active = false;
        // this.showcard.active = false;
        // this.showcardNode.active = false;
        // this.discardNode.active = false;

        this.showButton.active = RummyData.state !== GAME_STATE.GROUPING;
        this.confirmButton.active = RummyData.state === GAME_STATE.GROUPING;

        switch(RummyData.state){
        //     case GAME_STATE.WAITING:
        //         this.bottomNode.active = false;
        //
        //         this.dropNode.active = false;
        //         this.invalidShowNode.active = false;
        //         this.showNode.active = false;
        //
        //         this.cardsNode.active = false;
        //         this.showcard.active = false;
        //         this.showcardNode.active = false;
        //         this.discardNode.active = false;
        //
        //         this.tipsNode.active = true;
        //         this.tipsLabel.setText('rummy_text25', '', '', RummyData.lastTime);
        //         this.lastTime = RummyData.lastTime;
        //         this.switchButtonNode.active = true;
        //         break;
            case GAME_STATE.PLAYING:
                RummyGameMgr.updateBaida();
                this.bottomNode.active = false;
                this.tipsNode.active = false;
                this.switchButtonNode.active = false;

                this.dropNode.active = false;
                this.invalidShowNode.active = false;
                this.showNode.active = false;

                if(RoomMgr.Instance().player_mgr.isUserPlaying()){
                    this.bottomNode.active = true;
                }else{
                    this.tipsNode.active = true;
                    this.tipsLabel.setText('WAITING');
                }

                this.cardsNode.active = true;
                this.showcard.active = true;
                this.showcardNode.active = true;
                this.discardNode.active = true;
                break;
        //     case GAME_STATE.GROUPING:
        //         break;
            case GAME_STATE.RESULTING:
                this.bottomNode.active = false;
                break;
        }
    },

    /**
     * 同步牌堆、弃牌
     */
    updateDesk(){
        this.cardsNode.removeAllChildren();
        this.discardNode.removeAllChildren();

        if(RoomMgr.Instance().player_mgr.isUserPlaying()){
            let discard = cc.instantiate(this.cardPrefab);
            discard.scaleX = 0.538;
            discard.scaleY= 0.538;
            this.discardNode.addChild(discard);

            discard.getComponent("rummy_card").init(RummyData.giveUp);

            let node = cc.instantiate(this.cardPrefab);
            this.cardsNode.addChild(node);
            node.scaleX = 0.538;
            node.scaleY= 0.538;
            node.x = -28.66;
            node.y = -1.144;
            node.angle = -11.5;

            node.getComponent("rummy_card").init(RummyData.xcard);
            node.getComponent("rummy_card").showMask();

            let paidui1 = cc.instantiate(this.cardListNode);
            this.cardsNode.addChild(paidui1);
            paidui1.y = -4;

            let paidui2 = cc.instantiate(this.cardListNode);
            this.cardsNode.addChild(paidui2);

            RummyGameMgr.updateBaida();
        }else{
            let discard = cc.instantiate(this.cardPrefab);
            discard.scaleX = 0.538;
            discard.scaleY= 0.538;
            this.discardNode.addChild(discard);

            discard.getComponent("rummy_card").init(172);

            let node = cc.instantiate(this.cardPrefab);
            node.scaleX = 0.538;
            node.scaleY= 0.538;
            this.cardsNode.addChild(node);

            node.getComponent("rummy_card").init(172);
        }

    },

    updateDropCoin(){
        let user = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
        if(user){
            this.dropLabel.string = user.dropCoin;
            this.dropDes.setText('rummy_text23', '', '', user.dropCoin);
        }
    }
});
