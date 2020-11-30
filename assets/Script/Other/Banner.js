let Banner = {};
let PublicSetUp = require('PublicSetUp');

cc.Class({
    extends: cc.Component,

    properties: {
        GameOver: {
            default: [],
            type: sp.SkeletonData,
        },
        LastCard: {
            default: [],
            type: sp.SkeletonData,
        },
        Result: {
            default: [],
            type: sp.SkeletonData,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Banner.node = cc.find("View", this.node);
        Banner.Card = cc.find("sp_Card", Banner.node);
        Banner.GameOver = cc.find("sp_GameOver", Banner.node);
        Banner.LastCard = cc.find("sp_lastCard", Banner.node);
        Banner.Result = cc.find("sp_result", Banner.node);
        Banner.pic_gametable = cc.find("Canvas/bg_Scene_Game/pic_gametable");//桌面箭頭
    },

    start() {
        this.SPLanguage();
    },
    //重置
    init() {
        this.unscheduleAllCallbacks();
        Banner.Card.active = false;
        Banner.GameOver.active = false;
        Banner.LastCard.active = false;
        Banner.Result.active = false;
        Banner.Card.eulerAngles = cc.v3(0, 0, 0);
    },
    initTable() {
        Banner.pic_gametable.eulerAngles = cc.v3(0, 0, 0);
    },

    //打開Banner 
    //_t:Spine名稱 
    //_ani:Spine動畫名
    open(_t, _ani) {

        if (_t == "Card") {
            if (_ani == "turn") {
                this.turnBanner();
            } else {
                Banner.Card.eulerAngles = cc.v3(0, 0, 0);
            }
        }

        switch (_t) {
            case "Card":
                Banner.Card.active = true;
                Banner.Card.getComponent(sp.Skeleton).animation = _ani;
                this.scheduleOnce(function () {
                    this.init();
                }, 2)
                break;
            case "GameOver":
                Banner.GameOver.active = true;
                Banner.GameOver.getComponent(sp.Skeleton).animation = _ani;
                break;
            case "LastCard":
                Banner.LastCard.active = true;
                Banner.LastCard.getComponent(sp.Skeleton).animation = _ani;
                this.scheduleOnce(function () {
                    this.init();
                }, 2)
                break;
            case "Result":
                Banner.Result.active = true;
                Banner.Result.getComponent(sp.Skeleton).animation = _ani;
                break;
        }

    },

    turnBanner() {
        switch (PublicSetUp.Turn) {
            case 0:
                cc.log("轉向！逆時鐘！");
                Banner.Card.eulerAngles = cc.v3(0, 180, 0);
                Banner.pic_gametable.eulerAngles = cc.v3(0, 180, 0);
                PublicSetUp.Turn = 1;
                break;
            case 1:
                cc.log("轉向！順時鐘！");
                Banner.Card.eulerAngles = cc.v3(0, 0, 0);
                Banner.pic_gametable.eulerAngles = cc.v3(0, 0, 0);
                PublicSetUp.Turn = 0;
                break;
        }
    },

    SPLanguage() {
        Banner.GameOver.getComponent(sp.Skeleton).skeletonData = this.GameOver[PublicSetUp.LanguageNo - 1];
        Banner.LastCard.getComponent(sp.Skeleton).skeletonData = this.LastCard[PublicSetUp.LanguageNo - 1];
        Banner.Result.getComponent(sp.Skeleton).skeletonData = this.Result[PublicSetUp.LanguageNo - 1];
    }

    // update (dt) {},
});
