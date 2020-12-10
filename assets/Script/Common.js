let PublicSetUp = require('PublicSetUp');
let SocketSet = require('socketSetting');
let Enum = require('Enum');
let Socket;
let Common;
let Scene;
let Timer = {};
let WaitDate;

module.exports = {
    UserPoint: 0,//玩家金額
    CanJoinGame: false,
    LoadGameOver: false,
    ClientBrowserMode: "",
};

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad() {
        Socket = cc.find("Socketcommon").getComponent("socket");
        Common = this;
        //手機轉向偵測
        window.addEventListener("orientationchange", this.onOrientation);

        Timer.SCD = 0;
    },

    start() {
        //切分頁離開遊戲
        cc.game.on(cc.game.EVENT_HIDE, function () {
            PublicSetUp.isFocus = false;
        });

        //切分頁進入遊戲
        cc.game.on(cc.game.EVENT_SHOW, function () {
            PublicSetUp.isFocus = true;
            if (Scene['adjustGameProcess']) Scene.adjustGameProcess();
            if (Scene.node.name == "GamePanel" && !PublicSetUp.JoinGame) Common.BackWaitGT();
        });
    },

    init: function () {
        //console.log("目前場景=", cc.director.getScene().name);//寫出目前場景
    },
    getNowScene() {
        return Scene;
    },
    // 設定新場景.
    setNowScene(scene) {
        Scene = scene;
    },

    _sendToScene(cmd, info) {
        let func = "cmd_" + cmd;
        if (Scene[func]) {
            // console.log("Scene Exist");
            Scene[func](info);
        } else {
            console.log("Scene Unexist", cmd);
        }
    },

    WebToGame: function (cmd, info) {//收到server的封包
        //cc.log("收到server封包" + cmd);
        //console.log(cmd, info);
        switch (cmd) {
            //大廳內封包
            case "LoginServer":
                PublicSetUp.LoginServer = info;
                PublicSetUp.VPoints = info.VPoints;

                Timer.SCD = 60;
                this.schedule(this.SCD, 1);
                this.CGP();
                this._sendToScene(cmd, info);
                break;
            case "SystemCheck":
                Timer.SCD = 60;
                this.send_SystemCheck();
                break;
            case "SystemClose":
                this._sendToScene(cmd, info);
                break;
            case "SystemDisconnect":
                this._sendToScene(cmd, info);
                break;
            case "GetLobbyInfo":
                PublicSetUp.GetLobbyInfo = info;
                this._sendToScene(cmd, info);
                break;
            case "GetHistoryRecord":
                PublicSetUp.History = info;
                this._sendToScene(cmd, info);
                break;
            case "GameJoinRoom":
                //中斷30秒配桌檢測
                PublicSetUp.JoinGame = true;
                this.unschedule(this.WGC);

                PublicSetUp.SelfSeat = info.Seat;
                this.setPublicSeat(info);
                this._sendToScene(cmd, info);
                break;
            case "GameLastPokerTableInfo":
                PublicSetUp.GameTableInfo = info;
                this._sendToScene(cmd, info);
                break;
            case "WaitGameGroup":
                PublicSetUp.WaitGameGroup = info;
                this._sendToScene(cmd, info);
                break;
            case "ErrorMsg":

                break;
            case "KickUser":
                this._sendToScene(cmd, info);
                break;
            case "CancelWait":
                PublicSetUp.CancelWait = info;
                this._sendToScene(cmd, info);
                break;

            default:

                break;
        }
    },

    send_SystemCheck() {
        var config = {};
        config.Cmd = "SystemCheck";
        config.Data = {};
        // console.log("SystemCheck: ", config);
        Socket.WebonSend(JSON.stringify(config));
    },

    send_ServerGetPing() {
        var config = {};
        config.Cmd = "ServerGetPing";
        config.Data = {};
        // console.log("ServerGetPing: ", config);
        Socket.WebonSend(JSON.stringify(config));
    },

    send_ClientGetPing() {
        var config = {};
        config.Cmd = "ClientGetPing";
        config.Data = {};
        // console.log("ClientGetPing: ", config);
        Socket.WebonSend(JSON.stringify(config));
    },

    setGetPing() {
    },

    setPublicSeat(info) {
        let add = 4 - info.Seat;
        for (let i = 0; i < 4; i++) {
            PublicSetUp.Seat[i] = (add + i) % 4;
        }
        cc.log("相對座位陣列", PublicSetUp.Seat)
    },

    setConfirmSeat(_info) {
        if (_info.State == 0) {
            PublicSetUp.arr_bool_Confirm[_info.SeatNo] = true;
        }
    },

    Disconnect() {
        Scene.Disconnect();
    },

    // Server Connection Detect
    SCD: function () {
        if (Timer.SCD > 0) {
            Timer.SCD--;
        } else {
            Scene.Disconnect(1);
            this.unschedule(this.SCD);
        }
    },

    // Client Get Ping
    // Date.now() 方法回傳自 1970/01/01 00:00:00 UTC 起經過的毫秒數。
    CGP: function () {
        this.send_ClientGetPing();
        PublicSetUp._nowTime = Date.now();
    },

    onOrientation() {
        if (window.orientation == 180 || window.orientation == 0) {
            Scene.Orientation180();
        } else if (window.orientation == 90 || window.orientation == -90) {
            Scene.Orientation90();
        }
    },
    // 取得隱匿帳號, 參數: 帶入字串、顯示起始、顯示結束、前贅字元、字元數量
    getConcealAccount(_str) {
        let _output = "";
        if (_str.length > 5) _output = "***" + _str.slice(-5);
        else _output = "***" + _str;
        return _output;
    },
    //手機轉向
    windowChange() {
        if (window.orientation == 180 || window.orientation == 0) {
            // alert("竖屏");
            Scene.cmd_window180();
        }
        if (window.orientation == 90 || window.orientation == -90) {
            // alert("横屏");
            Scene.cmd_window90();
        }
    },

    //30秒配桌檢測////////////////////////////////////////////////////////////////////////////
    WaitGameTime() {
        cc.log("WaitGameTime");
        PublicSetUp.JoinGame = false;

        WaitDate = new Date();
        Timer.WGC = 30;
        this.schedule(this.WGC, 1);
    },
    BackWaitGT() {
        cc.log("BackWaitGT");
        if (PublicSetUp.JoinGame == true) {
            this.unschedule(this.WGC);
            return;
        }

        let _date = new Date();
        // cc.log(_date, WaitDate);

        _date = Math.abs(_date - WaitDate);
        _date = Math.floor(_date / 1000);

        Timer.WGC = 30 - _date;
    },

    WGC: function () {
        cc.log("WGC", Timer.WGC);
        if (Timer.WGC > 0) {
            Timer.WGC--;
        } else {
            if (PublicSetUp.JoinGame == false) {
                cc.log("****30秒配桌檢測失敗****");
                if (Scene['Send_CancelWait']) Scene.Send_CancelWait();
            }
            this.unschedule(this.WGC);
        }
    },
    //30秒配桌檢測////////////////////////////////////////////////////////////////////////////




});


