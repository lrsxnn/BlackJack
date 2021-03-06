var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        title_text: require("LanguageLabel"),
        content_text: require("LanguageLabel"),
        ok_text: require("LanguageLabel"),
        cancel_text: require("LanguageLabel"),

        inputText: cc.EditBox,

        ok_btn: cc.Node,
        cancel_btn: cc.Node,

        ok_func: null,
        cancel_func: null,
    },

    // use this for initialization
    onLoad: function () {

    },

    clickOk: function () {
        hall_audio_mgr.com_btn_click();
        this.close();
        if (this.ok_func) {
            this.ok_func(this.inputText.string);
        }
    },

    clickCancel: function () {
        hall_audio_mgr.com_btn_click();
        this.close();
        if (this.cancel_func) {
            this.cancel_func(this.inputText.string);
        }
    },

    close: function () {
        this.isWaitGameEnd = false;
        this.waitCB = null;
        cc.dd.UIMgr.closeUI(this.node);
        cc.find('mask', this.node).off('click', this.close, this);
    },

    setMaskClick: function () {
        cc.find('mask', this.node).on('click', this.close, this);
    },

    setButtonInteractable(type) {
        // switch (type) {
        //     case 0:
        //         this.cancel_btn.getComponent(cc.Button).interactable = false;
        //         this.cancel_text.node.color = cc.color(168, 168, 168);
        //         break;
        //     case 1:
        //         this.ok_btn.getComponent(cc.Button).interactable = false;
        //         this.ok_text.node.color = cc.color(168, 168, 168);
        //         break;
        // }
    },

    resetUI() {
        // this.cancel_btn.getComponent(cc.Button).interactable = true;
        this.ok_btn.getComponent(cc.Button).interactable = true;
        // this.cancel_text.node.color = cc.color(255, 255, 255);
        this.ok_text.node.color = cc.color(255, 255, 255);
        this.inputText.string = ''
    },
});
