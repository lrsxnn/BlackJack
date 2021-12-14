// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require("com_card"),

    properties: {
        isActive: true,
    },

    editor:{
        menu:"BlackJack/blackjack_card"
    },

    setHide(){
        this.node.active = false;
        this.isActive = false;
    },

    setShow(){
        this.node.active = true;
        this.isActive = true;
    },
});
