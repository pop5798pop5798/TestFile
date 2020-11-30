let PublicSetUp = require('PublicSetUp');
let GameOver = {};
let GameFight;
let Socket;
let Player = [];
let Common;

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

    onLoad () {
        Socket = cc.find("Socketcommon").getComponent("socket");
        Common = cc.find("Socketcommon").getComponent("Common");

        GameOver.Mask = cc.find("Mask",this.node);      
        GameOver.View = cc.find("View",this.node); 
       

        GameOver.continue = cc.find("Btn/btn_continue",GameOver.View); 
        GameOver.txt_continue = cc.find("txt_continue",GameOver.continue).getComponent(cc.Sprite); 
        GameOver.continue.on('touchend',this.onTouchend,this);

        GameOver.return = cc.find("Btn/btn_return",GameOver.View); 
        GameOver.txt_return = cc.find("txt_return",GameOver.return).getComponent(cc.Sprite); 
        GameOver.return.on('touchend',this.onTouchend,this);
        GameOver.txt_result = cc.find("txt_result",GameOver.View).getComponent(cc.Sprite);
        GameOver.txt_title = cc.find("pic_result_bg/txt_result_title",GameOver.View).getComponent(cc.Sprite);

        GameFight = cc.find("Canvas/GamePanel").getComponent("GameFightScene");
        for(let i = 0;i < 4;i++)
        {
            Player[i] = {};
            Player[i].node = cc.find("player_"+i,GameOver.View);
            Player[i].txt_order = cc.find("pic_order_bg/txt_order",Player[i].node).getComponent(cc.Sprite);
            Player[i].node_name = cc.find("txt_name",Player[i].node);
            Player[i].txt_name = cc.find("txt_name",Player[i].node).getComponent(cc.Label);
            Player[i].txt_win = cc.find("txt_win",Player[i].node).getComponent(cc.Label);
        }

        


    },

    start () {
        this.node.x = 0;
        this.node.y = 1000;
        this.UILanguage();
    },
    close(){
        GameOver.View.active = false;
        GameOver.Mask.active = false;
        this.node.x = 0;
        this.node.y = 1000;
    },
    open() {
        GameOver.Mask.active = true;
        GameOver.View.active = true;
        let move = cc.tween().to(1.5,{position: cc.v2(0,0)},{ easing: 'elasticInOut'});
        cc.tween(this.node).then(move).start();
    },
    setResult(_d){
        this.open();
       
        for(let i = 0;i < 4;i++)
        {
            let winlose =this.roundDecimal(parseFloat(_d.SeatWinlose[i]),0);
            if(i == PublicSetUp.SelfSeat)
            {                
                Player[_d.SeatRanks[i] - 1].txt_name.string = PublicSetUp.LoginServer.NickName;
                Player[_d.SeatRanks[i] - 1].node_name.color = cc.color(0,255,255);

            }else{
                
                Player[_d.SeatRanks[i] - 1].txt_name.string = Common.getConcealAccount(PublicSetUp.GameTableInfo.SeatName[i]);
            }
            
            Player[_d.SeatRanks[i] - 1].txt_win.string = (winlose > 0)?"+"+winlose:winlose;
        }

    },
    roundDecimal(val, precision) {
        return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
    }
    ,
    onTouchend(e){
        switch(e.target.name)
        {
            case "btn_continue":
                GameFight.KeepGame();

                break;
            case "btn_return":
                this.send_ReturnLobby();
                break;

        }

    },
    send_ReturnLobby() {

        if (PublicSetUp.isGameFinish) {
            cc.director.loadScene("Lobby");
            PublicSetUp.isGameFinish = false;
        } else {
            var config = {};
            config.Cmd = "ReturnLobby";
            config.Data = {};

            console.log("send_ReturnLobby: ", JSON.stringify(config));
            Socket.WebonSend(JSON.stringify(config));
            // Message.showmessage(PublicSetUp.public_msg[_LC].EXITLATER, 2);

            PublicSetUp.isSendReLobby = true;
        }
        //this.start();
    },
    UILanguage(){
        for(let i = 1;i < 5;i++)
        {
            Player[i-1].txt_order.spriteFrame = PublicSetUp.GameText.getSpriteFrame("txt_order_" + i);
        } 
        GameOver.txt_result.spriteFrame = PublicSetUp.GameText.getSpriteFrame("txt_result");
        GameOver.txt_title.spriteFrame = PublicSetUp.GameText.getSpriteFrame("txt_result_title");
        GameOver.txt_continue.spriteFrame = PublicSetUp.GameText.getSpriteFrame("txt_result_continue"); 

        GameOver.txt_return.spriteFrame = PublicSetUp.GameText.getSpriteFrame("txt_result_return"); 

    }

    // update (dt) {},
});
