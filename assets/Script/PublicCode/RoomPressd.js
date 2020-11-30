let PublicSetUp = require('PublicSetUp');
let Enum = require('Enum');

cc.Class({
    extends: cc.Component,

    properties: {
        BackLight: {
            default: null,
            type: cc.SpriteFrame,
        },
        LevelNum: {
            default: 0,
            type: cc.Integer,
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        let _n = this.LevelNum - 1;
        this.table = cc.find("btn_join_" + _n, this.node);
        this.table.on('mouseenter', this.onmouseenter, this);
        this.table.on('mouseleave', this.onmouseleave, this);
        //LevelNum
        this.txt_room = cc.find("btn_join_" + _n + "/txt_room", this.node).getComponent(cc.Sprite);
        this.Ante = cc.find("Ante", this.node).getComponent(cc.Label);


    },

    start() {
        this.txt_room.spriteFrame = PublicSetUp.GameText.getSpriteFrame("txt_room" + this.LevelNum + "_p");
        this.Ante.string = Enum.Message.ANTE + " " + PublicSetUp.GetLobbyInfo.LevelInfo[this.LevelNum - 1];
        //this.txt_ante.string = Enum.Message.NOHISTORY;
    },



    onmouseenter(e) {
        if (PublicSetUp.GetLobbyInfo.OpenState) {
            if (PublicSetUp.GetLobbyInfo.OpenState[this.LevelNum - 1] == 0) {
                return;
            }
        }

        e.target.getComponent(cc.Sprite).spriteFrame = this.BackLight;

        cc.tween(e.target.parent).to(0.1, { scale: 1.05 }).start();
        cc.find("txt_room", e.target).getComponent(cc.Sprite).spriteFrame = PublicSetUp.GameText.getSpriteFrame("txt_room" + this.LevelNum + "_n");

    },
    onmouseleave(e) {
        if (PublicSetUp.GetLobbyInfo.OpenState) {
            if (PublicSetUp.GetLobbyInfo.OpenState[this.LevelNum - 1] == 0) {
                return;
            }
        }
        
        e.target.getComponent(cc.Sprite).spriteFrame = null;
        cc.tween(e.target.parent).to(0.1, { scale: 1 }).start();
        cc.find("txt_room", e.target).getComponent(cc.Sprite).spriteFrame = PublicSetUp.GameText.getSpriteFrame("txt_room" + this.LevelNum + "_p");
    },

    // update (dt) {},
});
