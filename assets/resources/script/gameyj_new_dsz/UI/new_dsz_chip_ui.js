// create by wj 2019/04/02
var deskData = require('teenpatti_desk').Teenpatti_Desk_Data.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_oChipPrefab: cc.Prefab,
        chip_list: [], //游戏中玩家下注的筹码实列
        chipType_list: [], //筹码规格类型
        costChipData_list: [], //本轮需要消耗的筹码数据
        chipAltas: cc.SpriteAtlas,
        m_tChipStartPos: [],
        m_tColor_list: [], //颜色数值
    },

    onLoad:function () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.createChipPool();
        this.m_tColor_list.push(
            {color: cc.color(42, 193, 165)},
            {color: cc.color(46, 168, 236)},
            {color: cc.color(221, 49, 138)},
            {color: cc.color(120, 62, 234)},
            {color: cc.color(158, 131, 2)},
            {color: cc.color(217, 97, 27)},
        );
    },

    initChip: function(){
        //设置筹码起始点
        var playercount = deskData.getPlayerCount();
        for(var i = 0; i < playercount; i ++){
            this.m_tChipStartPos[i] = cc.dd.Utils.seekNodeByName(this.node, "chipNode" + i);
        }

        this.m_oEndNode = cc.dd.Utils.seekNodeByName(this.node, 'chipNodeEnd');
            
        //筹码分段数据配置
        var self = this;
        var configData = deskData.getConfigData();
        if(configData){
            var list = configData.coin_type.split(';');
            list.forEach(function(data) {
                var info = data.split(',');
                self.chipType_list.push(info[1]);
            });
        }
    },

    //创建筹码池
    createChipPool: function() {
        this.chipPool = new cc.NodePool();
        var initCount = 100;
        for (var i = 0; i < initCount; i++) {
            var chip = cc.instantiate(this.m_oChipPrefab);
            this.chipPool.put(chip);
        }
    },

    //创建筹码
    createChip: function () {
        var chip = null;
        if (this.chipPool.size() > 0) {
            chip = this.chipPool.get();
        } else {
            chip = cc.instantiate(this.m_oChipPrefab);
        }
        return chip;
    },

    //下注动画
    bet: function(pos, num, isAct){
        this.getChipType(num);
        var self = this;
        var totalChip = 0;
        for (var n = 0; n < this.costChipData_list.length; n++) {
            var item = this.costChipData_list[n];
            for (var i = 0; i < item.cnt; i++) {
                totalChip++;
                var chipNode = self.createChip();
                chipNode.scale = 1.2;
                chipNode.active = true;
                var chipNumNode = cc.dd.Utils.seekNodeByName(chipNode,'bet');
                var numStr = cc.dd.Utils.getNumToWordTransform(parseInt(item.type));
                // var numcpt = chipNumNode.getComponent(cc.LabelOutline);
                // numcpt.color = item.color;
                chipNumNode.getComponent(cc.Label).string = numStr;
                //chipNumNode.setRotation(rotation);
                self.chip_list.push(chipNode);
                chipNode.parent = this.node;
                var x = this.m_oEndNode.getPosition().x;
                var y = this.m_oEndNode.getPosition().y;
                if (isAct) {
                    var startPt_x = this.m_tChipStartPos[pos].x;
                    var startPt_y = this.m_tChipStartPos[pos].y;

                    chipNode.setPosition(cc.v2(startPt_x, startPt_y));
                    var moveTo = cc.moveTo(0.24, cc.v2(x, y));
                    chipNode.runAction(cc.sequence(moveTo, cc.callFunc(function () {
                        self.chip_list.forEach(function(node){
                            node.active = false;
                        })
                    })));

                    // if (totalChip < 2) {
                    //     tdk_am.playEffect(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_BET);
                    // } else {
                    //     tdk_am.playEffect(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_CHIP_END);
                    // }
                } else {
                    chipNode.setPosition(cc.v2(x, y));
                    self.chip_list.forEach(function(node){
                        node.active = false;
                    })
                }
            }
        }

    },

    //获取筹码规格
    getChipType: function(num){
        this.costChipData_list.splice(0, this.costChipData_list.length);
        this.costChipData_list = [];
        var tmp_num = num;
        for (var i = this.chipType_list.length -1; i >= 0; i--) {
            var spec = parseInt(this.chipType_list[i]);
            var mul = Math.floor(tmp_num / spec);
            if (mul > 0) {
                this.costChipData_list.push({ type: spec, cnt: mul, index: i + 1, color: this.chipType_list[i].color });
                tmp_num = tmp_num % spec;
                if (tmp_num == 0) {
                    break;
                }
            }
        }
    },

    //结算动画
    result: function(pos){
        var self = this;
        self.chip_list.forEach(function(chipNode){
            var endPt = self.m_tChipStartPos[pos].getPosition();
            var moveTo = cc.moveTo(0.3, endPt);
            var scaleTo = cc.scaleTo(0.3, 0);
            chipNode.stopAllActions();            

            var seq = cc.sequence(cc.spawn(moveTo, scaleTo),cc.delayTime(2),cc.callFunc(function(){
                    chipNode.active = false;
            }));
            chipNode.runAction(seq);

        })
    },

    //清理桌面
    clear: function(){
        this.chip_list.forEach(function(chipNode){
            chipNode.active = false;
        })
        this.chip_list.splice(0, this.chip_list.length);
    },

    //转换筹码字
    convertChipNum: function(num){
        var str = num;
        if(num >= 1000 && num < 10000){
            var num_0 = (num / 1000).toFixed(1) * 10;
            if(num_0 % 10 != 0)
                str =  (num / 1000).toFixed(1) + '千';
            else
                str = Math.ceil(num / 1000) + '千';
        }else if(num >= 10000 && num < 100000000){
            var num_0 = (num / 10000).toFixed(1) * 10;
            if(num_0 % 10 != 0)
                str =  (num / 10000).toFixed(1) + '万';
            else
                str = Math.ceil(num / 10000) + '万';
        }else if(num >= 100000000){
            var num_0 = (num / 100000000).toFixed(1) * 10;
            if(num_0 % 10 != 0)
                str =  (num / 100000000).toFixed(1) + '亿';
            else
                str = Math.ceil(num / 100000000) + '亿';
        }
        return str 
    },
});
