let PublicSetUp = require('PublicSetUp');
let Enum = require('Enum');
let ResultFontWin = null;
let ResultFontLose = null;

let PK_Scene = [-315, 315];
let Seat_X = [-143, 526, 450, -450, -526];
let Seat_Y = [-173, -105, 166, 166, -105];

let GameFight_js;
let Player;
let aniPlayerX = [-570, 960, -50, -970];
let aniPlayerY = [-600, 20, 580, 20];

let aniPlayerLX = [-570, 330, -50, -450];
let aniPlayerLY = [-290, 20, 160, 20];

let parentNode;

cc.Class({
    extends: cc.Component,

    properties: {

        ResultFont: {
            default: [],
            type: [cc.Font],
        },

    },

    onLoad() {
        GameFight_js = cc.find("Canvas/GamePanel").getComponent("GameFightScene");

        Player = this;
        parentNode = cc.find("Canvas/GamePanel/sub_Players");
        this.txt_name = cc.find("txt_name", this.node).getComponent(cc.Label);
        //this.txt_point = cc.find("txt_point", this.node).getComponent(cc.Label);

        this.pic_avatar = cc.find("ava_mask/pic_avatar", this.node).getComponent(cc.Sprite);
        this.ani_processbar = cc.find("ani_processbar", this.node).getComponent(cc.Animation);

        this.result = cc.find("pic_result", this.node);
        this.txt_result = cc.find("pic_result", this.node).getComponent(cc.Sprite);
        this.ani_result = cc.find("pic_result", this.node).getComponent(cc.Animation);
        //this.txt_result = cc.find("pic_result/result_txt", this.node).getComponent(cc.Label);

        this.ani_pk = this.node.getComponent(cc.Animation);
        this.node_pk = cc.find("pic_pk", this.node);
        this.poker_num = cc.find("poker_num/txt_num", this.node).getComponent(cc.Label);

        this.think = {};
        this.think.node = cc.find("think/pic_think", this.node);
        this.think.txt = cc.find("txt_think", this.think.node).getComponent(cc.Label);

        //結算分數
        this.result.txt = cc.find("txt_result", this.node).getComponent(cc.Label);

        this.ani_processbar.on(cc.Animation.EventType.FINISHED, this.onFinished_Processbar, this);
        //this.ani_pk.on(cc.Animation.EventType.FINISHED, this.onFinished_PK, this);

        // this.PK_Scene_Ani = cc.find("Canvas/GamePanel/Animation/ani_PK").getComponent(cc.Animation);
    },

    start() {

    },
    restart(_p) {
        this.node.x = aniPlayerX[_p];
        this.node.y = aniPlayerY[_p];
        this.initState();
        this.close();
        //this.think.txt.spriteFrame = PublicSetUp.GameText.getSpriteFrame("txt_think");

    },
    initState() {
        this.node.stopAllActions();
        this.unscheduleAllCallbacks();
        this.clear();
        this.ani_processbar.stop();
        this.ani_processbar.node.opacity = 0;
        this.ani_result.stop();
        this.node.parent = parentNode;
        this.think.node.opacity = 0; //關閉思考中
        this.result.opacity = 0;//閉閉結算
        this.think.txt.string = Enum.Message.THINK;

        //重置結算分數
        this.result.txt.string = "";
        this.result.txt.node.opacity = 0;
        this.result.txt.node.setPosition(5, 40);
    },
    ResetPosition(_Seat) {
        this.node.setPosition(Seat_X[_Seat], Seat_Y[_Seat]);
        this.node.parent = parentNode;
    },
    //顯示牌數量 num:加總數量
    addCardView(num) {
        this.poker_num.string = parseInt(this.poker_num.string) + num;
    },
    //切畫面顯示卡數量
    adjCardView(_p) {
        this.poker_num.string = parseInt(PublicSetUp.HandPoker[_p].length);
    },
    open() {
        this.node.opacity = 255;
    },

    close() {
        this.node.opacity = 0;
    },

    clear() {
        this.txt_name.string = "";
        //this.txt_point.string = "";
    },
    //設置玩家資料
    setInfo(_n, _p) {
        this.txt_name.string = _n.slice(-8);
        this.poker_num.string = 0;
        //this.txt_point.string = _p;
    },
    //切畫面直接顯示位置
    adjPlayerPostion(_p) {
        this.unscheduleAllCallbacks();
        if (this.playerAni != null)
            this.playerAni.stop();

        this.node.x = aniPlayerLX[_p];
        this.node.y = aniPlayerLY[_p];

    },
    //入場動畫
    aniPlayer(_p) {
        let move = cc.tween().to(1.5, { position: cc.v2(aniPlayerLX[_p], aniPlayerLY[_p]) }, { easing: 'elasticInOut' });
        this.playerAni = cc.tween(this.node).then(move).start();
    }

    ,
    //設置頭像
    setAvatar(_a) {
        this.pic_avatar.spriteFrame = PublicSetUp.Avatar.getSpriteFrames()[_a];
    },

    //設置輸贏數字
    playRanks(_rank) {///贏
        this.result.opacity = 255;//開啟結算
        switch (_rank) {
            case 1:
                this.txt_result.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_result_1st");
                break;
            case 2:
                this.txt_result.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_result_2nd");
                break;
            case 3:
                this.txt_result.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_result_3rd");
                break;
            case 4:
                this.txt_result.spriteFrame = PublicSetUp.GameAtlas.getSpriteFrame("pic_result_4th");
                break;
        }

        this.ani_result.play();
    },

    //設置結算分數、位移
    playResult(_p) {
        //結算分數
        if (_p > 0) {
            this.result.txt.font = this.ResultFont[0];
            this.result.txt.string = "+" + _p;
        } else {
            this.result.txt.font = this.ResultFont[1];
            this.result.txt.string = _p
        }
        //顯示
        this.result.txt.node.opacity = 255;
        //位移
        this.result.txt.node.runAction(cc.moveTo(0.2, cc.v2(5, 65)));
    },

    playWin() {
        this.ani_win.node.opacity = 255;
        this.ani_win.play();
    },

    playGiveUp() {
        this.node.opacity = 200;
    },

    playCountdown(_t = 0) {
        this.unscheduleAllCallbacks();
        this.think.node.opacity = 255;//開啟思考圖
        this.Dot = "";
        this.schedule(function () {
            if (this.Dot == "" || this.Dot == "...") {
                this.Dot = ".";
            } else if (this.Dot == ".") {
                this.Dot = "..";
            } else if (this.Dot == "..") {
                this.Dot = "...";
            }

            this.think.txt.string = Enum.Message.THINK + this.Dot;
        }, 0.5);

        this.ani_processbar.node.opacity = 255;
        this.ani_processbar.play("ani_processbar", _t);
    },

    onFinished_Processbar() {
        this.think.node.opacity = 0;//關閉思考圖
        this.ani_processbar.node.opacity = 0;
        this.ani_processbar.stop();
    },

    SetPlayerPoint(_p) {
        //this.txt_point.string = _p;
    },


    // update (dt) {},
});
