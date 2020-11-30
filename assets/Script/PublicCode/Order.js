
let PublicSetUp = require('PublicSetUp');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.Mask = cc.find("Mask", this.node);
        this.View = cc.find("View", this.node);

        this.btn_ok = cc.find("View/btn_ok", this.node);
        this.btn_ok.on(cc.Node.EventType.TOUCH_END, this.onTouchend, this);
        this.btn_close = cc.find("View/btn_close", this.node);
        this.btn_close.on(cc.Node.EventType.TOUCH_END, this.onTouchend, this);

        this.etxt_public = cc.find("View/box_public", this.node).getComponent(cc.EditBox);
        // this.etxt_hand = cc.find("View/box_hand", this.node).getComponent(cc.EditBox);
        this.txt_title = cc.find("View/txt_title", this.node).getComponent(cc.Label);
    },

    start() {
        this.initState();
    },

    open() {
        if (PublicSetUp.isLog) console.log("OPEN ORDER");

        PublicSetUp.OrderPublic = [];
        // PublicSetUp.OrderHand = "";

        this.Mask.active = true;
        this.View.active = true;
    },

    initState() {
        this.etxt_public.string = "";
        // this.etxt_hand.string = "";
        this.txt_title.string = "牌組測試";

        this.Mask.active = false;
        this.View.active = false;
    },

    onTouchend(e) {
        switch (e.target.name) {
            case "btn_ok":
                this.chkOrder(this.etxt_public.string);
                break;
            case "btn_close":
                this.initState();
                break;
        }
    },

    chkOrder(str) {
        let _arr = str.split(",");
        let _storage = [];
        let _error = false;
        let _same = 0;

        //判斷指定牌型輸入是否錯誤
        //輸入字串數量錯誤
        if (_arr.length != 5) {
            this.txt_title.string = "請輸入五組數字";
            return;
        }
        //檢查輸入字串
        for (let i = 0; i < _arr.length; i++) {
            //字串轉數字
            let _e = parseInt(_arr[i]);
            //小於最小值 | 大於最大值 | 為空值 皆判斷為輸入錯誤
            if (_e < 1 || _e > 45 || isNaN(_e)) {
                this.txt_title.string = "輸入錯誤";
                _error = true;
                break;
            }
            //判斷輸入數值是否有重複
            // if (_storage.length > 0) {
            //     for (let j = 0; j < _storage.length; j++) {
            //         if (_e == _storage[j]) {
            //             _same += 1;
            //             cc.log("_same = ", _same);
            //             if (_same > 5) {
            //                 this.txt_title.string = "數量錯誤";
            //                 _error = true;
            //                 break;
            //             }
            //         }
            //     }
            // }

            if (_error) break;
            //正確了才塞入陣列
            _storage.push(_e);
        }

        let result = {};
        //計算相同卡片數量
        _storage.forEach(function (item) {
            result[item] = result[item] ? result[item] + 1 : 1;
        });
        cc.log(result);

        Object.keys(result).forEach(element => {
            if (result[element] > 4) {
                this.txt_title.string = "數量錯誤";
                _error = true;
            }
        });

        if (_error) return;

        PublicSetUp.OrderPublic = _storage;

        this.txt_title.string = "牌組檢測正確";
        cc.log("PublicSetUp.OrderPublic = ", PublicSetUp.OrderPublic);
    },

    // update (dt) {},
});
