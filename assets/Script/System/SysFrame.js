let PublicSetUp = require('PublicSetUp');
let Enum = require('Enum');
let Message;
let Feedback;
let Socket;
let Rule;

let obj_Sys = {};

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        obj_Sys.self = this;

        Message = cc.find("Canvas/Message").getComponent("message");
        Feedback = cc.find("Canvas/Feedback").getComponent("Feedback");
        Socket = cc.find("Socketcommon").getComponent("socket");
        Rule = cc.find("Canvas/Rule").getComponent("Rule");

        this.View = cc.find("View", this.node);
        this.btn_Close = cc.find("View/btns/btn_Close", this.node);
        this.btn_Close.on('touchend', this.onTouchend, this);
        this.btn_Rule = cc.find("View/btns/btn_Rule", this.node);
        this.btn_Rule.on('touchend', this.onTouchend, this);
        this.btn_History = cc.find("View/btns/btn_History", this.node);
        this.btn_History.on('touchend', this.onTouchend, this);
        this.btn_FeedBack = cc.find("View/btns/btn_FeedBack", this.node);
        this.btn_FeedBack.on('touchend', this.onTouchend, this);
        this.btn_Leave = cc.find("View/btns/btn_Leave", this.node);
        this.btn_Leave.on('touchend', this.onTouchend, this);

        //語系轉換 - 文字
        obj_Sys.txt_History = cc.find("View/btns/btn_History/txt_Title", this.node).getComponent(cc.Label);
        obj_Sys.txt_Rule = cc.find("View/btns/btn_Rule/txt_Title", this.node).getComponent(cc.Label);
        obj_Sys.txt_FeedBack = cc.find("View/btns/btn_FeedBack/txt_Title", this.node).getComponent(cc.Label);
        obj_Sys.txt_BGM = cc.find("View/MusicBar/txt_Title", this.node).getComponent(cc.Label);
        obj_Sys.txt_SE = cc.find("View/EffectBar/txt_Title", this.node).getComponent(cc.Label);
        if (cc.director.getScene().name == "GameFight") {
            obj_Sys.txt_BackLobby = cc.find("View/btns/btn_Leave/txt_Title", this.node).getComponent(cc.Label);
        }

        this.LanguageChange(PublicSetUp.Language);
    },

    start() {
        this.View.active = false;
    },

    open() {
        this.View.active = true;
    },

    onTouchend(e) {
        //cc.audioEngine.playEffect(PublicSetUp.aio_click, false);
        switch (e.target.name) {
            case "btn_Close":
                this.View.active = false;
                break;
            case "btn_Rule":
                Rule.open();
                break;
            case "btn_History":
                this.send_GetHistoryRecord();
                break;
            case "btn_FeedBack":
                Feedback.open();
                break;
            case "btn_Leave":
                this.send_ReturnLobby();
                break;
        }
    },

    // update (dt) {},

    send_ReturnLobby() {

        if (PublicSetUp.isGameFinish) {
            cc.director.loadScene("Lobby");
            PublicSetUp.isGameFinish = false;
        } else {
            var config = {};
            config.Cmd = "ReturnLobby";
            config.Data = {};

            console.log("send_ReturnLobby: ", JSON.stringify(config));
            Socket.WebonSend(JSON.stringify(config));
            // Message.showmessage(PublicSetUp.public_msg[_LC].EXITLATER, 2);

            PublicSetUp.isSendReLobby = true;
        }
        this.start();
    },

    send_GetHistoryRecord() {
        var config = {};
        config.Cmd = "GetHistoryRecord";
        config.Data = {};

        console.log("send_GetHistoryRecord: ", JSON.stringify(config));
        Socket.WebonSend(JSON.stringify(config));
    },

    LanguageChange(e) {
        //換文字
        obj_Sys.txt_History.string = Enum.Message.HISTORY;
        obj_Sys.txt_Rule.string = Enum.Message.RULE;
        obj_Sys.txt_FeedBack.string = Enum.Message.FEEDBACK;
        obj_Sys.txt_BGM.string = Enum.Message.BGM;
        obj_Sys.txt_SE.string = Enum.Message.SE;

        if (cc.director.getScene().name == "GameFight") {
            obj_Sys.txt_BackLobby.string = Enum.Message.RELOBBY;
        }
    },
});
