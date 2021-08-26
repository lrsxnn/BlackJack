var jlmj_desk_jbc_data = require("jlmj_desk_jbc_data");
var instance = null;

var TDHMJDeskDataJBC = cc.Class({
    extends: jlmj_desk_jbc_data,

    statics: {
        /**
         * 获取实例
         */
        getInstance: function() {
            if( cc.dd.Utils.isNull( instance ) ) {
                instance = new TDHMJDeskDataJBC();
            }
            return instance;
        },
    },

    clear:function () {

    },
});

module.exports = TDHMJDeskDataJBC;
