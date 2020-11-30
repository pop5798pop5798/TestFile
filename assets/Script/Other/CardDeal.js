let CardSetR = [-33, 0, 52, 70];//發牌角度

let PublicSetUp = require("PublicSetUp");
let GameFight;
let DealCard = {};
let CardSpeed = 0.2;
let CardFire;
let BackCard;
let CardView;
let Poker = [];
let LastCard;
let newCard;
let nowNum = 0;

let CardChildren = [];

//顯示剩餘張數
let poker_num = {};

cc.Class({
    extends: cc.Component,

    properties: {
        BackPoker: {
            default: null,
            type: cc.SpriteFrame,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        BackCard = cc.find("BackCard", this.node);
        CardView = cc.find("View", this.node);
        GameFight = cc.find("Canvas/GamePanel").getComponent("GameFightScene");
        for (let i = 0; i < 4; i++) {
            Poker[i] = cc.find("Canvas/GamePanel/Card/PlayerPoker_" + i).getComponent("PokerCard");
        }

        poker_num.node = cc.find("poker_num", this.node);
        poker_num.txt_num = cc.find("txt_num", poker_num.node).getComponent(cc.Label);

    },

    start() {
        this.initCardNum();
    },

    initCardNum() {
        nowNum = 0;
        poker_num.node.opacity = 0;
        poker_num.txt_num.string = 0;
        CardChildren = [];
    },

    setCardNum(_num) {
        poker_num.node.opacity = 255;
        nowNum = _num;
        poker_num.txt_num.string = nowNum;
        this.lessCard();
    },

    runCardNumCs2(_num) {
        nowNum = _num;

        let _all = 180;
        poker_num.node.opacity = 255;
        poker_num.txt_num.string = _all;

        this.schedule(function () {
            if (_all == _num) {
                this.lessCard();
                return;
            }
            _all -= 4;

            poker_num.txt_num.string = _all;
        }, 0.5, 5, 0.5)
    },

    runCardNum(_num) {
        this.schedule(function () {
            if (nowNum == _num) {
                this.lessCard();
                return;
            }
            nowNum--
            poker_num.txt_num.string = nowNum;
        }, 0.3, 5, 0.5)
    },

    //重置牌組 _c:牌組量
    initCard(_c) {
        BackCard.removeAllChildren();

        for (let i = 0; i < _c; i++) {
            let node = new cc.Node("Sprite")
            let sp = node.addComponent(cc.Sprite);
            sp.spriteFrame = this.BackPoker;
            node.skewX = -10;
            node.scaleX = 1.3;
            node.x = 0.1 * i;
            node.y = 2 * i + 24;
            BackCard.addChild(node);
        }
        let i = 0
        this.schedule(function () {

            let move = cc.tween().to(0.03, { position: cc.v2(0.1 * i, 2 * i) });
            cc.tween(BackCard.children[i]).then(move).start();
            i++;

        }, 0.03, _c);

        CardChildren = BackCard.children;
        // cc.log(BackCard.children);
    },

    //切畫面牌組
    adjCard(_c) {
        BackCard.removeAllChildren();

        for (let i = 0; i < _c; i++) {
            let node = new cc.Node("Sprite")
            let sp = node.addComponent(cc.Sprite);
            sp.spriteFrame = this.BackPoker;
            node.skewX = -10;
            node.scaleX = 1.3;
            node.x = 0.1 * i;
            node.y = 2 * i;
            BackCard.addChild(node);
        }

    },
    //刪除牌組
    delCard() {
        BackCard.removeAllChildren();
    },

    //減少牌組
    lessCard() {
        let _n = CardChildren.length - 1;
        // cc.log("lessCard", nowNum, _n);

        if ((nowNum / 10) <= _n) {
            // cc.log("有進來")
            CardChildren.pop();
            // cc.log(CardChildren);
        }

    },


    oneCardRun(_SeatsDeal) {
        let count = 0;

        //輪流發
        /*let i = 0;
        this.schedule(function(){
            if(i > 3)
            {
                count++;
                i = 0;
            }
            this.runDealCard(count,i);
            /*for (let i = 0; i < 4; i++) {
                this.runDealCard(count,i);
            }*
            i++;
        },0.6,19);*/
        //一起發
        //PublicSetUp.GameGs2
        let Deal = _SeatsDeal;
        this.schedule(function () {
            for (let i = 0; i < 4; i++) {
                //新增顯示牌 i:第一次發牌用(輪) player:玩家位置 _poker:牌number
                Poker[i].addCard(count, i, Deal[count]);
                //動畫
                this.runDealCard(i, Deal[count]);

            }
            count++;
        }, 0.5, 4);

    },
    adjCloseSchedule() {
        this.unscheduleAllCallbacks();
    },
    //切分頁 直接顯示牌
    adjCardRun(_SeatsDeal) {
        this.unscheduleAllCallbacks();
        //重置刪除全部手牌
        for (let i = 0; i < 4; i++) {
            Poker[i].initCard();
        }

        let Deal = _SeatsDeal;
        for (let c = 0; c < 5; c++) {
            for (let i = 0; i < 4; i++) {
                //新增顯示牌 i:第一次發牌用(輪) player:玩家位置 _poker:牌number
                Poker[i].addCard(c, i, Deal[c]);
            }
        }


    },
    //發牌動畫 count:第幾張 player:玩家位置 _poker:牌number
    runDealCard(player, _poker) {
        //this.unscheduleAllCallbacks();
        let LastCard = BackCard.children[BackCard.children.length - 1];
        let newCard = new cc.Node("Sprite")
        //增加Sprite
        let sp = newCard.addComponent(cc.Sprite);
        newCard.setPosition(LastCard.x, LastCard.y);
        newCard.scaleX = (player == 0) ? 0.5 : 1.3;
        newCard.scaleY = (player == 0) ? 0.5 : 1;

        let move = cc.tween().to(0.25, { position: cc.v2(PublicSetUp.PositionX[player], PublicSetUp.PositionY[player]) }, { easing: 'smooth' });
        let _scale = 1;

        let scale = cc.tween().to(0.21, { scale: _scale });
        //設定牌面
        if (player == 0) {
            let Card = GameFight.CardCheck(_poker);//判斷手牌
            sp.spriteFrame = Card;
        } else sp.spriteFrame = this.BackPoker;



        cc.tween(newCard).then(move).call(() => {
            newCard.opacity = 0;
            newCard.destroy();
        }).start();

        newCard.angle = CardSetR[player];
        //newCard.skewX = 0;

        cc.tween(newCard).to(0.23, { angle: 0 }).call(() => {
            //newCard.angle = 0;
            //newCard.skewX = 0;
        }).start();


        cc.tween(newCard).then(scale).start();


        BackCard.addChild(newCard);



    }

    // update (dt) {},
});
