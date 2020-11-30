let PublicSetUp = require('PublicSetUp');
let Enum = require('Enum');
//多國語系參數
let _LC;

cc.Class({
    extends: cc.Component,

    properties: {
        Confirm: {
            default: [],
            type: cc.SpriteFrame,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.Mask = cc.find("Mask", this.node);
        this.View = cc.find("View", this.node);

        this.txt_text = cc.find("View/txt_text", this.node).getComponent(cc.Label);
        this.btn_confirm = cc.find("View/btn_confirm", this.node);
        this.btn_confirm.on(cc.Node.EventType.TOUCH_END, this.onTouchend, this);

        //語系轉換 - 文字
        this.txt_tag = cc.find("View/txt_tag", this.node).getComponent(cc.Label);
        //語系轉換 - 按鈕
        this.pic_confirm = cc.find("View/btn_confirm", this.node).getComponent(cc.Sprite);
    },

    start() {
        _LC = PublicSetUp.LanguageNo - 1;
        this.UILanguage();
        this.initState();
    },

    initState() {
        this.txt_text.string = "";
        this.Mask.active = false;
        this.View.active = false;
    },

    UILanguage() {
        //this.txt_tag.spriteFrame = this.TopTitle[_LC];
        this.txt_tag.string = Enum.Message.NOTICE;
        this.pic_confirm.spriteFrame = this.Confirm[_LC];
    },

    open(_str, _scene = "GAME") {
        this.Mask.active = true;
        this.View.active = true;

        this.txt_text.string = _str;
        this.Scene = _scene;
    },

    loginFail() {
        this.Mask.active = true;
        this.View.active = true;

        this.txt_text.string = Enum.Message.LOGINFAIL;
        this.Scene = "SHUTDOWN";
    },

    onTouchend(e) {
        this.initState();

        if (this.Scene == "GAME") cc.director.loadScene('Lobby');
        else if (this.Scene == "SHUTDOWN") window.location.replace(window.homeURL);
    },

    // update (dt) {},
});
