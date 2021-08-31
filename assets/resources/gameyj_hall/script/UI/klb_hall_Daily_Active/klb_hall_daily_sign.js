// create by wj 2018/08/25
const Hall = require('jlmj_halldata');
var hall_audio_mgr = require('hall_audio_mgr').Instance();


let sign = cc.Class({
    extends: cc.Component,

    properties: {
        today: 0,
        isget: false,
        alreadyBtnSp: cc.SpriteFrame,
        getBtnSp: cc.SpriteFrame,
        m_oCloseBtn: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad: function () {
        this.init(Hall.HallData.Instance().sign_data);
    },

    showClsoeBtn: function (isShow, func) {
        this.m_oCloseBtn.active = isShow;
        this.func = func;
    },

    init: function (data) {
        //this.goldParticleSystem.active = false;
        var self = this;
        if (data) {
            data.rewardListList.forEach(item => {

                var day_node = cc.find('bg/day' + item.index.toString(), this.node);
                var score = cc.find('hd-qiandao-xia/num', day_node).getComponent(cc.Label);
                score.string = item.num.toString();
                if (item.state == 0) {//可领取
                    //var button = day_node.getComponent(cc.Button);
                    //button.interactable = true;
                    // cc.find('title', day_node).color = cc.color(255, 225, 48);
                    var get = cc.find('get', day_node);
                    get.active = true;
                    self.today = item.index;
                    self.isget = false;
                    var btn = cc.find('bg/btn', this.node);
                    btn.getComponent(cc.Button).interactable = true;
                    btn.getComponent(cc.Sprite).spriteFrame = this.getBtnSp;

                } else if (item.state == 2) {//已领取
                    cc.find('cover', day_node).active = true;
                    cc.find('cover/duihao', day_node).active = true;
                    self.isget = true;
                    var btn = cc.find('bg/btn', this.node);
                    btn.getComponent(cc.Button).interactable = false;
                    btn.getComponent(cc.Sprite).spriteFrame = this.alreadyBtnSp;
                }
            });
        }
    },

    //发送领取
    sign: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var index = this.today;
        if (this.isget == true) {
            cc.dd.PromptBoxUtil.show('今日已签到已领取,不可重复领取!');
            return;
        }
        var day_node = cc.find('bg/day' + index.toString(), this.node);
        var click = cc.find('click', day_node);
        click.active = true;

        // var seq = cc.sequence(cc.delayTime(0.8), cc.callFunc(function () {
        //     var msg = new cc.pb.hall.draw_seven_day_reward_req();
        //     msg.setIndex(index);
        //     cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_draw_seven_day_reward_req, msg, "发送签到: index=" + index, true);
        //     cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'draw_seven_day_reward_req');

        // }));
        // this.node.runAction(seq);
        cc.tween(this.node)
            .delay(0.8)
            .call(function () {
                var msg = new cc.pb.hall.draw_seven_day_reward_req();
                msg.setIndex(index);
                cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_draw_seven_day_reward_req, msg, "发送签到: index=" + index, true);
                cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'draw_seven_day_reward_req');

            })
            .start();
    },

    //领取成功
    done: function (index) {
        // if(this.goldParticleSystem)
        //     this.goldParticleSystem.active = true;
        this.isget = true;
        var btn = cc.find('bg/btn', this.node);
        btn.getComponent(cc.Button).interactable = false;
        btn.getComponent(cc.Sprite).spriteFrame = this.alreadyBtnSp;

        var day_node = cc.find('bg/day' + index.toString(), this.node);

        // cc.find('title', day_node).color = cc.color(255, 255, 255);
        var get = cc.find('click', day_node);
        get.active = false;

        var get = cc.find('get', day_node);
        get.active = false;

        cc.find('cover', day_node).active = true;


        // var seq = cc.sequence(cc.delayTime(0.4), cc.callFunc(function () {
        //     var duihao = cc.find('duihao', day_node);
        //     duihao.active = true;
        // }));
        // this.node.runAction(seq);
        cc.tween(this.node)
            .delay(0.4)
            .call(function () {
                var duihao = cc.find('duihao', day_node);
                duihao.active = true;
            })
            .start();
        Hall.HallData.Instance().isSigned = true;
    },

    onClickClose: function (event, data) {
        hall_audio_mgr.com_btn_click();
        if (this.func) {
            this.func();
        }
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
module.exports = sign;
