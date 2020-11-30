let PublicSetUp = require('PublicSetUp');
let PokerR = [-50, -65, 50, 250];//丟牌角度
//let PokerR = [0,132,180,220];//丟牌角度
let PositionX = [0, 390, 12, -390];
let PositionY = [-300, 167, 309, 167];
let SkewY = [15, 10, -15, -10];
let GameFight;

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        GameFight = cc.find("Canvas/GamePanel").getComponent("GameFightScene");
    },

    start() {


    },
    init() {
        this.node.removeAllChildren();
    },
    //切畫面丟牌
    adjAddCard(_poker, _p) {
        let node = new cc.Node(_poker)
        let sp = node.addComponent(cc.Sprite);
        node.scaleX = 0.6;
        node.scaleY = 0.7;
        node.skewY = SkewY[_p];
        node.setPosition(0, 0);
        node.angle = PokerR[_p];

        let Card = GameFight.CardCheck(_poker);//判斷手牌
        sp.spriteFrame = Card;

        this.node.addChild(node);
    },
    //丟牌 _poker:牌number _p:玩家位置
    AddCard(_poker, _p, _t) {
        let node = new cc.Node(_poker)
        let sp = node.addComponent(cc.Sprite);

        //定點丟牌
        if (_p == 0) {
            if (_t == null) {
                // console.log("錯誤---------------------------------------- " + "此玩家無此卡片")
            } else {
                PositionX[0] = _t.x;
                PositionY[0] = _t.y - 319.16;
            }

        } else {
            node.scale = 0.5;
        }
        node.scale = 0.5;
        node.setPosition(PositionX[_p], PositionY[_p]);//player0

        let move = cc.tween().to(0.25, { position: cc.v2(0, 0) });
        let _scaleX = cc.tween().to(0.25, { scaleX: 0.6 });
        let _scaleY = cc.tween().to(0.25, { scaleY: 0.7 });
        let _SkewY = cc.tween().to(0.25, { skewY: SkewY[_p] });
        //let angle = cc.tween().to(0.25,{angle: r});
        node.angle = PokerR[_p]; //player0
        let Card = GameFight.CardCheck(_poker);//判斷手牌
        sp.spriteFrame = Card;
        cc.tween(node).then(move).start();
        cc.tween(node).then(_scaleX).start();
        cc.tween(node).then(_scaleY).start();
        cc.tween(node).then(_SkewY).start();

        //cc.tween(node).then(angle).start();
        this.node.addChild(node);



    }

    // update (dt) {},
});
