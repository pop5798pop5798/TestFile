let PublicSetUp = require('PublicSetUp');
let Enum = require('Enum');
let obj_History = {};

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {

        this.Mask = cc.find("Mask", this.node);
        this.View = cc.find("View", this.node);

        this.btn_Close = cc.find("View/btn_Close", this.node);
        this.btn_Close.on(cc.Node.EventType.TOUCH_END, this.onTouchend, this);

        this.arr_list = [];

        let _children = cc.find("View/sub_List", this.node).getChildren();
        for (let i = 0; i < _children.length; i++) {
            this.arr_list[i] = {};
            this.arr_list[i].GroupId = cc.find("txt_GroupId", _children[i]).getComponent(cc.Label);
            this.arr_list[i].LowBet = cc.find("txt_LowBet", _children[i]).getComponent(cc.Label);
            this.arr_list[i].Bets = cc.find("txt_Bets", _children[i]).getComponent(cc.Label);
            this.arr_list[i].WinLose = cc.find("txt_WinLose", _children[i]).getComponent(cc.Label);
            this.arr_list[i].Time = cc.find("txt_Time", _children[i]).getComponent(cc.Label);
        }

        //語系轉換 - 文字
        this.txt_Title = cc.find("View/txt_Title", this.node).getComponent(cc.Label);
        this.txt_GroupId = cc.find("View/Tag/txt_GroupId", this.node).getComponent(cc.Label);
        this.txt_LowBet = cc.find("View/Tag/txt_LowBet", this.node).getComponent(cc.Label);
        this.txt_Bets = cc.find("View/Tag/txt_Bets", this.node).getComponent(cc.Label);
        this.txt_WinLose = cc.find("View/Tag/txt_WinLose", this.node).getComponent(cc.Label);
        this.txt_Time = cc.find("View/Tag/txt_Time", this.node).getComponent(cc.Label);

        this.LanguageChange(PublicSetUp.Language);
    },

    start() {
        this.initState();
    },

    // update (dt) {},

    initState() {
        this.arr_list.forEach(e => {
            e.GroupId.string = "";
            e.LowBet.string = "";
            e.Bets.string = "";
            e.WinLose.string = "";
            e.Time.string = "";
        });

        this.Mask.active = false;
        this.View.active = false;
    },

    open() {
        this.Mask.active = true;
        this.View.active = true;

        let _history = PublicSetUp.History;
        for (let i = 0; i < PublicSetUp.History.TotalCount; i++) {
            this.arr_list[i].GroupId.string = _history.JiangHao[i];
            this.arr_list[i].LowBet.string = PublicSetUp.GetLobbyInfo.LevelInfo[_history.GameArea[i] - 1];
            this.arr_list[i].Bets.string = _history.Bet[i];
            this.arr_list[i].WinLose.string = _history.WinLose[i];
            this.arr_list[i].Time.string = _history.DateTime[i];
        }
    },

    onTouchend(e) {
        this.initState();
    },

    //變換語系/////////////////////////////////////////////////////////////////////////////
    LanguageChange(e) {
        this.txt_Title.string = Enum.Message.HISTORY;
        this.txt_GroupId.string = Enum.Message.GAMENUM;
        this.txt_LowBet.string = Enum.Message.ANTE;
        this.txt_Bets.string = Enum.Message.EFFBET;
        this.txt_WinLose.string = Enum.Message.WINLOSE;
        this.txt_Time.string = Enum.Message.TIME;
    },
});
