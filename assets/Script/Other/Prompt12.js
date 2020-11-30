let Poker = [];
let PublicSetUp = require('PublicSetUp');
let Banner;
let MainPoker;
let Prompt = {};
let GameFight;
let _colorArr = [0, 0, 0, 0];
let CardNum12 = 0;

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
        MainPoker = cc.find("Canvas/GamePanel/Card/PlayerPoker_0").getComponent("PokerCard"); //主畫面玩家

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

    //_a = [CardColor, CardNum]
    open(_a) {

        this.init();
        this.check12(_a);

        Prompt.Mask.active = true;
        Prompt.View.active = true;

    },

    //重置顏色圖
    init() {
        for (let i = 1; i < 5; i++) {
            switch (i) {
                case 1:
                    Poker[i].sprite.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_chooseColor_pokerG_n");
                    Poker[i].node.color = new cc.Color(255, 255, 255);
                    break;
                case 2:
                    Poker[i].sprite.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_chooseColor_pokerY_n");
                    Poker[i].node.color = new cc.Color(255, 255, 255);
                    break;
                case 3:
                    Poker[i].sprite.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_chooseColor_pokerR_n");
                    Poker[i].node.color = new cc.Color(255, 255, 255);
                    break;
                case 4:
                    Poker[i].sprite.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_chooseColor_pokerB_n");
                    Poker[i].node.color = new cc.Color(255, 255, 255);
                    break;
            }
        }
    },

    //_a = [CardColor, CardNum]
    //檢查12張那些能出
    check12(_a) {

        if (_a[1] > 11) {
            cc.log("12換色卡");
            CardNum12 = _a[1];
            return;
        }
        CardNum12 = _a[1];

        //有那些顏色有牌能出
        _colorArr = [0, 0, 0, 0];

        //檢查
        PublicSetUp.HandPoker[PublicSetUp.SelfSeat].forEach(element => {
            let _b = this.ThrowCardCheck(element);
            //同數字
            if (_b[1] == _a[1]) {
                //與當前出牌比對
                if (_b[0] == PublicSetUp.CurrentThrow[0] || _b[1] == PublicSetUp.CurrentThrow[1]) {
                    _colorArr[_b[0] - 1] += 1;
                }
            }
        });

        //Log
        cc.log("12張視窗能出的牌：綠=", _colorArr[0], "黃=", _colorArr[1], "紅=", _colorArr[2], "藍=", _colorArr[3]);

        //變更按鈕顯示
        for (let i = 0; i < 4; i++) {

            if (_colorArr[i] == 0) {
                //如果沒有那個顏色的牌就轉暗
                Poker[i + 1].node.color = new cc.Color(70, 70, 70);
            }
        }

    },

    //_c = 顏色
    setSelectCard(_c) {
        //檢查
        PublicSetUp.HandPoker[PublicSetUp.SelfSeat].forEach(element => {
            let _b = this.ThrowCardCheck(element);
            //同數字
            if (_b[0] == _c && CardNum12 == _b[1]) {
                PublicSetUp.SelectCard = element;
                PublicSetUp.SelectColor = _c;
            }
        });

    },
    initPick() {
        for (let i = 1; i < 5; i++) {
            switch (i) {
                case 1:
                    Poker[i].sprite.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_chooseColor_pokerG_n");

                    break;
                case 2:
                    Poker[i].sprite.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_chooseColor_pokerY_n");

                    break;
                case 3:
                    Poker[i].sprite.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_chooseColor_pokerR_n");

                    break;
                case 4:
                    Poker[i].sprite.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_chooseColor_pokerB_n");

                    break;
            }
        }
    },

    onTouchend(e) {
        // cc.log("選擇" + e.target.name);
        let color = parseInt(e.target.name.replace("pic_poker_", ""));

        //重置
        this.initPick();

        switch (color) {
            case 1:
                if (CardNum12 != 12 && _colorArr[0] == 0) return;//沒有那個顏色
                // cc.log("有這個顏色");
                Poker[color].sprite.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_chooseColor_pokerG_p");
                this.setSelectCard(1);
                break;
            case 2:
                if (CardNum12 != 12 && _colorArr[1] == 0) return;//沒有那個顏色
                // cc.log("有這個顏色");
                Poker[color].sprite.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_chooseColor_pokerY_p");
                this.setSelectCard(2);
                break;
            case 3:
                if (CardNum12 != 12 && _colorArr[2] == 0) return;//沒有那個顏色
                // cc.log("有這個顏色");
                Poker[color].sprite.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_chooseColor_pokerR_p");
                this.setSelectCard(3);
                break;
            case 4:
                if (CardNum12 != 12 && _colorArr[3] == 0) return;//沒有那個顏色
                // cc.log("有這個顏色");
                Poker[color].sprite.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_chooseColor_pokerB_p");
                this.setSelectCard(4);
                break;
        }

        //按送出或取消
        switch (e.target.name) {
            case "btn_define":
                if (PublicSetUp.SelectCard != null) {
                    if (parseInt(PublicSetUp.SelectCard) > 176)//換色卡
                    {
                        GameFight.send_GamePlayCard(PublicSetUp.SelectCard, PublicSetUp.SelectColor);
                        //MainPlayer.removeCard(PublicSetUp.SelectCard);
                        this.close();
                        //播放動畫
                        switch (PublicSetUp.SelectColor) {
                            case 1:
                                Banner.open("Card", "change_green");
                                break;
                            case 2:
                                Banner.open("Card", "change_yellow");
                                break;
                            case 3:
                                Banner.open("Card", "change_red");
                                break;
                            case 4:
                                Banner.open("Card", "change_blue");
                                break;

                        }
                    }
                    else {
                        var _mp = MainPoker.CheckHandThrow(PublicSetUp.SelectCard, PublicSetUp.SelectColor);
                        if (_mp) this.close();
                    }

                }

                break;
            case "btn_cancel":
                this.init();
                this.close();
                MainPoker.Prompt12close();
                //Poker[color].sprite.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_chooseColor_pokerG_p");;
                break;
        }
        if (color != null) {
            PublicSetUp.SelectColor = color;
        }

    },

    // //判斷花色及數字 [花色,點數]
    // // 1梅花 2鑽石 3紅心 4黑桃
    ThrowCardCheck(_pokerP) {
        let CardColor = Math.ceil(_pokerP / 11);//花色
        CardColor = (CardColor % 4 == 0) ? 4 : CardColor % 4;
        let CardNum = (_pokerP % 11 == 0) ? 11 : _pokerP % 11;//點數
        if (_pokerP > 176)//換色卡
            CardNum = 12;
        return [CardColor, CardNum];
    },


    UILanguage() {
        Prompt.txt_title.spriteFrame = PublicSetUp.GameText.getSpriteFrame("txt_chooseColor");
        Prompt.txt_define.spriteFrame = PublicSetUp.GameText.getSpriteFrame("txt_chooseColor_define");
        Prompt.txt_cancel.spriteFrame = PublicSetUp.GameText.getSpriteFrame("txt_chooseColor_cancel");

    }

    // update (dt) {},
});
