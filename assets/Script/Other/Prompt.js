let Poker = [];
let PublicSetUp = require('PublicSetUp');
let Banner;
let MainPlayer;
let Prompt = {};
let GameFight;
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Prompt.Mask = cc.find("Mask", this.node);
        Prompt.View = cc.find("View", this.node);
        Prompt.txt_title = cc.find("pic_boxTitle/txt_chooseColor", Prompt.View).getComponent(cc.Sprite);
        for (let i = 1; i < 5; i++) {
            Poker[i] = {};
            Poker[i].node = cc.find("poker/pic_poker_" + i, Prompt.View);
            Poker[i].sprite = cc.find("poker/pic_poker_" + i, Prompt.View).getComponent(cc.Sprite);
            Poker[i].node.on('touchend', this.onTouchend, this);
        }
        Prompt.btn_define = cc.find("btn/btn_define", Prompt.View);
        Prompt.txt_define = cc.find("txt_define", Prompt.btn_define).getComponent(cc.Sprite);
        Prompt.btn_define.on('touchend', this.onTouchend, this);

        Prompt.btn_cancel = cc.find("btn/btn_cancel", Prompt.View);
        Prompt.txt_cancel = cc.find("txt_cancel", Prompt.btn_cancel).getComponent(cc.Sprite);
        Prompt.btn_cancel.on('touchend', this.onTouchend, this);



        Banner = cc.find("Canvas/GamePanel/Banner").getComponent("Banner");//Spine Banner動畫
        MainPlayer = cc.find("Canvas/GamePanel/Card/PlayerPoker_0").getComponent("PokerCard"); //主畫面玩家

        GameFight = cc.find("Canvas/GamePanel").getComponent("GameFightScene");


    },

    start() {
        this.close();
        this.UILanguage();

    },
    close() {
        Prompt.Mask.active = false;
        Prompt.View.active = false;

    },
    open() {
        Prompt.Mask.active = true;
        Prompt.View.active = true;

    },
    //重置
    init() {
        for (let i = 1; i < 5; i++) {
            switch (i) {
                case 1:
                    Poker[i].sprite.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_chooseColor_pokerG_n");;
                    break;
                case 2:
                    Poker[i].sprite.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_chooseColor_pokerY_n");
                    break;
                case 3:
                    Poker[i].sprite.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_chooseColor_pokerR_n");;
                    break;
                case 4:
                    Poker[i].sprite.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_chooseColor_pokerB_n");;
                    break;
            }
        }
    }
    ,
    onTouchend(e) {
        cc.log("選擇" + e.target.name);
        let color = parseInt(e.target.name.replace("pic_poker_", ""));

        //重置
        this.init();

        switch (color) {
            case 1:
                Poker[color].sprite.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_chooseColor_pokerG_p");
                break;
            case 2:
                Poker[color].sprite.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_chooseColor_pokerY_p");
                break;
            case 3:
                Poker[color].sprite.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_chooseColor_pokerR_p");
                break;
            case 4:
                Poker[color].sprite.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_chooseColor_pokerB_p");
                break;
        }
        //按送出或取消
        switch (e.target.name) {
            case "btn_define":
                if (PublicSetUp.SelectCard != null) {
                    GameFight.send_GamePlayCard(PublicSetUp.SelectCard, PublicSetUp.SelectColor);
                    //MainPlayer.removeCard(PublicSetUp.SelectCard);
                    this.close();
                }

                break;
            case "btn_cancel":
                this.init();
                this.start();
                //Poker[color].sprite.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_chooseColor_pokerG_p");;
                break;
        }
        if (color != null)
            PublicSetUp.SelectColor = color;




    },
    UILanguage() {
        Prompt.txt_title.spriteFrame = PublicSetUp.GameText.getSpriteFrame("txt_chooseColor");
        Prompt.txt_define.spriteFrame = PublicSetUp.GameText.getSpriteFrame("txt_chooseColor_define");
        Prompt.txt_cancel.spriteFrame = PublicSetUp.GameText.getSpriteFrame("txt_chooseColor_cancel");
    }

    // update (dt) {},
});
