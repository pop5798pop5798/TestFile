let SysChat = {};

cc.Class({
    extends: cc.Component,

    properties: {
        pDialog: {
            default: null,
            type: cc.Prefab,
        },
    },

    onLoad () {
        SysChat.self = this;

        SysChat.Ani = cc.find("Canvas/Chat").getComponent(cc.Animation);
        SysChat.EditBox = cc.find("Canvas/Chat/editBox_input").getComponent(cc.EditBox);
        SysChat.ScrollView = cc.find("Canvas/Chat/sv_ChatDialog");
        SysChat.DialogBG = cc.find("Canvas/Chat/pic_Bg");
        SysChat.TypeBG = cc.find("Canvas/Chat/pic_typeBg");

        SysChat.Dialog = {};
        SysChat.Dialog.Content = cc.find("Canvas/Chat/sv_ChatDialog/view/content");
    },

    start () {
        SysChat.Ani.wrapMode = cc.WrapMode.Normal;
        SysChat.Dialog.MinHeight = 210;
        SysChat.Dialog.height = 0;
        SysChat.DialogBG.scale = 0;
        SysChat.TypeBG.scale = 0;
        SysChat.isOpen = false;

        this.setInitState();
        this.node.active = false;
    },

    // update (dt) {},

    setInitState() {
        SysChat.ScrollView.active = false;
        SysChat.EditBox.node.active = false;
    },

    OnAniFinished(num, str) {
        console.log('OnAniFinished: param1[%s], param2[%s]', num, str);
        SysChat.ScrollView.active = true;
        SysChat.ScrollView.getComponent(cc.ScrollView).scrollToBottom(0);
        SysChat.EditBox.node.active = true;
        SysChat.EditBox.focus(true);
    },

    openDialog() {
        console.log("openDialog");
        if(!SysChat.isOpen) {
            this.node.active = true;
            SysChat.isOpen = true;
            SysChat.Ani.play();
            SysChat.Ani.on('finished', this.OnAniFinished, this);
        } else {
            this.closeDialog();
        }
    },

    closeDialog() {
        SysChat.isOpen = false;
        SysChat.Ani.stop();
        this.setInitState();
        this.node.active = false;
    },

    addDialog() {
        let newDialog = cc.instantiate(this.pDialog);
        newDialog.getComponent(cc.Label).string = SysChat.EditBox.string;

        SysChat.Dialog.Content.addChild(newDialog,1,"txt_dialog");
        SysChat.Dialog.height += newDialog.height;

        if(SysChat.Dialog.height < SysChat.Dialog.MinHeight)
            SysChat.Dialog.Content.height = SysChat.Dialog.MinHeight;
        else
            SysChat.Dialog.Content.height = SysChat.Dialog.height;

        SysChat.ScrollView.getComponent(cc.ScrollView).scrollToBottom(0);

        SysChat.EditBox.string = "";
        console.log("ContentHeight: "+SysChat.Dialog.Content.height);
    }
});
