var ddz = require('ddz_util');
var ddz_send_msg = require('ddz_send_msg');
const DDZ_Data = require('ddz_data').DDZ_Data;
const DDZ_ED = require('ddz_data').DDZ_ED;
const DDZ_Event = require('ddz_data').DDZ_Event;
var AudioManager = require('AudioManager');
var ddz_audio_cfg = require('ddz_audio_cfg');

const selectHeight = 25;        //提起牌高度
const paiBorder = 0;         //牌宽度边距 20.8
const cardWidth = 169;          //牌宽

const HANDNUM = 17;             //手牌数量

//操作类型
const opType = {
    NONE: -1,           //隐藏
    CALLSCORE: 0,       //叫分
    DOUBLE: 1,          //加倍
    OUTCARD: 2,         //出牌
    YAOBUQI: 3,         //要不起
    HUANSANZHANG: 4,    //换三张
};

cc.Class({
    extends: cc.Component,

    properties: {
        headnode: { type: cc.Node, default: null, tooltip: "head节点" },
        headsp: { type: cc.Sprite, default: null, tooltip: "头像" },
        namelbl: { type: cc.Label, default: null, tooltip: "昵称" },
        goldlbl: { type: cc.Label, default: null, tooltip: "金币" },
        hand_node: { type: cc.Node, default: null, tooltip: "手牌父节点" },
        out_node: { type: cc.Node, default: null, tooltip: "出牌节点" },
        paiPre: { type: cc.Prefab, default: null, tooltip: "手牌预制" },
        topcard_node: { type: cc.Node, default: null, },
        top1_node: { type: cc.Node, default: null, },
        top2_node: { type: cc.Node, default: null, },
        shunzi_node: { type: cc.Node, default: null, },
        liandui_node: { type: cc.Node, default: null, },
        tongtianshun_node: { type: cc.Node, default: null, },
    },

    // use this for initialization
    onLoad: function () {
        //通天顺
        this.tongtianshun_node.active = true;
        this.tongtianshun_node.active = false;
        this.tongtianshun_ani = this.tongtianshun_node.getComponent(dragonBones.ArmatureDisplay);
        this.tongtianshun_ani.addEventListener(dragonBones.EventObject.COMPLETE, function (event) {
            if (event.detail.animationState.name === "TTS") {
                this.tongtianshun_node.active = false;
            }
        }, this);
    },

    onDestroy: function () {

    },


    /**
     * 刷新界面
     * @param {*} status 
     * @param {*} player 
     */
    refreshPlayerUI(status, player) {
        this.initPlayerInfo(player);
        this.playSendCards(player.handPoker, 0);
        this.displayOutCard(player.outPoker, player.lord);
        cc.find('jiabei', this.headnode).active = (player.double == true);
        cc.find('lord', this.headnode).active = (player.lord == true);
        cc.find('callscore', this.headnode).active = false;
        cc.find('double', this.headnode).active = false;
        if (status == 'cmd_ddz_call_score_ack' && player.callscore != null) {
            this.callScoreRet(player.callscore);
        }
        if (status == 'cmd_ddz_double_score_ack' && player.double != null) {
            if (player.double) {
                cc.find('double', this.headnode).getComponent(cc.Sprite).spriteFrame = this.node.parent.getComponent('ddz_replay').atlas_game.getSpriteFrame('jiabei_2');
            }
            else {
                cc.find('double', this.headnode).getComponent(cc.Sprite).spriteFrame = this.node.parent.getComponent('ddz_replay').atlas_game.getSpriteFrame('dz_bujiabeiicon');
            }
            cc.find('double', this.headnode).active = true;
        }
    },


    //初始化玩家信息
    initPlayerInfo: function (player) {
        this.goldlbl.string = player.score.toString();
        this.initHead(player.headUrl);
    },


    initHead: function (headUrl) {
        //if (headUrl && headUrl != '') {
        cc.dd.SysTools.loadWxheadH5(this.headsp, headUrl);
        // }
    },

    /**
     * 刷新手牌
     * 计算手牌长宽和位置
     */
    refreshHandCards: function (time) {
        var duration = time == null ? 0 : time;
        if (duration > 0) {
            this.canTouch = false;
            this.scheduleOnce(function () {
                this.canTouch = true;
            }.bind(this), duration);
        }
        if (this.hand_node.childrenCount > 17) {
            var offset = (this.hand_node.width + paiBorder - cardWidth) / (this.hand_node.childrenCount - 1);
            for (var i = 0; i < this.hand_node.childrenCount; i++) {
                // this.hand_node.children[i].x = i * offset;
                // this.hand_node.children[i].y = 0;
                var move = cc.moveTo(duration, cc.v2(i * offset, 0));
                this.hand_node.children[i].runAction(move);
            }
        }
        else if (this.hand_node.childrenCount > 0) {
            var offset = (this.hand_node.width + paiBorder - cardWidth) / (17 - 1);
            var start = (this.hand_node.width + paiBorder - (this.hand_node.childrenCount - 1) * offset - cardWidth) / 2;
            for (var i = 0; i < this.hand_node.childrenCount; i++) {
                // this.hand_node.children[i].x = start + i * offset;
                // this.hand_node.children[i].y = 0;
                var move = cc.moveTo(duration, cc.v2(start + i * offset, 0));
                this.hand_node.children[i].runAction(move);
            }
        }
        else {
            return;
        }
    },

    //清除手牌
    clearHandCards: function () {
        for (var i = this.hand_node.childrenCount - 1; i > -1; i--) {
            var node = this.hand_node.children[i];
            if (node.getChildByName('touch') != null) {
                node.removeFromParent();
                node.destroy();
            }
            else {
                node.destroy();
            }
        }
    },

    deleteChangeCard(cards) {
        for (var i = 0; i < cards.length; i++) {
            var idx = this._handCards.indexOf(cards[i]);
            this._handCards.splice(idx, 1);
            var rNode = cc.find(cards[i].toString(), this.hand_node);
            rNode.removeFromParent();
            rNode.destroy();
        }
        this.refreshHandCards(0.2);
    },
    addChangeCard(cardlist) {
        if (this._handCards.indexOf(cardlist[0]) != -1) {
            return;
        }
        var cards = ddz.sortShowCards(cardlist);
        for (var i = 0; i < cards.length; i++) {
            this._handCards.push(cards[i]);
        }
        this._handCards = ddz.sortShowCards(this._handCards);
        var width = cardWidth;
        var offset = (this.hand_node.width + paiBorder - width) / (this.hand_node.childrenCount + cards.length - 1);
        for (var i = 0; i < this.hand_node.childrenCount; i++) {
            var value = parseInt(this.hand_node.children[i].name);
            var index = this._handCards.indexOf(value);
            this.hand_node.children[i].x = index * offset;
            this.hand_node.children[i].y = 0;
            this.hand_node.children[i].touched = null;
        }
        for (var i = 0; i < cards.length; i++) {
            var card = cc.instantiate(this.paiPre);
            card.name = cards[i].toString();
            card.touched = null;
            card.scaleX = 1;
            card.scaleY = 1;
            this.setPoker(card, cards[i]);
            var index = this._handCards.indexOf(cards[i]);
            this.hand_node.addChild(card);
            card.setSiblingIndex(index);
            card.x = index * offset;
            card.y = this.hand_node.children[0].height;
            card.runAction(cc.moveBy(0.5, cc.v2(0, -this.hand_node.children[0].height)));
        }
    },

    /**
     * 发牌显示
     */
    playSendCards: function (cards, time) {
        var duration = time == null ? 1 : time;
        this.remainCard = cards.length;
        this.clearHandCards();
        var showFunc = function () {
            cc.find('Canvas/root/sendcard_ani').getComponent(cc.Animation).off('finished', showFunc, this);
            if (this.soundid) {
                AudioManager.getInstance().stopSound(AudioManager.getInstance().getAudioID(this.soundid));
                this.soundid = null;
            }
            this._handCards = ddz.sortShowCards(cards);
            for (var i = 0; i < this._handCards.length; i++) {
                var card = cc.instantiate(this.paiPre);
                card.name = this._handCards[i].toString();
                card.touched = null;
                card.scaleX = 1;
                card.scaleY = 1;
                var width = card.width;
                var offset = 0;
                var start = 0;
                if (this._handCards.length < HANDNUM) {
                    offset = (this.hand_node.width + paiBorder - width) / (HANDNUM - 1);
                    start = (this.hand_node.width + paiBorder - (this._handCards.length - 1) * offset - width) / 2;
                }
                else {
                    offset = (this.hand_node.width + paiBorder - width) / (this._handCards.length - 1);
                    start = 0;
                }
                this.setPoker(card, this._handCards[i]);
                this.hand_node.addChild(card);
                if (i == this._handCards.length - 1) {
                    if (time == 0) {
                        card.x = start + i * offset;
                        card.y = 0;
                        this.refreshHandCards();
                    }
                    else {
                        card.x = start + i * offset;
                        card.y = 0;
                    }
                }
                else {
                    card.x = start + i * offset;
                    card.y = 0;
                }
            }
        }.bind(this);
        if (duration > 0) {
            var sortcards = ddz.sortShowCards(cards);
            var ani = cc.find('Canvas/root/sendcard_ani').getComponent(cc.Animation);
            for (var i = 0; i < cards.length; i++) {
                this.setPoker(ani.node.children[i], cards[i]);
            }
            var sortFunc = function () {
                ani.off('finished', sortFunc, this);
                for (var i = 0; i < cards.length; i++) {
                    this.setPoker(ani.node.children[i], sortcards[i]);
                }
                ani.on('finished', showFunc, this);
                ani.play('sendcard_ani2');
            }.bind(this);
            ani.on('finished', sortFunc, this);
            ani.play('sendcard_ani');
            cc.find('Canvas/root/dipai_info').active = false;
            // cc.find('Canvas/deal_card').active = true;
            // cc.find('Canvas/deal_card').getComponent(cc.Animation).on('finished', showFunc, this);
            this.soundid = ddz_audio_cfg.EFFECT.DEAL_CARD;
            AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.DEAL_CARD, true);
            // cc.find('Canvas/deal_card').getComponent(cc.Animation).play();
        }
        else {
            showFunc();
        }
    },

    /**
     * 叫分操作显示
     */
    showCallScoreOp: function (time, maxScore, curtime) {
        this.showOperation(opType.CALLSCORE);
        var buttons = [];
        buttons.push(cc.find('op_jiaofen/one', this.node).getComponent(cc.Button));
        buttons.push(cc.find('op_jiaofen/two', this.node).getComponent(cc.Button));
        buttons.push(cc.find('op_jiaofen/three', this.node).getComponent(cc.Button));
        for (var i = 0; i < buttons.length; i++) {
            if (i < maxScore) {
                buttons[i].interactable = false;
            }
            else {
                buttons[i].interactable = true;
            }
        }
        cc.find('op_jiaofen', this.node).getComponentInChildren('ddz_timer').play(time, null, curtime);
    },
    hideCallScoreOp: function () {
        this.showOperation(opType.NONE);
    },

    //叫分返回
    callScoreRet: function (score) {
        var str = '';
        switch (score) {
            case 0:
                str = '不 叫';
                break;
            case 1:
                str = '1 分';
                break;
            case 2:
                str = '2 分';
                break;
            case 3:
                str = '3 分';
                break;
        }
        cc.find('callscore/lbl', this.headnode).getComponent(cc.Label).string = str;
        cc.find('callscore', this.headnode).active = true;
    },

    /**
     * 显示操作
     */
    showOperation: function (type) {
        var ops = [];
        ops.push(cc.find('op_jiaofen', this.node));
        ops.push(cc.find('op_jiabei', this.node));
        ops.push(cc.find('op_chupai', this.node));
        ops.push(cc.find('op_yaobuqi', this.node));
        ops.push(cc.find('op_huansanzhang', this.node));
        for (var i = 0; i < ops.length; i++) {
            if (i == type) {
                ops[i].active = true;
            }
            else {
                ops[i].active = false;
                ops[i].getComponentInChildren('ddz_timer').setActive(false);
            }
        }
    },

    /**
     * 底牌动画
     */
    showBottomCard: function (cardlist) {
        this.remainCard += cardlist.length;
        var cards = ddz.sortShowCards(cardlist);

        var width = cardWidth;
        var offset = (this.hand_node.width + paiBorder - width) / (this.hand_node.childrenCount + cards.length - 1);
        for (var i = 0; i < cards.length; i++) {
            this._handCards.push(cards[i]);
        }
        this._handCards = ddz.sortShowCards(this._handCards);
        var downCard = function () {
            for (var i = 0; i < this.hand_node.childrenCount; i++) {
                var value = parseInt(this.hand_node.children[i].name);
                var index = this._handCards.indexOf(value);
                this.hand_node.children[i].x = index * offset;
                this.hand_node.children[i].y = 0;
                this.hand_node.children[i].touched = null;
            }
            for (var i = 0; i < cards.length; i++) {
                var card = cc.instantiate(this.paiPre);
                card.name = cards[i].toString();
                card.touched = null;
                card.scaleX = 1;
                card.scaleY = 1;
                this.setPoker(card, cards[i]);
                var index = this._handCards.indexOf(cards[i]);
                this.hand_node.addChild(card);
                card.setSiblingIndex(index);
                card.x = index * offset;
                card.y = this.hand_node.children[0].height;
                card.runAction(cc.moveBy(0.3, cc.v2(0, -this.hand_node.children[0].height)));
            }
            cc.find('lord', this.hand_node.children[this.hand_node.childrenCount - 1]).active = true;
        }.bind(this);


        var finish = function () {
            cc.find('dipai_info/bottomcard_ani', this.node.parent).getComponent(cc.Animation).off('finished', finish, this);
            for (var i = 0; i < cards.length; i++) {
                this.setPoker(cc.find('dipai_info/bottomcard_ani/dipai_' + (i + 1).toString(), this.node.parent), cardlist[i]);
            }
            cc.find('dipai_info/bottomcard_ani', this.node.parent).getComponent(cc.Animation).getAnimationState('dipai_rotate').speed = 2;
            cc.find('dipai_info/bottomcard_ani', this.node.parent).getComponent(cc.Animation).play('dipai_rotate');
            this.scheduleOnce(function () {
                downCard();
                cc.find('dipai_info', this.node.parent).getComponent(cc.Animation).play('dipai_ani_jbc');
                this.calSpecialBottom(cardlist);
                for (var i = 0; i < cards.length; i++) {
                    cc.find('dipai_info/dipai_' + (i + 1).toString(), this.node.parent).scale = 0;
                    this.setDipai(cc.find('dipai_info/dipai_' + (i + 1).toString(), this.node.parent), cardlist[i]);
                }
            }.bind(this), 0.5);
        }.bind(this);
        cc.find('dipai_info/bottomcard_ani', this.node.parent).getComponent(cc.Animation).on('finished', finish, this);
        cc.find('dipai_info/bottomcard_ani', this.node.parent).getComponent(cc.Animation).play('dipai_reset');
    },
    calSpecialBottom: function (cardlist) {
        this.node.parent.getComponent('ddz_replay').calSpecialBottom(cardlist);
    },

    //显示加倍
    showDouble: function (time, curtime) {
        //加倍
        this.showOperation(opType.DOUBLE);
        cc.find('op_jiabei', this.node).getComponentInChildren('ddz_timer').play(time, null, curtime);
    },

    //显示换三张
    showChangeCard: function () {
        this.onSelectCardChanged();
        this.showOperation(opType.HUANSANZHANG);
        cc.find('op_huansanzhang', this.node).getComponentInChildren('ddz_timer').play(15, null, null);
    },

    clearOutCardAndPass() {
        cc.find('op', this.node).active = false;
        this.clearOutCard();
    },

    /**
     * 打牌中
     */
    showPlaying: function (time, curtime) {
        cc.find('op', this.node).active = false;
        this.clearOutCard();
        this.tipIndex = -1;//清除提示
        cc.log(DDZ_Data.Instance().lastCards);
        if (DDZ_Data.Instance().lastCards && DDZ_Data.Instance().lastCards.length > 0 && DDZ_Data.Instance().lastPlayer != 0) {
            if (ddz.calCards(DDZ_Data.Instance().lastCards, this._handCards)) {
                this.showOperation(opType.OUTCARD);
                cc.find('op_chupai/tips', this.node).getComponent(cc.Button).interactable = true;
                cc.find('op_chupai/pass', this.node).getComponent(cc.Button).interactable = true;
                this.onSelectCardChanged();
                cc.find('op_chupai', this.node).getComponentInChildren('ddz_timer').play(time, null, curtime);
            }
            else {//没有牌可以大过上家
                this.showOperation(opType.YAOBUQI);
                time = 5;
                cc.find('op_yaobuqi', this.node).getComponentInChildren('ddz_timer').play(time, function () { ddz_send_msg.sendCards([]); }, curtime);
                if (!cc.find('tuoguan_node', this.node).active) {
                    //cc.find('nocard', this.node).getComponent(cc.Animation).play();
                    this.showNoCard(true);
                    //this.scheduleOnce(function () { ddz_send_msg.sendCards([]) }, 1);
                }
            }
        }
        else {
            this.showOperation(opType.OUTCARD);
            cc.find('op_chupai/tips', this.node).getComponent(cc.Button).interactable = false;
            cc.find('op_chupai/pass', this.node).getComponent(cc.Button).interactable = false;
            this.onSelectCardChanged();
            cc.find('op_chupai', this.node).getComponentInChildren('ddz_timer').play(time, null, curtime);
        }
    },

    showNoCard: function (flag) {
        var node = cc.find('nocard', this.node);
        if (flag == true) {
            if (node.active == false) {
                node.opacity = 0;
                node.active = true;
                node.getComponent(cc.Animation).play();
            }
        }
        else {
            if (node.active == true) {
                node.active = false;
            }
        }
    },

    /**
     * 出牌显示
     */
    showOutCard: function (cardlist, isLord) {
        this.showOperation(opType.NONE);
        this.showNoCard(false);
        if (cardlist.length == 0) {
            cc.find('op', this.node).active = true;
            this.clearAllSelectCards();
        }
        else {
            this.remainCard -= cardlist.length;
            for (var i = this._handCards.length - 1; i > -1; i--) {
                if (cardlist.indexOf(this._handCards[i]) != -1) {
                    this._handCards.splice(i, 1);
                }
            }
            var cards = ddz.sortOutCards(cardlist);
            var scale = 0.5;
            var duration = 0.1;
            var endscale = 0.7;
            var midNode = cc.find(cards[Math.floor(cards.length / 2)].toString(), this.hand_node);
            if (!midNode) {
                cc.error('手牌找不到:' + cards[Math.floor(cards.length / 2)].toString());
                return;
            }
            var midX = midNode.x;

            var tp = ddz.analysisCards(cards).type;
            if (tp == 1 && cards[0] == 172) {//
                AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.TOPCARD, false);
                for (var i = 0; i < cards.length; i++) {
                    var rmNode = cc.find(cards[i].toString(), this.hand_node);
                    rmNode.removeFromParent();
                    rmNode.destroy();
                }
                var node = this.top1_node;
                this.setPoker(node.getChildByName('ddz_poker_0'), cards[0]);
                if (isLord) {
                    node.getChildByName('ddz_poker_0').getChildByName('lord').active = true;
                }
                else {
                    node.getChildByName('ddz_poker_0').getChildByName('lord').active = false;
                }
                node.active = true;
                var playFire = function () {
                    node.getComponent(cc.Animation).off('finished', playFire);
                    var pos = cc.v2(640, 226);
                    var top1 = this.topcard_node;
                    top1.getComponent(sp.Skeleton).enabled = true;
                    top1.getComponent(sp.Skeleton).clearTrack(0);
                    top1.getComponent(sp.Skeleton).setAnimation(0, 'dingpai1', false);
                    top1.x = pos.x;
                    top1.y = pos.y;
                }.bind(this);
                node.getComponent(cc.Animation).on('finished', playFire);
                node.getComponent(cc.Animation).play();
            }
            else if (tp == 2 && ddz.analysisCards(cards).index == 16) {//
                AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.TOPCARD, false);
                for (var i = 0; i < cards.length; i++) {
                    var rmvNode = cc.find(cards[i].toString(), this.hand_node);
                    rmvNode.removeFromParent();
                    rmvNode.destroy();
                }
                var node = this.top2_node;
                this.setPoker(node.getChildByName('ddz_poker_0'), cards[0]);
                this.setPoker(node.getChildByName('ddz_poker_1'), cards[1]);
                if (isLord) {
                    node.getChildByName('ddz_poker_1').getChildByName('lord').active = true;
                }
                else {
                    node.getChildByName('ddz_poker_1').getChildByName('lord').active = false;
                }
                node.active = true;
                var playFire = function () {
                    node.getComponent(cc.Animation).off('finished', playFire);
                    var pos = cc.v2(640, 226);
                    var top1 = this.topcard_node;
                    top1.getComponent(sp.Skeleton).enabled = true;
                    top1.getComponent(sp.Skeleton).clearTrack(0);
                    top1.getComponent(sp.Skeleton).setAnimation(0, 'dingpai1', false);
                    top1.x = pos.x;
                    top1.y = pos.y;
                }.bind(this);
                node.getComponent(cc.Animation).on('finished', playFire);
                node.getComponent(cc.Animation).play();
            }
            else {
                if (cardlist.length < 3) {
                    AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.CHUPAI, false);
                }
                else {
                    AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.CHUPAIDA, false);
                }
                for (var i = 0; i < cards.length; i++) {
                    var rNode = cc.find(cards[i].toString(), this.hand_node);
                    rNode.removeFromParent();
                    rNode.destroy();
                    //cc.find(cards[i].toString(), this.hand_node).removeFromParent(true);
                    var card = cc.instantiate(this.paiPre);
                    var offset = (this.hand_node.width + paiBorder - cardWidth) / (17 - 1);
                    this.setPoker(card, cards[i]);
                    if (isLord && i == cards.length - 1) {
                        cc.find('lord', card).active = true;
                    }
                    card.scaleX = scale;
                    card.scaleY = scale;
                    this.out_node.addChild(card);
                    card.setSiblingIndex(i);
                    card.x = (i - Math.floor(cards.length / 2)) * offset * scale + midX;
                    card.y = 0;
                    if (cards.length % 2 == 1) {
                        var moveTo = cc.moveTo(duration, cc.v2((i - Math.floor(cards.length / 2)) * offset * endscale - this.out_node.x - card.width / 2 * endscale, this.out_node.height));
                    }
                    else {
                        var moveTo = cc.moveTo(duration, cc.v2((i - Math.floor(cards.length / 2)) * offset * endscale - this.out_node.x - card.width / 2 * endscale + offset * endscale / 2, this.out_node.height));
                    }
                    var scaleTo = cc.scaleTo(duration, endscale, endscale);
                    var act = cc.spawn(moveTo, scaleTo);
                    card.runAction(act);
                    //card.runAction(scaleTo);
                }
            }
            this.refreshHandCards(0.2);

            for (var i = 0; i < this.hand_node.childrenCount; i++) {
                if (this.hand_node.children[i].touched == 'touched') {
                    this.hand_node.children[i].touched = null;
                }
            }

            // this.clearAllSelectCards();
            // this.scheduleOnce(function () {
            //     this.refreshHandCards(0.2);
            // }.bind(this), 0.1);


            if (isLord && this.hand_node.childrenCount > 0) {
                cc.find('lord', this.hand_node.children[this.hand_node.childrenCount - 1]).active = true;
            }

            var type = ddz.analysisCards(cards).type;
            switch (type) {
                case 5://顺子
                    var tongtianshun = false;
                    cards.forEach(function (card) {
                        if (parseInt(card / 10) == 14) {
                            tongtianshun = true;
                        }
                    });
                    var posX = - this.out_node.x - card.width / 2 * endscale;
                    // if (cards.length % 2 == 1) {
                    //     posX = - this.out_node.x - card.width / 2 * endscale;
                    // }
                    // else {
                    //     posX = - this.out_node.x - card.width / 2 * endscale + offset * endscale / 2;
                    // }

                    if (tongtianshun) {
                        this.tongtianshun_node.active = true;
                        this.tongtianshun_node.x = posX + 40;
                        this.tongtianshun_node.y = this.out_node.height + 40;
                        this.tongtianshun_ani.playAnimation('TTS', 1);
                        AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.TONGTIANSHUN, false);
                    } else {
                        var node = this.shunzi_node;
                        node.getComponent(sp.Skeleton).enabled = true;
                        node.getComponent(sp.Skeleton).clearTrack(0);
                        node.getComponent(sp.Skeleton).setAnimation(0, 'shunzi', false);
                        node.x = posX;
                        node.y = this.out_node.height + 40;
                        AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.SHUNZI, false);
                    }
                    // this.scheduleOnce(function () {
                    //     var count = this.out_node.childrenCount;
                    //     var mid = this.out_node.children[Math.floor(count / 2)];
                    //     cc.find('Canvas/root').getComponent('ddz_game').playShunziAnimation(mid);
                    // }.bind(this), duration);
                    break;
                case 6://连对
                    //cc.find('liandui', this.out_node).getComponent(cc.Animation).play();
                    var posX = - this.out_node.x - card.width / 2 * endscale;
                    // if (cards.length % 2 == 1) {
                    //     posX = - this.out_node.x - card.width / 2 * endscale;
                    // }
                    // else {
                    //     posX = - this.out_node.x - card.width / 2 * endscale + offset * endscale / 2;
                    // }
                    //cc.find('Canvas/root').getComponent('ddz_game').playLianduiAnimation(this.out_node, cc.v2(posX, this.out_node.height));

                    var node = this.liandui_node;
                    node.getComponent(sp.Skeleton).enabled = true;
                    node.getComponent(sp.Skeleton).clearTrack(0);
                    node.getComponent(sp.Skeleton).setAnimation(0, 'liandui', false);
                    node.x = posX + 50;
                    node.y = this.out_node.height + 40;
                    AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.SHUNZI, false);
                    // this.scheduleOnce(function () {
                    //     var count = this.out_node.childrenCount;
                    //     var mid = this.out_node.children[Math.floor(count / 2)];
                    //     cc.find('Canvas/root').getComponent('ddz_game').playLianduiAnimation(mid);
                    //     //cc.find('shunzi', this.out_node).getComponent(cc.Animation).play();
                    // }.bind(this), duration);
                    break;
                case 7://飞机不带
                case 8://飞机
                    cc.find('Canvas/root').getComponent('ddz_replay').playAirplaneAnimation();
                    break;
                case 10://炸弹
                    cc.find('Canvas/root').getComponent('ddz_replay').playBombAnimation('zhu');
                    break;
                case 11://火箭
                    cc.find('Canvas/root').getComponent('ddz_replay').playRocketAnimation('1');
                    break;
                default:
                    break;
            }
        }
    },
    displayOutCard: function (cardlist, isLord) {
        this.clearOutCard();
        if (cardlist == null) {
            cc.find('op', this.node).active = false;
            return;
        }
        var endscale = 0.7;
        if (cardlist.length == 0) {
            cc.find('op', this.node).active = true;
        }
        else {
            cc.find('op', this.node).active = false;
            var cards = ddz.sortOutCards(cardlist);
            for (var i = 0; i < cards.length; i++) {
                var card = cc.instantiate(this.paiPre);
                var offset = (this.hand_node.width + paiBorder - cardWidth) / (17 - 1);
                this.setPoker(card, cards[i]);
                if (isLord) {
                    cc.find('lord', card).active = true;
                }
                this.out_node.addChild(card);
                card.setSiblingIndex(i);
                card.scaleX = endscale;
                card.scaleY = endscale;
                if (cards.length % 2 == 1) {
                    card.x = (i - Math.floor(cards.length / 2)) * offset * endscale - this.out_node.x - card.width / 2 * endscale;
                }
                else {
                    card.x = (i - Math.floor(cards.length / 2)) * offset * endscale - this.out_node.x - card.width / 2 * endscale + offset * endscale / 2;
                }
                card.y = this.out_node.height;
            }
        }
    },

    //获取手牌数量
    getHandCardNum: function () {
        return this.remainCard;
    },

    /**
     * 显示倍率
     */
    showBeilv: function (data) {
        if (data && data.total != null) {
            cc.find('dipai_info/beilv/layout/num', this.node.parent).getComponent(cc.Label).string = 'x' + data.total.toString() + '倍';
        }
        else {
            cc.find('dipai_info/beilv/layout/num', this.node.parent).getComponent(cc.Label).string = '';
        }
    },


    /**
    * 选定牌
    */
    setChooseCards: function (cards) {
        for (var i = 0; i < this.hand_node.childrenCount; i++) {
            if (cards.indexOf(parseInt(this.hand_node.children[i].name)) != -1) {
                if (this.hand_node.children[i].touched != 'touched') {
                    this.selectCard(i);
                }
            }
            else {
                if (this.hand_node.children[i].touched == 'touched') {
                    this.selectCard(i);
                }
            }
        }
    },

    /**
     * 选择单张牌 在提起和放下状态之间切换
     */
    selectCard: function (index) {
        var duration = 0.1; //动画时长
        if (this.hand_node.childrenCount > index) {
            if (this.hand_node.children[index].touched == 'touched') {
                var down = cc.moveTo(duration, cc.v2(this.hand_node.children[index].x, 0));
                this.hand_node.children[index].stopAllActions();
                this.hand_node.children[index].runAction(down);
                this.hand_node.children[index].touched = null;
            }
            else {
                var up = cc.moveTo(duration, cc.v2(this.hand_node.children[index].x, selectHeight));
                this.hand_node.children[index].stopAllActions();
                this.hand_node.children[index].runAction(up);
                this.hand_node.children[index].touched = 'touched';
            }
            AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.CHOUPAI, false);
            this.onSelectCardChanged();
        }
    },

    //touchMove时候 多选牌
    selectLine: function (start, end) {
        if (start > end) {
            for (var i = 0; i < this.hand_node.childrenCount; i++) {
                if (i >= end && i <= start) {
                    if (!this.touchList[i]) {
                        this.selectCard(i);
                        this.touchList[i] = 1;
                    }
                }
                else {
                    if (this.touchList[i]) {
                        this.selectCard(i);
                        this.touchList[i] = 0;
                    }
                }
            }
        }
        else if (start < end) {
            for (var i = 0; i < this.hand_node.childrenCount; i++) {
                if (i >= start && i <= end) {
                    if (!this.touchList[i]) {
                        this.selectCard(i);
                        this.touchList[i] = 1;
                    }
                }
                else {
                    if (this.touchList[i]) {
                        this.selectCard(i);
                        this.touchList[i] = 0;
                    }
                }
            }
        }
        else {
            for (var i = 0; i < this.hand_node.childrenCount; i++) {
                if (i != start) {
                    if (this.touchList[i]) {
                        this.selectCard(i);
                        this.touchList[i] = 0;
                    }
                }
            }
        }
    },

    //选牌变化
    onSelectCardChanged: function () {
        var selectCards = [];
        for (var i = 0; i < this.hand_node.childrenCount; i++) {
            if (this.hand_node.children[i].touched == 'touched') {
                selectCards.push(parseInt(this.hand_node.children[i].name));
            }
        }
        //换三张
        if (selectCards.length == 3) {
            cc.find('op_huansanzhang/send', this.node).getComponent(cc.Button).interactable = true;
        }
        else {
            cc.find('op_huansanzhang/send', this.node).getComponent(cc.Button).interactable = false;
        }
        //出牌
        var forbid = !DDZ_Data.Instance().deskInfo.deskRule.canDaiExtra2;
        if (ddz.compareCards(DDZ_Data.Instance().lastCards, selectCards, forbid)) {
            cc.find('op_chupai/send', this.node).getComponent(cc.Button).interactable = true;
        }
        else {
            cc.find('op_chupai/send', this.node).getComponent(cc.Button).interactable = false;
        }
    },

    //清空当前touch列表
    clearTouchList: function () {
        this.touchList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.touch_start_node = null;
    },

    //重置所有提出的手牌
    clearAllSelectCards: function () {
        for (var i = 0; i < this.hand_node.childrenCount; i++) {
            if (this.hand_node.children[i].touched == 'touched') {
                this.selectCard(i);
            }
        }
    },

    //清除出牌
    clearOutCard: function () {
        for (var i = this.out_node.childrenCount - 1; i > -1; i--) {
            var node = this.out_node.children[i];
            if (node.name == 'top_card_ani1') {
                node.active = false;
            }
            else if (node.name == 'top_card_ani2') {
                node.active = false;
            }
            else if (node.name == 'top_card1') {
                node.getComponent(sp.Skeleton).enabled = false;
            }
            else if (node.name == 'shunzi_ani') {
                node.getComponent(sp.Skeleton).enabled = false;
            }
            else if (node.name == 'liandui_ani') {
                node.getComponent(sp.Skeleton).enabled = false;
            }
            else if (node.getChildByName('touch') != null) {
                node.removeFromParent();
                node.destroy();
            }
            else if (node.name == 'tongtianshun_ani') {
                node.active = false;
            }
            else {
                node.destroy();
            }
        }
    },

    //touch事件是否在牌上
    getTouchCard: function (event) {
        for (var i = this.hand_node.childrenCount - 1; i > -1; i--) {
            if (this.isTouch(event, cc.find('touch', this.hand_node.children[i]))) {
                return i;
            }
        }
        return null;
    },
    isTouch: function (event, node) {
        if (node.getBoundingBoxToWorld().contains(event.touch.getLocation())) {
            return true;
        }
        return false;
    },


    //重置UI
    resetUI: function () {
        // this.showNoCard(false);
        // this.clearOutCard();
        // this.clearHandCards();
        // cc.find('Canvas/root/dipai_info').active = false;
        // this.showBeilv();
        // cc.find('op', this.node).active = false;
        // cc.find('jiabei', this.headnode).active = false;
        // cc.find('lord', this.headnode).active = false;
    },

    //设置底牌
    setDipai: function (prefab, cardValue) {
        this.node.parent.getComponent('ddz_replay').setDipai(prefab, cardValue);
    },

    //设置牌值
    setPoker: function (prefab, cardValue) {
        this.node.parent.getComponent('ddz_replay').setPoker(prefab, cardValue);
    },

    ///////////////////////////////////////////// 按钮点击 start //////////////////////////////////////////
    //双击背景
    bgClick: function (event, data) {
        // var time = new Date().getTime();
        // if (this.lastBgClickTime && time - this.lastBgClickTime < 500) {
        //     this.lastBgClickTime = null;
        //     this.clearAllSelectCards();
        // }
        // else {
        //     this.lastBgClickTime = time;
        // }
        this.clearAllSelectCards();
        DDZ_ED.notifyEvent(DDZ_Event.BG_CLICK, null);
    },

    //叫分
    onCallScore: function (event, data) {
        var score = parseInt(data);
        ddz_send_msg.callScore(score);
    },

    onCallDouble: function (event, data) {
        if (data == 'true') {
            ddz_send_msg.callDouble(true);
        }
        else {
            ddz_send_msg.callDouble(false);
        }
    },

    //不出
    onPass: function (event, data) {
        var cards = [];
        ddz_send_msg.sendCards(cards);
    },

    //提示
    onTips: function (event, data) {
        if (!ddz.calCards(DDZ_Data.Instance().lastCards, this._handCards)) {//不出
            ddz_send_msg.sendCards([]);
            return;
        }
        if (this.tipIndex == null || this.tipIndex == -1) {
            this.tipArray = ddz.calCards(DDZ_Data.Instance().lastCards, this._handCards);
            this.tipIndex = 0;
            this.setChooseCards(this.tipArray[0]);
        }
        else {
            this.tipIndex = this.tipIndex + 1 >= this.tipArray.length ? 0 : this.tipIndex + 1;
            this.setChooseCards(this.tipArray[this.tipIndex]);
        }
    },

    //出牌
    onSendCard: function (event, data) {
        var selectCards = [];
        for (var i = 0; i < this.hand_node.childrenCount; i++) {
            if (this.hand_node.children[i].touched == 'touched') {
                selectCards.push(parseInt(this.hand_node.children[i].name));
            }
        }
        if (ddz.analysisCards(selectCards).type) {
            ddz_send_msg.sendCards(selectCards);
        }
    },

    //换牌
    onChangeCard: function (event, data) {
        var selectCards = [];
        for (var i = 0; i < this.hand_node.childrenCount; i++) {
            if (this.hand_node.children[i].touched == 'touched') {
                selectCards.push(parseInt(this.hand_node.children[i].name));
            }
        }
        if (selectCards.length == 3) {
            const req = new cc.pb.doudizhu.ddz_change_poker_req();
            req.setPokersList(selectCards);
            cc.gateNet.Instance().sendMsg(cc.netCmd.doudizhu.cmd_ddz_change_poker_req, req,
                'ddz_change_poker_req', 'no');
        }
    },

    //取消托管
    onCancelAuto: function (event, data) {
        ddz_send_msg.tuoGuan(false);
    },

    //倍率提示
    onBeiLvTip: function (event, data) {
        var detail_node = cc.find('beilv/detail', this.node);
        if (detail_node.active) {
            detail_node.active = false;
        }
        else {
            detail_node.active = true;
        }
    },
    ///////////////////////////////////////////// 按钮点击 end //////////////////////////////////////////
});
