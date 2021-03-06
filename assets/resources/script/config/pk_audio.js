var data_pk_audio =
{
    items:
    [
      { key:1026001,desc:"开始语音：开始下注",audio_name:"PK_begin.mp3" },
      { key:1026002,desc:"BGM",audio_name:"PK_bg.mp3" },
      { key:1026003,desc:"撤注按钮",audio_name:"PK_chezhu.mp3" },
      { key:1026004,desc:"结果语音：大王",audio_name:"PK_dawang.mp3" },
      { key:1026005,desc:"切换倍率按钮",audio_name:"PK_difen.mp3" },
      { key:1026006,desc:"结果语音：方块",audio_name:"PK_fangkuai.mp3" },
      { key:1026007,desc:"结果语音：黑桃",audio_name:"PK_heitao.mp3" },
      { key:1026008,desc:"结果语音：红桃",audio_name:"PK_hongtao.mp3" },
      { key:1026009,desc:"开奖音效",audio_name:"PK_kaijiang.mp3" },
      { key:1026010,desc:"得分音效",audio_name:"PK_Main_GetPoints.mp3" },
      { key:1026011,desc:"结果语音：梅花",audio_name:"PK_meihua.mp3" },
      { key:1026012,desc:"得到奖励音效",audio_name:"PK_reward.mp3" },
      { key:1026013,desc:"命运转盘消失",audio_name:"PK_wheel_cancel.mp3" },
      { key:1026014,desc:"命运转盘结果",audio_name:"PK_wheel_end.mp3" },
      { key:1026015,desc:"命运转盘旋转",audio_name:"PK_wheel_loop.mp3" },
      { key:1026016,desc:"命运转盘出现",audio_name:"PK_wheel_start.mp3" },
      { key:1026017,desc:"结果语音：小王",audio_name:"PK_xiaowang.mp3" },
      { key:1026018,desc:"押注按钮",audio_name:"PK_yazhu.mp3" }
    ],

    /**
     * 查找第一个符合filter的item
     * @param filter
     * @returns {*}
     */
    getItem: function(filter){
        var result = null;
        for(var i=0; i<this.items.length; ++i){
            if(filter(this.items[i])){
                result = this.items[i];
                return result;
            }
        }
        return result;
    },

    /**
     * 查找第一个符合filter的list
     * @param filter
     * @returns {*}
     */
    getItemList: function(filter){
        var list = [];
        this.items.forEach(function (item) {
            if(filter(item)){
                list.push(item);
            }
        });
        return list;
    },
};

module.exports=data_pk_audio;