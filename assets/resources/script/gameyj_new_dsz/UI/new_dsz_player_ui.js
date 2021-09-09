// create by wj 2019/04/02
var deskData = require('new_dsz_desk').New_DSZ_Desk_Data.Instance();
const config_data = require('dsz_config').DSZ_UserState;
var dsz_send_msg = require('new_dsz_send_msg');

cc.Class({
    extends: cc.Component,

    properties: {
        m_tPlayerData: null,
        m_oPokerInfo: [],
        playerStateAtlas: cc.SpriteAtlas,
        pokerAtlas: cc.SpriteAtlas,
        pokerTypeAtlas: cc.SpriteAtlas,
        emoji_node: cc.Node,
        yuyin_laba: { default: null, type: require('jlmj_yuyin_laba'), tooltip: '语音组件', },
        m_bShowHuaXiao: true,
    },

    ctor: function () {
        this.typeName = [
            'dsz_sanpai_zi',
            'dsz_duizi_zi',
            'dsz_shunzi_zi',
            'dsz_tonghua_zi',
            'dsz_tonghuashun_zi',
            'dsz_baozi_zi',
        ];
    },

    onLoad: function () {
        this.chipBg = cc.dd.Utils.seekNodeByName(this.node, "betbg");
        //下注
        this.m_oBetTxt = cc.dd.Utils.seekNodeByName(this.node, "bet").getComponent(cc.Label);
        //庄家标记
        this.m_oBankerTag = cc.dd.Utils.seekNodeByName(this.node, "bankerTag");
        //牌描述
        this.m_oDescBg = cc.dd.Utils.seekNodeByName(this.node, "pokertype");
        //点击看牌描述
        this.m_oWatchDescBg = cc.dd.Utils.seekNodeByName(this.node, "watchTag");
        this.m_oWatchDescBg.active = false;
        this.m_oWatchDescNode = cc.dd.Utils.seekNodeByName(this.m_oWatchDescBg, 'desc_watch');
        if (this.m_oWatchDescNode)
            this.m_oWatchDesc = this.m_oWatchDescNode.getComponent(cc.Label);
        //状态
        this.m_oStateSp = cc.dd.Utils.seekNodeByName(this.node, "state");
        //对话框
        //this.m_oDuanyuNode = cc.dd.Utils.seekNodeByName(this.node, "duanyu_bg");
        //this.m_oDuanyuTxt = cc.dd.Utils.seekNodeByName(this.node, "duanyu").getComponent(cc.Label);
        //牌数据
        var pokerNode = cc.dd.Utils.seekNodeByName(this.node, "pokerNode");
        pokerNode.active = false;


        for (var i = 0; i < 3; i++) {
            this.m_oPokerInfo[i] = cc.dd.Utils.seekNodeByName(this.node, "poker" + i)//.getComponent('');
        }
        //玩家身上筹码值
        this.m_oplayerCoinTxt = cc.dd.Utils.seekNodeByName(this.node, "coin").getComponent(cc.Label);
        //看牌按钮
        this.m_oWatchBtn = cc.dd.Utils.seekNodeByName(this.node, "touch").getComponent(cc.Button);
        //玩家遮罩
        this.m_oHeadCoverSp = cc.dd.Utils.seekNodeByName(this.node, 'headCover');

        //托管标志
        this.m_AutoTag = cc.dd.Utils.seekNodeByName(this.node, 'tuoguanTag');
    },
    //绑定玩家数据
    setPlayerData: function (playerData) {
        this.m_tPlayerData = playerData;
        if (playerData.userState == config_data.UserStateWait)
            return;

        if (playerData.isBanker) //庄家标记
            this.m_oBankerTag.active = true;
        //this.freshPlayerChip();
    },


    //可看牌描述
    showWatchPokerDesc: function () {
        if (this.m_tPlayerData == null)
            return;
        var playerData = this.m_tPlayerData;

        if (cc.dd.user.id == playerData.userId) {//如果设置数据为玩家自身
            if (playerData && playerData.pokersState == 0 && playerData.userState != config_data.UserStateLost && playerData.userState != config_data.UserStateWait && playerData.userState != 0) {//未看牌
                this.showPokerBack();
                this.m_oDescBg.active = false;

                if (cc.dd.AppCfg.GAME_ID == 136) {//金币场/自建房
                    var ruleList = deskData.getPlayRule(); //获取游戏规则
                    var bWatchLimit = false;
                    ruleList.forEach(function (rule) {
                        if (rule == 1)
                            bWatchLimit = true;
                    })

                    if (bWatchLimit && deskData.getCurCircle() <= 3) {//必须闷三轮
                        this.m_oWatchDescBg.active = false;
                    } else if (bWatchLimit && deskData.getCurCircle() > 3) {//必闷三轮可看牌
                        this.m_oWatchDescBg.active = true;
                        this.m_oWatchBtn.interactable = true;
                    } else {
                        this.m_oWatchDescBg.active = true;
                        this.m_oWatchBtn.interactable = true;
                    }
                } else {//朋友场
                    var ruleList = deskData.getPlayRule(); //获取游戏规则
                    var bWatchOwn = false;
                    ruleList.forEach(function (rule) {
                        if (rule == 5)
                            bWatchOwn = true;
                    })

                    this.m_oWatchBtn.interactable = false;
                    var limitWatch = deskData.getLimitWatch();
                    if (limitWatch == 0) {//不闷牌
                        if ((bWatchOwn && deskData.getCurOpUser() == cc.dd.user.id) || (!bWatchOwn)) {//轮到自己
                            this.m_oWatchDescBg.active = true;
                            this.m_oWatchBtn.interactable = true;
                            this.m_oWatchDesc.string = '点击看牌';
                        } else if (bWatchOwn && deskData.getCurOpUser() != cc.dd.user.id) {
                            this.m_oWatchDescBg.active = true;
                            this.m_oWatchDesc.string = '自己回合可看';
                        }
                    } else if (deskData.getCurCircle() <= limitWatch) {
                        this.m_oWatchDescBg.active = true;
                        this.m_oWatchDesc.string = '必闷' + limitWatch + '轮';
                    } else if (deskData.getCurCircle() > limitWatch) {//必闷几轮可看牌
                        if ((bWatchOwn && deskData.getCurOpUser() == cc.dd.user.id) || (!bWatchOwn)) {//轮到自己
                            this.m_oWatchDescBg.active = true;
                            this.m_oWatchBtn.interactable = true;
                            this.m_oWatchDesc.string = '点击看牌';
                        } else if (bWatchOwn && deskData.getCurOpUser() != cc.dd.user.id) {
                            this.m_oWatchDescBg.active = true;
                            this.m_oWatchDesc.string = '自己回合可看';
                        }
                    }
                }
            }
        }
    },


    //初始玩家数据信息
    initData: function (playerData) {
        this.setPlayerData(playerData);
        if (playerData.userState == config_data.UserStateWait)
            return;
        //已下注
        this.m_oBetTxt.string = this.convertChipNum(parseInt(playerData.curBetScore));
        // //庄家标记
        // if(playerData.isBanker)
        //     this.m_oBankerTag.active = true;
        if (cc.dd.user.id == playerData.userId) {//如果设置数据为玩家自身
            if (playerData.pokersState == 0) {//未看牌
                this.showWatchPokerDesc();
            } else if (playerData.pokersState == 1) {//已看牌
                this.showPokerFace();
                this.m_tPlayerData.pokers.pokersList.forEach(function (poker, index) {
                    var node = cc.dd.Utils.seekNodeByName(this.node, "poker" + index);
                    node.getChildByName('beimian').active = false;
                }.bind(this));
                this.setPlayerFail(false);
            }
            if (playerData.pokersState == 2) {//弃牌
                this.m_oStateSp.active = true;
                var stateSp = this.m_oStateSp.getComponent(cc.Sprite);
                stateSp.spriteFrame = this.playerStateAtlas.getSpriteFrame('state' + 3);
                this.setPlayerFail(true);
            } else if (playerData.userState == config_data.UserStateLost) {//比牌输掉
                this.m_oStateSp.active = true;
                var stateSp = this.m_oStateSp.getComponent(cc.Sprite);
                stateSp.spriteFrame = this.playerStateAtlas.getSpriteFrame('state' + 1);
                this.setPlayerFail(true);

            }
        } else {//设置数据为其他玩家
            this.showPokerBack();
            this.m_oStateSp.active = false;
            var spName = '';
            if (playerData.pokersState == 1) {//已看牌
                this.m_oWatchDescBg.active = true;
            }
            if (playerData.pokersState == 2) {//弃牌
                spName = 'state' + 3;
                this.m_oStateSp.active = true;
                this.setPlayerFail(true);
            } else if (playerData.userState == config_data.UserStateLost) {//输掉
                spName = 'state' + 1;
                this.m_oStateSp.active = true;
                this.setPlayerFail(true);
            } else if (playerData.userState == config_data.UserStateWait) {
                this.setPlayerPokerState(4);
            }
            var stateSp = this.m_oStateSp.getComponent(cc.Sprite);
            stateSp.spriteFrame = this.playerStateAtlas.getSpriteFrame(spName);

            this.m_oDescBg.active = false;
        }

        if (playerData.userId == deskData.getCurOpUser()) {//如果为当前操作玩家
            var opTime = deskData.getCurOpTime();
            var mytime = Date.parse(new Date()) / 1000;
            if (mytime < opTime) {
                var type = deskData.checkGameIsFriendType() == true ? 0 : 1;
                if (type == 1)
                    type = playerData.userState == 13 ? 2 : 1;
                this.setPlayerConnectState(opTime - mytime, type);
            }
        }
    },

    setPlayerReady: function (isReady) {
        var readyNode = cc.dd.Utils.seekNodeByName(this.node, 'readyBg');//准备标记
        readyNode.active = true;
        readyNode.getChildByName('readyDesc').color = isReady ? cc.color(30, 150, 52) : cc.color(255, 255, 255);
        readyNode.getChildByName('readyDesc').getComponent(cc.Label).string = isReady ? '已准备' : '未准备';
        this.m_oStateSp.active = false;
        this.setPlayerFail(false);
    },

    //刷新玩家下注额/身上分值
    freshPlayerChip: function () {
        this.chipBg.active = true;
        this.m_oBetTxt.string = this.convertChipNum(parseInt(this.m_tPlayerData.betScore)); //设置玩家下注筹码
        this.m_oplayerCoinTxt.string = this.convertChipNum(parseInt(this.m_tPlayerData.curScore)); //玩家身上筹码值
    },

    //检测玩家是否为庄家
    checkPlayerIsBanker: function () {
        return this.m_tPlayerData.isBanker;
    },

    //玩家状态
    setPlayerState: function (state, isNeed) {
        if (state) {
            var pb = this.node.getChildByName('headBg').getChildByName('operatepb');
            pb.active = true;
            if (isNeed) {
                var duration = deskData.getFoldTime();
                pb.getComponent('new_dsz_progressBar').playTimer(duration, null, duration);
            } else {
                if (deskData.checkGameIsFriendType())
                    pb.getComponent('new_dsz_progressBar').playTimerLoop(9);
                else
                    pb.getComponent('new_dsz_progressBar').playTimer(19, null, 19);
            }
        } else {
            var pb = this.node.getChildByName('headBg').getChildByName('operatepb');
            pb.active = false;
            pb.getComponent('new_dsz_progressBar').stopTimer();
        }
    },

    //充值时间延时
    setPlayerRechargeState: function (duration) {
        var pb = this.node.getChildByName('headBg').getChildByName('operatepb');
        pb.active = true;
        pb.getComponent('new_dsz_progressBar').playTimer(duration, null, duration);
        var spName = 'state2'
        this.m_oStateSp.active = true;
        var stateSp = this.m_oStateSp.getComponent(cc.Sprite);
        stateSp.spriteFrame = this.playerStateAtlas.getSpriteFrame(spName);
    },

    //玩家断线重连倒计时
    setPlayerConnectState: function (duration, type) {
        var pb = this.node.getChildByName('headBg').getChildByName('operatepb');
        pb.active = true;
        if (type == 0) {//朋友场
            pb.getComponent('new_dsz_progressBar').playTimer(19, null, duration);
        } else if (type == 1) {//金币场
            pb.getComponent('new_dsz_progressBar').playTimer(9, null, duration);
        } else if (type == 2) {//充值中
            pb.getComponent('new_dsz_progressBar').playTimer(120, null, duration);
            var spName = 'state2'
            this.m_oStateSp.active = true;
            var stateSp = this.m_oStateSp.getComponent(cc.Sprite);
            stateSp.spriteFrame = this.playerStateAtlas.getSpriteFrame(spName);

        }
    },

    //玩家的牌状态
    setPlayerPokerState: function (state) {
        if (state == 2) {
            this.m_oWatchDescBg.active = true;
            this.m_oDescBg.active = false;
        } else {
            var spName = 'state' + state
            this.m_oStateSp.active = true;
            var stateSp = this.m_oStateSp.getComponent(cc.Sprite);
            stateSp.spriteFrame = this.playerStateAtlas.getSpriteFrame(spName);
            if (state == 3 || state == 1) //弃牌和比牌输，需要阴影扣牌
                this.setPlayerFail(true);
            else if (state == 4) {
                var pokerNode = cc.dd.Utils.seekNodeByName(this.node, "pokerNode");
                pokerNode.active = false;
                this.setPlayerFail(true);
            }
        }
    },


    //比牌
    canSelectCmp: function (state) {
        var selectTag = cc.dd.Utils.seekNodeByName(this.node, 'select');
        if (selectTag) {
            selectTag.active = state;
            if (state) {
                selectTag.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.8), cc.fadeOut(0.8))));
            }
        }
        var touchBtn = cc.dd.Utils.seekNodeByName(this.node, 'touchBtn');
        if (touchBtn)
            touchBtn.active = !state
    },

    //弃牌
    fold: function () {
        this.m_oStateSp.active = true;
        var stateSp = this.m_oStateSp.getComponent(cc.Sprite);
        stateSp.spriteFrame = this.playerStateAtlas.getSpriteFrame('state3');//设置弃牌文字

        //this.m_oDescBg.active = false;//隐藏牌类型
        if (cc.dd.user.id == this.m_tPlayerData.userId)
            this.m_oWatchDescBg.active = false;
        this.setPlayerFail(true);
        if (cc.dd.user.id != this.m_tPlayerData.userId)
            this.showPokerBack();//盖牌
    },

    //回放中弃牌
    foldRecord: function () {
        this.m_oStateSp.active = true;
        var stateSp = this.m_oStateSp.getComponent(cc.Sprite);
        stateSp.spriteFrame = this.playerStateAtlas.getSpriteFrame('state3');//设置弃牌文字

        this.m_oDescBg.active = true;//隐藏牌类型
        //this.m_oWatchDescBg.active = false;
        var descTxt = this.m_oDescBg.getChildByName('desc');//可看牌轮数描述
        if (descTxt)
            descTxt.active = false;
        this.setPlayerFail(true);
    },

    //看牌
    watch: function () {
        this.m_oDescBg.active = true;
        this.m_oWatchDescBg.active = false;
        this.m_oWatchBtn.interactable = false;

        this.showPokerFace();
        this.playWatchPokerAnim(true);
    },

    checkShowHuaXiao: function () {

    },

    playWatchPokerAnim: function (isOwn) {
        var pokerNode = cc.dd.Utils.seekNodeByName(this.node, "pokerNode");
        pokerNode.active = true;
        var anim = pokerNode.getComponent(cc.Animation);
        if (isOwn) {
            anim.play('watchPoker');
        } else {
            anim.play('watchPoker_1');
        }
    },

    watchRecord: function () {
        this.m_oWatchDescBg.active = true;

        // cc.dd.Utils.seekNodeByName(this.node, 'watch_record').active = true;
    },

    //发牌
    sendPoker: function (pos) {
        //动画
        var pokerNode = cc.dd.Utils.seekNodeByName(this.node, "pokerNode");
        pokerNode.active = true;
        var anim = pokerNode.getComponent(cc.Animation);
        var animstr = 'sendpoker_' + pos
        if (deskData.getPlayerCount() == 9)
            animstr = 'send_poker_' + pos
        anim.play(animstr);
        this.m_oStateSp.active = false;
        this.setPlayerFail(false);
    },

    sendPokerRecord: function () {
        this.sendPoker();
        this.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
            this.showPokerFace();
            for (var i = 0; i < 3; i++) {
                var node = cc.dd.Utils.seekNodeByName(this.node, "poker" + i);
                node.getChildByName('beimian').active = false;
            }
        }.bind(this))));
    },


    //设置火拼动画
    setFireState: function () {
        this.m_oFireAct.node.active = true;
        this.m_oFireAct.play();
    },

    //显示玩家在线状态
    showOffline: function (isOffline) {
        if (isOffline)
            this.setPlayerPokerState(5);
        else {
            this.m_oStateSp.active = false;
            if (this.m_tPlayerData && this.m_tPlayerData.pokersState) {
                if (this.m_tPlayerData.pokersState == 2) {//弃牌
                    var spName = 'state' + 3;
                    this.m_oStateSp.active = true;
                    var stateSp = this.m_oStateSp.getComponent(cc.Sprite);
                    stateSp.spriteFrame = this.playerStateAtlas.getSpriteFrame(spName);

                } else if (this.m_tPlayerData.userState == config_data.UserStateLost) {//输掉
                    var spName = 'state' + 1;
                    this.m_oStateSp.active = true;
                    var stateSp = this.m_oStateSp.getComponent(cc.Sprite);
                    stateSp.spriteFrame = this.playerStateAtlas.getSpriteFrame(spName);

                }
            }
        }
    },

    //显示玩家失败
    setPlayerFail: function (isFail) {
        for (var i = 0; i < 3; i++) {
            var node = cc.dd.Utils.seekNodeByName(this.node, "poker" + i);
            node.getChildByName('cover').active = isFail;
        }
        if (this.m_oHeadCoverSp)
            this.m_oHeadCoverSp.active = isFail;
    },

    //显示牌面
    showPokerFace: function () {
        if (this.m_tPlayerData.pokers == null || this.m_tPlayerData.pokers.pokersList.length == 0)
            return;
        cc.dd.Utils.seekNodeByName(this.node, 'pokerNode').active = true;
        this.m_tPlayerData.pokers.pokersList.forEach(function (poker, index) {
            var node = cc.dd.Utils.seekNodeByName(this.node, "poker" + index);
            this.setPoker(node, poker);
        }.bind(this));
        this.m_oDescBg.active = true;
        this.m_oWatchDescBg.active = false;
        if (this.m_tPlayerData.pokers.type == 1)
            this.m_tPlayerData.pokers.type = 2
        var typeIndex = this.m_tPlayerData.pokers.type - 2;

        var typeSp = this.m_oDescBg.getChildByName('type').getComponent(cc.Sprite);
        typeSp.spriteFrame = this.pokerTypeAtlas.getSpriteFrame(this.typeName[typeIndex]);
    },

    //盖牌
    showPokerBack: function () {
        //cc.dd.Utils.seekNodeByName(this.node, 'pokerNode').active = true;
        for (var i = 0; i < 3; i++) {
            var node = cc.dd.Utils.seekNodeByName(this.node, "poker" + i);
            node.getChildByName('beimian').active = true;
        }
    },

    //显示牌
    showPoker: function () {
        var pokerNode = cc.dd.Utils.seekNodeByName(this.node, "pokerNode");
        pokerNode.stopAllActions();
        pokerNode.active = true;
    },

    showResut: function (score, luckyScore) {
        this.setPlayerState(false);
        var scoreNode = null;
        if (score > 0) {
            scoreNode = cc.dd.Utils.seekNodeByName(this.node, "winNum");
            scoreNode.getComponent(cc.Label).string = '+' + score;
        }
        else {
            scoreNode = cc.dd.Utils.seekNodeByName(this.node, "failNum");
            scoreNode.getComponent(cc.Label).string = '-' + (-score);
        }

        scoreNode.active = true;
        this.m_Oorigin_x = scoreNode.x;
        this.m_Oorigin_y = scoreNode.y;

        var self = this;
        scoreNode.runAction(cc.sequence(cc.moveTo(0.6, cc.v2(self.m_Oorigin_x, self.m_Oorigin_y + 50)), cc.delayTime(0.1), cc.callFunc(function () { //飘字动画
            //scoreNode.active = false;
            //scoreNode.setPosition(cc.v2(origin_x, origin_y));
            if (luckyScore < 0) {
                var luckyNoe = cc.dd.Utils.seekNodeByName(self.node, "luckfail");
                luckyNoe.active = true;
                luckyNoe.getChildByName('luckfailNum').getComponent(cc.Label).string = luckyScore;
            } else if (luckyScore > 0) {
                var luckyNoe = cc.dd.Utils.seekNodeByName(self.node, "luckwin");
                luckyNoe.active = true;
                luckyNoe.getChildByName('luckwinNum').getComponent(cc.Label).string = '+' + luckyScore;
            }
        })));

    },

    //结算界面
    setResult: function (score, luckyScore) {
        var gc_id = setTimeout(function () {
            this.showResut(score, luckyScore);
            clearTimeout(gc_id);
        }.bind(this), 1000);
    },

    //具体的牌数据设置
    setPoker: function (node, cardValue) {
        if (cardValue < 500) {
            var value = Math.floor(cardValue % 100); //点数
            var flower = Math.floor(cardValue / 100); //花色
            var hua_xiao = node.getChildByName('hua_xiao');
            var hua_da = node.getChildByName('hua_da');
            hua_da.scaleX = 1.2;
            hua_da.scaleY = 1.2;
            var num = node.getChildByName('num');
            num.scaleX = 1;
            num.scaleY = 1;
            //node.getChildByName('beimian').active = false;

            if (value == 14) value = 1;
            if (value < 10)
                value = '0' + value.toString();
            if (flower % 2 != 0) {
                num.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('dsz_pk_r' + value.toString());
            }
            else {
                num.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('dsz_pk_b' + value.toString());
            }
            if (flower == 1)
                flower = 4;
            else if (flower == 2)
                flower = 3;
            else if (flower == 3)
                flower = 2;
            else if (flower == 4)
                flower = 1;
            hua_da.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('dsz_pk_0' + flower.toString());
            hua_da.active = true;
            hua_xiao.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('dsz_pk_0' + flower.toString());
            hua_xiao.active = true;
            this.m_bShowHuaXiao = true;
        } else {
            var value = Math.floor(cardValue % 500); //点数
            var hua_xiao = cc.dd.Utils.seekNodeByName(node, 'hua_xiao');// node.getChildByName('hua_xiao');
            var hua_da = cc.dd.Utils.seekNodeByName(node, 'hua_da');
            hua_da.scaleX = 0.8;
            hua_da.scaleY = 0.8;
            var num = cc.dd.Utils.seekNodeByName(node, 'num');
            num.scaleX = 0.8;
            num.scaleY = 0.8;
            //cc.dd.Utils.seekNodeByName(node,'beimian').active = false;


            if (value == 1) {//小王
                num.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('dsz_pk_b14');
                hua_da.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('dsz_pk_b15');

            }
            else {//大王
                num.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('dsz_pk_r14');
                hua_da.getComponent(cc.Sprite).spriteFrame = this.pokerAtlas.getSpriteFrame('dsz_pk_r15');

            }

            hua_xiao.active = false;
            this.m_bShowHuaXiao = false;
        }
    },

    //显示玩家托管状态
    showPlayerIsAuto: function (isAuto, showDesc) {
        this.m_AutoTag.active = isAuto;
        if (isAuto && showDesc) {
            // this.m_oWatchDescBg.active = showDesc;
            // this.m_oWatchDesc.string = '点击取消托管'
            cc.dd.Utils.seekNodeByName(this.node, 'cancelAuto').active = true;
        } else {
            if (showDesc) {
                cc.dd.Utils.seekNodeByName(this.node, 'cancelAuto').active = false;
                this.m_oWatchDescBg.active = false;
            }
        }

    },

    //操作文字
    doSpeak: function (text, state) {
        this.m_oDuanyuNode.active = true;
        var ani = this.m_oDuanyuNode.getComponent(cc.Animation);
        ani.play();
        this.m_oDuanyuTxt.string = text;
        if (state == config_data.UserStateTry)
            this.m_oDuanyuTxt.fontSize = 20;
        else
            this.m_oDuanyuTxt.fontSize = 28;
    },

    /**
     * 播放表情
     */
    showEmoji: function (id) {
        this.emoji_node.active = true;
        this.emoji_node.getComponent(cc.Animation).play("em" + (id - 1));
        this.scheduleOnce(function () {
            this.emoji_node.active = false;
        }.bind(this), 3);
    },

    /**
     * 播放短语
     */
    showChat: function (str) {
        var chat_node = cc.find('chat', this.node);
        var lbl = chat_node.getChildByName('lbl');
        lbl.getComponent(cc.Label).string = str;
        chat_node.width = lbl.width + 30;
        chat_node.getComponent(cc.Animation).play();
    },

    /**
     * 语音聊天
     */
    play_yuyin: function (duration) {
        this.yuyin_laba.node.active = true;
        this.yuyin_laba.setYuYinSize(duration);
        setTimeout(function () {
            this.yuyin_laba.node.active = false;
        }.bind(this), duration * 1000);
    },

    /**
     * 语音
     */
    showYuYing: function (bl) {
        this.yuyin_laba.node.active = bl;
        this.yuyin_laba.yuyin_size.node.active = false;
    },

    //重置
    resetPlayerUI: function () {
        var scoreNode = cc.dd.Utils.seekNodeByName(this.node, "winNum");
        if (scoreNode) {
            scoreNode.active = false;
            scoreNode.setPosition(cc.v2(this.m_Oorigin_x, this.m_Oorigin_y));
            scoreNode.stopAllActions();
        }

        var scoreNode1 = cc.dd.Utils.seekNodeByName(this.node, "failNum");
        if (scoreNode1) {
            scoreNode1.active = false;
            scoreNode1.setPosition(cc.v2(this.m_Oorigin_x, this.m_Oorigin_y));
            scoreNode1.stopAllActions();
        }

        // var readyNode = cc.dd.Utils.seekNodeByName(this.node, 'readyBg');//准备标记
        // if(readyNode)
        //     readyNode.active = false;
        if (this.chipBg)
            this.chipBg.active = false;
        if (this.m_oBankerTag)
            this.m_oBankerTag.active = false;
        if (this.m_oWatchDescBg)
            this.m_oWatchDescBg.active = false;
        if (this.m_oStateSp)
            this.m_oStateSp.active = false;
        if (this.m_oDescBg)
            this.m_oDescBg.active = false;
        cc.dd.Utils.seekNodeByName(this.node, "luckfail").active = false;
        cc.dd.Utils.seekNodeByName(this.node, "luckwin").active = false;

        var recordWatch = cc.dd.Utils.seekNodeByName(this.node, 'watch_record')
        if (recordWatch)
            recordWatch.active = false;

        for (var i = 0; i < 3; i++) {
            var node = cc.dd.Utils.seekNodeByName(this.node, "poker" + i);
            node.getChildByName('beimian').active = true;
        }
        if (this.m_oWatchBtn)
            this.m_oWatchBtn.interactable = false;
        cc.dd.Utils.seekNodeByName(this.node, "pokerNode").active = false;
        this.setPlayerFail(false);
        this.setPlayerState(false);
    },

    //清除玩家数据
    clearUI: function () {
        this.resetPlayerUI();
        cc.dd.Utils.seekNodeByName(this.node, 'coin').getComponent(cc.Label).string = ''; //朋友场玩家进入默认为0

        var headNode = cc.dd.Utils.seekNodeByName(this.node, 'headBg'); //头像设置
        headNode.active = false;
        this.node.active = false;

        var readyNode = cc.dd.Utils.seekNodeByName(this.node, 'readyBg');//准备标记
        if (readyNode)
            readyNode.active = false;
    },

    //清除玩家数据
    clearRecordUI: function () {
        this.resetPlayerUI();
        cc.dd.Utils.seekNodeByName(this.node, 'coin').getComponent(cc.Label).string = ''; //朋友场玩家进入默认为0
        cc.dd.Utils.seekNodeByName(this.node, "pokerNode").active = true;
    },


    /**
     * 发送看牌请求
     */
    sendWatchPoker: function (event, data) {
        dsz_send_msg.sendWatch(this.m_tPlayerData.userId);
    },

    /**
     * 发送比牌请求
     */
    sendComp: function (event, data) {
        dsz_send_msg.sendCmpOp(2, cc.dd.user.id, this.m_tPlayerData.userId);
    },

    /**
     * 发送取消托管
     */
    sendCancelAuto: function (event, data) {
        var gametype = cc.dd.AppCfg.GAME_ID;
        var roomId = deskData.getRoomId();
        dsz_send_msg.sendCancelAuto(gametype, roomId);
    },

    //转换筹码字
    convertChipNum: function (num) {
        var str = num;
        if (num >= 10000 && num < 100000000) {
            if (num > 10000000)
                str = (num / 10000).toFixed(0) + '万';
            else
                str = (num / 10000).toFixed(1) + '万';
        } else if (num >= 100000000)
            str = (num / 100000000).toFixed(1) + '亿';
        return str
    },
});