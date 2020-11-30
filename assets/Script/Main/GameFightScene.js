let PublicSetUp = require('PublicSetUp');
let Enum = require('Enum');
let PokerOpen = [];
let CardDeal;
let GameLogic = {};
let Players = [];
let PlayerPoker = [];

let Socket;
let System;
let Common;
let Message;
let SysMessage;
let Marquee;
let History;
let Order;
let Rule;
let PokerArea;
let testi = 0;
let InGame = false;

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //基本JS相關
        GameLogic.self = this;
        Socket = cc.find("Socketcommon").getComponent("socket");
        Common = cc.find("Socketcommon").getComponent("Common");
   

    },

    start() {
        Common.setNowScene(this);
        this.send_WaitGameGroup();
    },
    //遊戲流程----------------------------------------------------------------------
    //WaitGameGroup: 發等待配桌
    send_WaitGameGroup() {
        // cc.log("發等待配桌");
        var config = {};
        config.Cmd = "WaitGameGroup";
        config.Data = {};
        config.Data.Level = PublicSetUp.RoomLevel.toString();
        if (PublicSetUp.isLog) console.log("Send WaitGameGroup: ", JSON.stringify(config));
        Socket.WebonSend(JSON.stringify(config));

        //30秒配桌檢測
        Common.WaitGameTime();
    },
    //WaitGameGroup: 等待配桌是否成立
    //     State           : int (0:成功, 1:取點失敗, 2:寫入狀態失敗)
    cmd_WaitGameGroup(info) {
        if (info.State == 0) {
            if (PublicSetUp.isLog) console.log("配桌成立");
            PublicSetUp.KeepGame = false;
        } else {
            if (PublicSetUp.isLog) console.log("配桌失敗");
            SysMessage.open(Enum.Message.MATCHFAIL, "GAME");
        }
    },

    //配桌逾時
    Send_CancelWait() {
        //傳送CancelWait封包
        var config = {};
        config.Cmd = "CancelWait";
        config.Data = {};
        Socket.WebonSend(JSON.stringify(config));
    },

    //CancelWait 
    //State	                int         各種回應條件,0.成功,1.失敗,2.維護中
    cmd_CancelWait(info) {
    },
    //GameJoinRoom: 收到確認進入遊戲
    cmd_GameJoinRoom(info) {
        GameLogic.self.send_GameTableInfo(); //發取得遊戲資訊
    },
    //GameLastPokerTableInfo 客端發要求桌資訊
    send_GameTableInfo() {
        var config = {};
        config.Cmd = "GameLastPokerTableInfo";
        config.Data = {};
        config.Data.CardType = PublicSetUp.OrderPublic;
        if (PublicSetUp.isLog) console.log("Send GameLastPokerTableInfo: ", JSON.stringify(config));
        Socket.WebonSend(JSON.stringify(config));
    },
    //客端新出牌
    send_GamePlayCard(card, color) {
        var config = {};
        config.Cmd = "GamePlayCard";
        config.Data = {};
        config.Data.CardNum = card;
        config.Data.CardColor = color;
        console.log("Send GamePlayCard : ", JSON.stringify(config));
        Socket.WebonSend(JSON.stringify(config));
    },
    onTouchend(e) {
        /*if (e.target.name != "btn_setting") {
            cc.audioEngine.playEffect(this.AudioClip[0], false);
        }*/

        switch (e.target.name) {
            case "btn_setting"://設定按鈕
                //cc.audioEngine.playEffect(PublicSetUp.aio_click, false);
                System.open();
                break;

            case "btn_continue"://繼續遊戲
                this.KeepGame();
                GameLogic.btn_continue.active = false;
                break;
            case "":
                break;
        }

    },
});
