let PublicSetUp = require('PublicSetUp');
let Enum = require('Enum');

let LobbyScene = {};
let Key = {};
let Message;
let SysMessage;
let Marquee;
let Socket;
let Common;
let System;
let History;
let Order;
let Rule;

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {

        Socket = cc.find("Socketcommon").getComponent("socket");
        Common = cc.find("Socketcommon").getComponent("Common");

    },

    start() {

        Common.setNowScene(this);

        this.send_WaitGameGroup(0);

    },

    send_WaitGameGroup(level) {
        PublicSetUp.RoomLevel = level;
        PublicSetUp.Ante = PublicSetUp.GetLobbyInfo.LevelInfo[level];//設定底注參數
        PublicSetUp.LowLimit = PublicSetUp.GetLobbyInfo.LowLimit[level];//設定准入金額

        this.scheduleOnce(function () {
            cc.director.loadScene("GameFight");
        }, 0.5);
    },
});
