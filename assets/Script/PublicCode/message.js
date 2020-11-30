cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.View = cc.find("View", this.node);
        this.txt_Msg = cc.find("View/txt_Msg", this.node).getComponent(cc.Label);
        this.Bie = cc.find("BIE", this.node);
    },

    start() {
        this.Dot = "";
    },

    // _delayTime預設-1 等於永久顯示不關閉 其他依照時間關閉訊息 / BIE = 是否開啟遮罩
    showmessage(_message, _delayTime = -1, _BIE = false) {

        this.Bie.active = false;
        if (_BIE) {
            this.Bie.active = true;
        }

        this.View.active = true;
        this.txt_Msg.string = _message;
        this.unscheduleAllCallbacks();
        if (_delayTime > 0) {
            this.scheduleOnce(function () {
                this.View.active = false;
            }, _delayTime);
        } else if (_delayTime == -2) {
            this.schedule(function () {
                if (this.Dot == "" || this.Dot == "...") {
                    this.Dot = ".";
                } else if (this.Dot == ".") {
                    this.Dot = "..";
                } else if (this.Dot == "..") {
                    this.Dot = "...";
                }

                this.txt_Msg.string = _message + this.Dot;
            }, 1);
        }
    },

    messageclose() {
        this.unscheduleAllCallbacks();
        this.View.active = false;
        this.Bie.active = false;
    },

    update() {

    },
});
