var hall_prefab = require('hall_prefab_cfg');

cc.Class({
    extends: cc.Component,

    properties: {
        countTxt: cc.Label,
        icon: cc.Sprite,
        itemInfo: null,
        data: null,
        timeSp: cc.Node,
        //itemIcon:[cc.SpriteFrame],
        infoPrefab: cc.Prefab,
        clickCallBack: null,
    },

    // use this for initialization
    onLoad: function () {
        this.countTxt.enabled = false;
        this.icon.enabled = false;
    },

    init: function (itemInfo, data, callBack) {
        this.countTxt.string = data.count;
        if (data.dataId == 1004 || data.dataId == 1006 || data.dataId == 1099) {
            this.countTxt.string = (data.count / 100).toFixed(1) + '元';
        }
        if (data.leftTime != -1)
            this.timeSp.active = true;
        this.countTxt.enabled = true;
        this.icon.enabled = true;
        // var index = 0;
        // for(var i = 0; i < this.itemIcon.length; i ++){
        //     if(this.itemIcon[i].name == itemInfo.key)
        //     {
        //         index = i;
        //     }
        // }
        cc.dd.ResLoader.loadAtlas("blackjack_hall/atals/itemIcon", function (atlas) {
            var sprite = atlas.getSpriteFrame(itemInfo.key);
            this.icon.spriteFrame = sprite;
        }.bind(this));


        this.itemInfo = itemInfo;
        this.data = data;
        this.clickCallBack = callBack;
    },

    onClick: function () {
        if (this.itemInfo == null || this.data == null) {
            return;
        }
        let prefabPath = hall_prefab.KLB_HALL_ITEM_TIPS;
        cc.dd.UIMgr.openUI(prefabPath, function(prefab){
            var component = prefab.getComponent('hall_ItemTips');
            component.initUI(this.itemInfo, this.data);
        }.bind(this));
//        if(this.clickCallBack){
//            cc.log("2----------- " + this.clickCallBack);
//            this.clickCallBack(this.itemInfo, this.data)
//        }
    },

    clearInfo: function () {
        this.itemInfo = null;
        this.data = null;
        this.countTxt.enabled = false;
        this.icon.enabled = false;
    },
});
