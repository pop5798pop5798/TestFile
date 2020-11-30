let PublicSetUp = require('PublicSetUp');
let Enum = require('Enum');
let Socket;
let Message;

let _LC;

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        Socket = cc.find("Socketcommon").getComponent("socket");
        Message = cc.find("Canvas/Message").getComponent("message");

        this.Mask = cc.find("Mask", this.node);
        this.View = cc.find("View", this.node);

        this.ani_view = this.node.getComponent(cc.Animation);
        this.etxt_input = cc.find("View/editBox_input", this.node).getComponent(cc.EditBox);
        this.btn_Close = cc.find("View/btn_Close/btn_Collider", this.node);
        this.btn_Close.on(cc.Node.EventType.TOUCH_END, this.onTouchend, this);

        //發送按鈕
        this.btn_Send = cc.find("View/btn_Send", this.node);
        this.btn_Send.on(cc.Node.EventType.TOUCH_END, this.onTouchend, this);

        //語系變換 - 文字
        this.txt_Title = cc.find("View/txt_Title", this.node).getComponent(cc.Label);
        this.txt_placeHolder = cc.find("View/editBox_input/txt_placeHolder", this.node).getComponent(cc.Label);

        _LC = PublicSetUp.Language - 1;
        this.LanguageChange(PublicSetUp.Language);
    },

    start() {
        this.initState();
    },

    // update (dt) {},

    initState() {
        this.etxt_input.string = "";

        this.Mask.active = false;
        this.View.active = false;
    },

    open() {
        this.Mask.active = true;
        this.View.active = true;
        PublicSetUp.EditBoxString = "";
        this.ani_view.play().wrapMode = cc.WrapMode.Normal;
    },

    //editBox回調
    onEdittingReturn(editbox) {
        PublicSetUp.EditBoxString = editbox.string;
    },

    onTouchend(e) {
        if (e.target.name == "btn_Collider") {
            this.initState();
        } else if (e.target.name == "btn_Send") {
            if (this.etxt_input.string == "") {
                Message.showmessage(Enum.Message.NOFEEDBACK, 0.75, false);
            } else {
                //發回饋意見
                var config = {};
                config.Cmd = "WriteMemberReport";
                config.Data = {};
                config.Data.Msg = this.etxt_input.string;

                console.log("onEdittingReturn: ", JSON.stringify(config));
                Socket.WebonSend(JSON.stringify(config), true);

                this.initState();
            }
        }
    },

    //變換語系/////////////////////////////////////////////////////////////////////////////
    LanguageChange(e) {
        this.txt_Title.string = Enum.Message.FEEDBACK;
        this.txt_placeHolder.string = Enum.Message.ENTERTEXT;
    },
});
