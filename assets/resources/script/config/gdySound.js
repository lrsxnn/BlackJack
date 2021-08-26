var data_gdySound =
{
    items:
        [
            { key: 1, type: 1, value: 3, soundName: "S_3" },
            { key: 2, type: 1, value: 4, soundName: "S_4" },
            { key: 3, type: 1, value: 5, soundName: "S_5" },
            { key: 4, type: 1, value: 6, soundName: "S_6" },
            { key: 5, type: 1, value: 7, soundName: "S_7" },
            { key: 6, type: 1, value: 8, soundName: "S_8" },
            { key: 7, type: 1, value: 9, soundName: "S_9" },
            { key: 8, type: 1, value: 10, soundName: "S_10" },
            { key: 9, type: 1, value: 11, soundName: "S_11" },
            { key: 10, type: 1, value: 12, soundName: "S_12" },
            { key: 11, type: 1, value: 13, soundName: "S_13" },
            { key: 12, type: 1, value: 14, soundName: "S_1" },
            { key: 13, type: 1, value: 16, soundName: "S_2" },
            { key: 14, type: 2, value: 3, soundName: "D_3" },
            { key: 15, type: 2, value: 4, soundName: "D_4" },
            { key: 16, type: 2, value: 5, soundName: "D_5" },
            { key: 17, type: 2, value: 6, soundName: "D_6" },
            { key: 18, type: 2, value: 7, soundName: "D_7" },
            { key: 19, type: 2, value: 8, soundName: "D_8" },
            { key: 20, type: 2, value: 9, soundName: "D_9" },
            { key: 21, type: 2, value: 10, soundName: "D_10" },
            { key: 22, type: 2, value: 11, soundName: "D_11" },
            { key: 23, type: 2, value: 12, soundName: "D_12" },
            { key: 24, type: 2, value: 13, soundName: "D_13" },
            { key: 25, type: 2, value: 14, soundName: "D_1" },
            { key: 26, type: 2, value: 16, soundName: "D_2" },
            { key: 27, type: 3, value: 0, soundName: "SL" },
            { key: 28, type: 4, value: 0, soundName: "DL" },
            { key: 29, type: 5, value: 0, soundName: "bomb-0" },
            { key: 30, type: 6, value: 0, soundName: "KILL1" },
            { key: 31, type: 7, value: 0, soundName: "KILL2" },
            { key: 32, type: 8, value: 0, soundName: "PASS0" },
            { key: 33, type: 9, value: 0, soundName: "PASS1" },
            { key: 34, type: 10, value: 0, soundName: "PASS2" },
            { key: 35, type: 11, value: 0, soundName: "PASS3" }
        ],

    /**
     * 查找第一个符合filter的item
     * @param filter
     * @returns {*}
     */
    getItem: function (filter) {
        var result = null;
        for (var i = 0; i < this.items.length; ++i) {
            if (filter(this.items[i])) {
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
    getItemList: function (filter) {
        var list = [];
        this.items.forEach(function (item) {
            if (filter(item)) {
                list.push(item);
            }
        });
        return list;
    },
};

module.exports = data_gdySound;