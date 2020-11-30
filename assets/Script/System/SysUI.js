let SysUI = {};

cc.Class({
    extends: cc.Component,

    properties: {
        isLogDisplay: false,
    },

    onLoad () {
        SysUI.self = this;
        SysUI.Chat = cc.find("Canvas/Chat").getComponent("SysChat");
        SysUI.GameLogic = cc.find("Canvas/GamePanel").getComponent("GameLogic");
                
        SysUI.UITime = cc.find("Canvas/SysUI/Time").getComponent(cc.Label);
        SysUI.Ping = cc.find("Canvas/SysUI/pic_Ping/txt_Ping").getComponent(cc.Label);
        SysUI.SysPanel = cc.find("Canvas/system_frame");

        SysUI.RoundInfo = {};
        SysUI.RoundInfo.Title = cc.find("Canvas/SysUI/RoundInfo/txt_GroupTitle").getComponent(cc.Label);
        SysUI.RoundInfo.ID = cc.find("Canvas/SysUI/RoundInfo/txt_GroupID").getComponent(cc.Label);

        SysUI.Button = {};
        SysUI.Button.Talk = cc.find("Canvas/SysUI/SysBtns/btn_Talk");
        SysUI.Button.Shoot = cc.find("Canvas/SysUI/SysBtns/btn_Shoot");
        SysUI.Button.Pin = cc.find("Canvas/SysUI/SysBtns/btn_Pin");
        SysUI.Button.Setting = cc.find("Canvas/SysUI/SysBtns/btn_Setting");

        SysUI.Button.Talk.on('touchend',SysUI.self.OnBtnClick);
        SysUI.Button.Shoot.on('touchend',SysUI.self.OnBtnClick);
        SysUI.Button.Pin.on('touchend',SysUI.self.OnBtnClick);
        SysUI.Button.Setting.on('touchend',SysUI.self.OnBtnClick);

        this.setLogContent("OnLoad ", "Complete");
    },

    start () {
        this.setUITime();

        SysUI.self.schedule(function() {
            this.setUITime();
        }, 1);
    },

    //update (dt) {},

    setGroupTitle(str) {
        SysUI.RoundInfo.Title.string = str;
    },

    setGroupID(str) {
        SysUI.RoundInfo.ID.string = str;
    },

    setPing(str) {
        SysUI.Ping.string = str+"ms";
    },

    setUITime() {
        let date = new Date();
        SysUI.UITime.string = String(date.getHours()).padStart(2,'0')+":"+String(date.getMinutes()).padStart(2,'0');
    },

    setLogContent(title, content) {
        if(this.isLogDisplay)
            cc.log(title, content);
    },

    OnBtnClick(e) {
        //SysUI.self.setLogContent("OnClick: ",e);
        switch(e.target.name) {
            case "btn_Talk":
                SysUI.self.setLogContent("OnClick: ","talk");
                SysUI.Chat.openDialog();
                break;
            case "btn_Shoot":
                SysUI.self.setLogContent("OnClick: ","shoot");
                break;
            case "btn_Pin":
                SysUI.self.setLogContent("OnClick: ","pin");
                SysUI.GameLogic.runDealCard();
                break;
            case "btn_Setting":
                SysUI.self.setLogContent("OnClick: ","setting");
                SysUI.SysPanel.active = true;
                break;
        }
    },
});
