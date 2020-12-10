let SocketSetting = require('socketSetting');
let PublicSetUp = require('PublicSetUp');
let Common;
let SysMessage;
let Socket = {};
let ws = {};

cc.Class({
    extends: cc.Component,

    // use this for initialization
    onLoad: function () {
        Common = cc.find("Socketcommon").getComponent("Common");

        if (SocketSetting.setboolean === true) { return; }
        SocketSetting.setboolean = true;
        Socket.self = this;

        SocketSetting.ClientSetObject.serverhost = "ws://127.0.0.1:8017";//serverIP
        SocketSetting.ClientSetObject.serverport = "8011";
        SocketSetting.ClientSetObject.account = "123";
        SocketSetting.ClientSetObject.password = "456";

        SocketSetting.ClientSetObject.CocosDebug = true;
        SocketSetting.ClientSetObject.CocosDebug2 = 1;
        SocketSetting.ClientSetObject.LoginState = "2"; // 0註冊 1登入 2遊客
        SocketSetting.ClientSetObject.whereRoom = "lobby";
        SocketSetting.ClientSetObject.serverZone = "H5Game";//server的樓

        SocketSetting.ClientSetObject.usercode = "";
        SocketSetting.ClientSetObject.userchannel_id = "";
        SocketSetting.ClientSetObject.usergame_id = "";
        SocketSetting.ClientSetObject.usertoken = "";
        SocketSetting.ClientSetObject.userlang = "";
        SocketSetting.ClientSetObject.usergameMaker = "";
        SocketSetting.ClientSetObject.backHomeURL = "http://ruby.vxlord.com";
        // API參數
        if (window.GameServerSocket != null) {
            SocketSetting.ClientSetObject.serverhost = window.GameServerSocket;
            SocketSetting.ClientSetObject.LoginState = window.loginType;

            SocketSetting.ClientSetObject.account = window.accountName;
            SocketSetting.ClientSetObject.usercode = window.code;
            SocketSetting.ClientSetObject.userchannel_id = window.channelId;
            SocketSetting.ClientSetObject.usergame_id = window.gameId;
            SocketSetting.ClientSetObject.usertoken = window.token;
            SocketSetting.ClientSetObject.userlang = window.lang;
            SocketSetting.ClientSetObject.usergameMaker = window.gameMaker;
            SocketSetting.ClientSetObject.backHomeURL = window.homeURL;
            SocketSetting.ClientSetObject.CocosDebug2 = 0;
        }

        if (SocketSetting.ClientSetObject.LoginState == "2") {
            SocketSetting.ClientSetObject.serverZone = "H5Demo";
        }

        SocketSetting.ClientSetObject.serverExtensionID = "game";   //server的房(讀取Server的哪個資料夾)
        SocketSetting.ClientSetObject.servergameID = 0;             //遊戲編號
        SocketSetting.ClientSetObject.serverExtensionsClass = "";   //(讀取Server的資料夾內的哪個檔)
        SocketSetting.ClientSetObject.serverGameGroupID = "";       //server的桌
        SocketSetting.ClientSetObject.UserLanguage = "CNY";         //語言
        SocketSetting.ClientSetObject.RoomName = "";                //房間名稱
        SocketSetting.ClientSetObject.RoomBetRange = 0;             //房間區間

        SocketSetting.ClientSetObject.musicpoint = 1;
        SocketSetting.ClientSetObject.effectspoint = 0.5;

        SocketSetting.ClientSetObject.Ratio = 100;                  //比值
        SocketSetting.ClientSetObject.PingPong = 0;                 //Ping參數
        SocketSetting.ClientSetObject.soundBoolean = false;         //所有音樂(效)
        SocketSetting.ClientSetObject.musicBoolean = true;          //所有音樂
        SocketSetting.ClientSetObject.effectsBoolean = true;        //所有音效
        SocketSetting.ClientSetObject.sliderpoint = 0.00001;        //預設進入音效為靜音
        SocketSetting.ClientSetObject.WarningText = "";             //底層警告文字
        SocketSetting.ClientSetObject.WarningBoolean = false;       //底層警告文字是否常駐
        SocketSetting.ClientSetObject.SFSLoadStart = false;         //是否已呼過
        SocketSetting.init(SocketSetting.ClientSetObject.UserLanguage);//設定語言

        cc.debug._resetDebugSetting(SocketSetting.ClientSetObject.CocosDebug2);
    },

    //設定webscoket資料
    GameSocketSet: function (GameNumber) {
        if (SocketSetting.ClientSetObject.SFSLoadStart == true) { return; }
        SocketSetting.ClientSetObject.SFSLoadStart = true;
        SocketSetting.ClientSetObject.servergameID = GameNumber;//遊戲編號
        SocketSetting.ClientSetObject.scoketstr = SocketSetting.ClientSetObject.serverhost;
        // if (PublicSetUp.isLog) console.log("GameSocketSet: " + SocketSetting.ClientSetObject.scoketstr);
        this.ConnectServer();
    },

    //webscoket連接server
    ConnectServer: function () {
        this.otherserver();
        // if (PublicSetUp.isLog) console.log("ConnectServer: " + SocketSetting.ClientSetObject.scoketstr);
        ws = new WebSocket(SocketSetting.ClientSetObject.scoketstr);
        //下注監聽器
        ws.onopen = Socket.self.onWS_Open;
        ws.onerror = Socket.self.onWS_Error;
        ws.onclose = Socket.self.onWS_Close;
        ws.onmessage = Socket.self.onWS_Receive;
    },

    //客端送值給server
    WebonSend: function (event) {
        if (PublicSetUp.isDisconnect) return;
        ws.send(event);
    },

    /////////////////////////////////////////////////////////////
    ///     web socket event.
    /////////////////////////////////////////////////////////////

    //連線成功
    onWS_Open(event) {
        // 連線是否有打開.
        if (ws.readyState === WebSocket.OPEN) {
            //連線成功第一個封包,登入server
            var config = {};
            config.Cmd = "LoginServer";
            config.Data = {};
            config.Data.Account = SocketSetting.ClientSetObject.account;
            config.Data.Key = SocketSetting.ClientSetObject.usertoken;
            config.Data.Device = window.device;
            config.Data.DeviceIP = window.userIp;

            // if (PublicSetUp.isLog) console.log("onWS_Open: ", JSON.stringify(config));
            Socket.self.WebonSend(JSON.stringify(config));
        } else {
            if (PublicSetUp.isLog) console.log("WebSocket instance wasn't ready...");
        }
    },

    //關閉連線
    onWS_Close(event) {
        if (PublicSetUp.isLog) console.log("WebSocket instance closed.");
        SysMessage = cc.find("Canvas/SysMessage").getComponent("SysMessage");
        if (!SysMessage.View.active && PublicSetUp.isShutdown == false) {
            SysMessage.open(Enum.Message.BTHOME, "SHUTDOWN");
        }
    },

    //收到連線
    //伺服器回傳接收器
    onWS_Receive: function (event) {
        //暫時改成
        var eventReturnData = {};//Server回傳所有參數
        if (event.data == null) {
            if (PublicSetUp.isLog) console.log("unreceive");
            return;
        }

        if (PublicSetUp.isDisconnect) return;

        eventReturnData = JSON.parse(event.data);
        var cmd = eventReturnData.Cmd;//連線封包代號
        var data = eventReturnData.Data;

        if (cmd != "SystemCheck" && cmd != "ClientGetPing" && cmd != "ServerGetPing") {
            if (PublicSetUp.isLog) console.log(cmd, data);
            // cc.log(cmd, data);
        }

        //底層封包
        switch (cmd) {
            case "LoginServer":
                //收到LoginServer(玩家點數暱稱唯一碼)登入成功後馬上再登入大廳
                PublicSetUp.ServerVer = "." + data.ServerVer;
                PublicSetUp.LoginServer = data;
                var config = {};
                config.Cmd = "GetLobbyInfo";
                config.Data = {};
                config.Data.GameType = "1016";
                // if (PublicSetUp.isLog) console.log("Send GetLobbyInfo : json - ", JSON.stringify(config));
                Socket.self.WebonSend(JSON.stringify(config));
                break;
            default:
                // statements_def
                break;
        }
        //遊戲封包
        Common.WebToGame(cmd, data);
    },

    //各種連線失敗回傳 代碼及訊息
    onWS_Error: function (event) {
        if (PublicSetUp.isWriteLog) console.log("Send Text fired an error");
        if (PublicSetUp.isWriteLog) console.log(event);
        SocketSetting.ClientSetObject.WarningBoolean = true;

        let _userAgent = navigator.userAgent.toLocaleLowerCase();
        let _isIEEDG = false;
        if (PublicSetUp.isWriteLog) console.log("navigator.userAgent: ", _userAgent);
        if (_userAgent.match(/msie/) != null || _userAgent.match(/trident/) != null) _isIEEDG = true;
        if (_userAgent.match(/edg/) != null) _isIEEDG = true;

        SysMessage = cc.find("Canvas/SysMessage").getComponent("SysMessage");
        let scene = Common.getNowScene();
        if (scene.node.name == 'LoginScene') SysMessage.loginFail();
        else {
            if (_isIEEDG) {
                // do nothing
            } else {
                SysMessage.open(Enum.Message.MAINTAIN, "SHUTDOWN");
            }
        }
    },

    otherserver: function () {
        // server可自改伺服器
        if ((window.location.search).length > 0) {
            var getsearch = window.location.search.split('?')[1];
            var searchList = getsearch.split('&');
            var urldata = {};
            for (var key in searchList) {
                urldata[searchList[key].split('=')[0]] = searchList[key].split('=')[1];
            }
            for (var datakey in urldata) {
                if (datakey == "S") {
                    SocketSetting.ClientSetObject.serverhost = urldata[datakey];
                    cc.debug._resetDebugSetting(1);
                }
                else if (datakey == "P") {
                    SocketSetting.ClientSetObject.serverport = parseInt(urldata[datakey]);
                }
            }
        }
    },

    // 回官網
    backHome: function () {
        if (SocketSetting.ClientSetObject.backHomeURL != "") {
            document.location.href = SocketSetting.ClientSetObject.backHomeURL;
        } else {
            SocketSetting.ClientSetObject.WarningText = SocketSetting.t("S_9022");
            Common.WebToGame("Warning");
        }
    },

    // 音效
    switchEffect() {
        SocketSetting.ClientSetObject.effectsBoolean = !SocketSetting.ClientSetObject.effectsBoolean;
        return SocketSetting.ClientSetObject.effectsBoolean;
    },

    getEffect() {
        return SocketSetting.ClientSetObject.effectsBoolean;
    },

    effectPlay(_effectName, _playLoop = false, _volume = 1) {
        if (SocketSetting.ClientSetObject.effectsBoolean == false) return;

        let effectID = cc.audioEngine.playEffect(_effectName, _playLoop, _volume);
        return effectID;
    },
    // 音樂
    switchMusic() {
        SocketSetting.ClientSetObject.musicBoolean = !SocketSetting.ClientSetObject.musicBoolean;
        cc.audioEngine.setMusicVolume(SocketSetting.ClientSetObject.musicpoint = SocketSetting.ClientSetObject.musicBoolean ? 0.5 : 0);
        return SocketSetting.ClientSetObject.musicBoolean;
    },
    getMusic() {
        return SocketSetting.ClientSetObject.musicBoolean;
    },

    musicPlay(_musicName, _playLoop = true, _volume = SocketSetting.ClientSetObject.musicpoint) {
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(_musicName, _playLoop);
        cc.audioEngine.setMusicVolume(_volume);
    },
});