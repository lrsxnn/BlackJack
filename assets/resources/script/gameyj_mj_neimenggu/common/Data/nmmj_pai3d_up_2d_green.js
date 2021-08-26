var pai3d_up = cc.Class({

    s_pai3d_cfg: null,

    statics: {

        Instance: function () {
            if(!this.s_pai3d_cfg){
                this.s_pai3d_cfg = new pai3d_up();
            }
            return this.s_pai3d_cfg;
        },

        Destroy: function () {
            if(this.s_pai3d_cfg){
                this.s_pai3d_cfg = null;
            }
        },

    },

    ctor: function () {
        //摸牌
        this.mopai = {
            offsetX:-20,
            offsetY:0,
        };
        //摆牌间隔
        this.baipai_space = {
            x:-5,
            y:0,
        };
        //开牌
        this.kaipai = {
            offsetX:-20,
            offsetY:0,
        };
        var pai_cfg = require('nmmj_pai_cfg_up_2d_green');
        this.shoupai_zhanli_cfg = pai_cfg.shoupai_zhanli_cfg;
        this.shoupai_daopai_cfg = pai_cfg.shoupai_daopai_cfg;
        this.shoupai_kaipai_cfg = pai_cfg.shoupai_kaipai_cfg;
        this.dapai_cfg = pai_cfg.dapai_cfg;
        this.baipai_open_down_cfg = pai_cfg.baipai_open_down_cfg;
        this.baipai_open_up_cfg = pai_cfg.baipai_open_up_cfg;
        this.baipai_close_down_cfg = pai_cfg.baipai_close_down_cfg;
        this.baipai_close_up_cfg = pai_cfg.baipai_close_up_cfg;
        this.dapai_cfg_2 = pai_cfg.dapai_cfg_2;
        this.dapai_cfg_3 = pai_cfg.dapai_cfg_3;
        this.huapai_cfg = pai_cfg.huapai_cfg;

    },

});

module.exports = pai3d_up;