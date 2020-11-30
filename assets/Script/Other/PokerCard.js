let PublicSetUp = require('PublicSetUp');
let CardSetX = [-137.55, -70.55, -3.55, 63.45, 130.45];//攤牌X
let CardSetY = [3.533, 7.617, 11.162, 7.914, -0.721];//攤牌Y
let CardSetR = [7.636, 4.028, 1.087, -5.014, -10.589];//攤牌R

let PokerSetR = [0, -8, 0, 8];

let FireX = [];
let FireY = [];

let PokerArea;
let CardDeal;
let isFire = 0; //是否已發完第一次牌
let GameFight;

//testarray = [1,2,3,4,5]; // test用數據
let Players = [];
let Banner;
let Prompt;
let Prompt12;
let test12 = 0;

cc.Class({
    extends: cc.Component,

    properties: {
        PokerBack: {
            default: null,
            type: cc.SpriteFrame,
        },
        PokerCard: {
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        PokerArea = cc.find("Canvas/GamePanel/Fixed/Area").getComponent("PokerArea");
        CardDeal = cc.find("Canvas/GamePanel/DealCard").getComponent("CardDeal");
        GameFight = cc.find("Canvas/GamePanel").getComponent("GameFightScene");
        //玩家物件
        for (let i = 0; i < 4; i++) {
            Players[i] = {};
            Players[i].node = cc.find("Canvas/GamePanel/sub_Players/player_" + i);
            Players[i].script = cc.find("Canvas/GamePanel/sub_Players/player_" + i).getComponent("Player");
        }

        Banner = cc.find("Canvas/GamePanel/Banner").getComponent("Banner");//Spine Banner動畫
        Prompt = cc.find("Canvas/GamePanel/Prompt").getComponent("Prompt");//提示窗
        Prompt12 = cc.find("Canvas/GamePanel/Prompt12").getComponent("Prompt12");//12張提示窗


    },
    //切畫面顯示手牌
    adjHandCard(_p) {

        let sort = GameFight.SetCardsort(PublicSetUp.HandPoker[_p]);
        PublicSetUp.HandPoker[_p] = sort;

        if (_p == PublicSetUp.SelfSeat) {
            this.node.removeAllChildren();

            if (sort.length > 11) // 超過12張
            {
                this.Check12Card(sort);
            } else {
                sort.forEach(element => {
                    this.MainExtCard(element, 0);
                });

            }

            cc.log("切畫面顯示手牌");
        } else {
            //重置
            for (let i = 0; i < this.node.children.length; i++) this.node.children[i].active = true;

            if (sort.length < 5) {
                for (let i = 0; i < (5 - sort.length); i++) {
                    if (this.node.children[i].active) this.node.children[i].active = false;
                }

            }

            cc.log("切畫面顯示其他人");

        }


        /*for(let i = 0;i < this.node.children.length;i++)
        {
            if(!this.node.children[i].active)
            {
                this.node.children[i].active = true;
            }
        }  */





    },
    //手牌關閉
    HandCardClose() {
        this.node.children.forEach(element => {
            element.color = new cc.Color(139, 139, 139);
            element.y = 0;
            cc.find("pokerLight", element).active = false;
        });
    },

    //手牌開啟
    HandCardOpen() {
        this.node.children.forEach(element => {
            element.color = new cc.Color(255, 255, 255);
            element.y = 0;
            cc.find("pokerLight", element).active = false;
        });
    },

    //檢查那些牌可以出 (主玩家)
    HandCardCheck() {
        let _throw = 0;//可丟數
        this.node.children.forEach(element => {
            let check = this.CheckThrow(element.name);
            if (check) {
                element.color = new cc.Color(255, 255, 255);
                _throw += 1;
            }
            else element.color = new cc.Color(139, 139, 139);
        });

        //測試用，正式版改由Server直接發抽牌給客端
        // this.scheduleOnce(function () {
        //測試用
        // if (test12 < 2) {
        //     GameFight.send_GamePlayCard(0, 0);//3輪 直接抽牌
        //     test12 += 1;
        // }
        //else {
        //     if (_throw == 0) GameFight.send_GamePlayCard(0, 0);//可丟數為0 直接抽牌
        //      }
        // }, 0.5);
    },

    //檢查哪些牌能出 12張
    HandCardCheck12() {
        cc.log("12張檢查");

        let _throw = 0;//可丟數
        let thisNode = this.node.children;

        // cc.log("thisNode", thisNode);

        PublicSetUp.HandPoker[PublicSetUp.SelfSeat].forEach(element => {
            let check = this.CheckThrow(element);//顯查所有手牌編號
            let _a = GameFight.ThrowCardCheck(element);//換算所有手牌花色數字

            for (let i = 0; i < thisNode.length; i++) {
                if (check) {
                    let _b = GameFight.ThrowCardCheck(thisNode[i].name);//比對畫面上顯示的牌

                    // cc.log("_a=", _a, "_b=", _b);

                    if (_b[1] == _a[1]) {//如果兩者數字相等

                        thisNode[i].color = new cc.Color(255, 255, 255);
                        _throw += 1;
                        // cc.log("有進來 ", _throw);
                    } else {
                    }
                }
            }
        });

        //測試用，正式版改由Server直接發抽牌給客端
        // this.scheduleOnce(function () {
        //     if (_throw == 0) GameFight.send_GamePlayCard(0, 0);//可丟數為0 直接抽牌
        // }, 0.5);
    },



    init(_t) {
        this.node.removeAllChildren();

        if (_t == 0)
            this.node.getComponent(cc.Layout).spacingX = -166;
        else
            this.node.getComponent(cc.Layout).spacingX = -86;



    },
    start() {
        //this.init();

    },
    initCard() {
        this.node.removeAllChildren();

    },
    //新增顯示牌 i:第一次發牌用(輪) player:玩家位置 _poker:牌number
    addCard(i, player, _poker) {

        let node;
        if (player == 0) node = this.ExtCard(_poker); // 實體化卡片
        else node = this.ExtCard("back"); // 實體化卡片(非主玩家)

        let sp = node.getComponent(cc.Sprite);
        node.opacity = 0;

        if (player == 0) {
            let Card = GameFight.CardCheck(_poker);//判斷手牌
            sp.spriteFrame = Card;
            /*node.scale = 1.9;
            this.scheduleOnce(function(){
                sp.spriteFrame =  Card;
                node.scale = 1;
            },1)*/

            node.on('touchend', this.onTouchend, this);
        }



        /*let opacity = cc.tween().to(0.26,{opacity:255});    
        cc.tween(node).then(opacity).start();*/
        this.scheduleOnce(function () {
            node.opacity = 255;

        }, 0.27)
        this.node.addChild(node);
        Players[player].script.addCardView(1);//顯示加牌

        let layout = this.node.getComponent(cc.Layout);
        let _SX = (player == 0) ? -100 : -50;

        if (i == 4) this.scheduleOnce(function () { cc.tween(layout).to(0.15, { spacingX: _SX }).start(); this.HandCardClose(); }, 0.5);


        //旋轉角度
        /*if(i == 4 && player != 0)//其他玩家
        {
           
            //let move = cc.tween().to(0.3,{position:cc.v2(this.node.x, 214)});
            //let angle = cc.tween().to(0.3,{angle:PokerSetR[player]});
            //cc.tween(this.node).then(move).start();
            //cc.tween(this.node).then(angle).start();
            //旋轉角度
            //this.reAnglePosition();
            
            
        }
        else if(i == 4 && player == 0) //目前玩家
        {
            let j = 0;
           
            cc.tween(layout).to(0.15,{spacingX:-100}).start();
        }*/

    },
    //刪除其他玩家的牌
    RemoveCard(_p, _card) {

        if (_p == PublicSetUp.SelfSeat) {
            this.node.children.forEach(element => {
                if (element.name == _card) {
                    element.destroy();
                    return true;
                }

            });
        }
        else {
            if (PublicSetUp.HandPoker[_p].length < 5) {
                for (let i = 0; i < this.node.children.length; i++) {
                    if (this.node.children[i].active) {
                        this.node.children[i].active = false;
                        break;
                    }
                }
            }


        }
        // cc.log(this.node.children);


    },
    //加入其他玩家的牌 _count 加入的量
    CardAddView(_p, _count) {

        if (_p != PublicSetUp.SelfSeat) {
            for (let i = 0; i < this.node.children.length; i++) {
                if (!this.node.children[i].active) {
                    this.node.children[i].active = true;
                }
            }
        }
        // cc.log(this.node.children);


    },
    //玩家丟牌 _p:玩家位置 _card:丟出的牌 _color：花色
    ThrowCard(_p, _card, _color) {
        let target;
        if (_p == PublicSetUp.SelfSeat) {
            this.node.children.forEach(element => {
                if (element.name == _card) {
                    target = element;
                    return true;
                }

            });


            //判斷是否小於12張
            let sort = GameFight.SetCardsort(PublicSetUp.HandPoker[PublicSetUp.SelfSeat]);
            PublicSetUp.HandPoker[PublicSetUp.SelfSeat] = sort;
            this.node.removeAllChildren();
            if (sort.length > 11) // 超過12張
            {
                this.Check12Card(sort);
            } else {
                sort.forEach(element => {
                    this.MainExtCard(element, 0);
                });
            }
            // if (PublicSetUp.HandPoker[PublicSetUp.SelfSeat].length < 12) // 超過12張
            // {
            //     //判斷是否小於12張
            //     let sort = GameFight.SetCardsort(PublicSetUp.HandPoker[PublicSetUp.SelfSeat]);
            //     PublicSetUp.HandPoker[PublicSetUp.SelfSeat] = sort;
            //     this.node.removeAllChildren();
            //     sort.forEach(element => {
            //         this.MainExtCard(element, 0);
            //     });
            // }

        }
        PokerArea.AddCard(_card, PublicSetUp.Seat[_p], target);
        Players[PublicSetUp.Seat[_p]].script.addCardView(-1);//當前玩家顯示減牌
        this.RemoveCard(_p, _card);
        GameFight.CardBanner(_card, _color);//確認牌有沒有動畫
        this.HandCardClose();//關閉手牌
    },
    //抽牌 _p:玩家位置 _card:抽到的牌
    FireCard(_p, _cardArray) {
        let i = 0;
        let layout = this.node.getComponent(cc.Layout);
        let _FirstSX = (_p == PublicSetUp.SelfSeat) ? -166 : -86;
        let _LastSX = (_p == PublicSetUp.SelfSeat) ? -100 : -50;;

        //假如是目前玩家 自動動畫
        this.node.children.forEach(element => {
            //element.getComponent(cc.Sprite).spriteFrame = this.PokerBack;
            element.setPosition(0, 0);
            element.angle = 0;
        });

        cc.tween(layout).to(0.12, { spacingX: _FirstSX }).start();//收起來     

        this.schedule(function () {
            CardDeal.runDealCard(PublicSetUp.Seat[_p], _cardArray[i]);

            if (_p == PublicSetUp.SelfSeat) this.MainExtCard(_cardArray[i], 0);  //為主畫面玩家顯示牌

            if (i == _cardArray.length - 1) {
                // cc.log("目前手牌數： " + this.node.children.length);
                // cc.log(this.node.children);

                if (_p == PublicSetUp.SelfSeat) {//自己

                    let sort = GameFight.SetCardsort(PublicSetUp.HandPoker[PublicSetUp.SelfSeat]);
                    PublicSetUp.HandPoker[PublicSetUp.SelfSeat] = sort;
                    this.node.removeAllChildren();

                    if (sort.length > 11) // 超過12張
                    {
                        this.Check12Card(sort);
                    } else {
                        sort.forEach(element => {
                            this.MainExtCard(element, 0);
                        });
                    }
                }
                //顯示加牌
                this.CardAddView(_p, _cardArray.length);

                this.scheduleOnce(function () {
                    cc.tween(layout).to(0.12, { spacingX: _LastSX }).start();//展開
                }, 0.5);
                this.HandCardClose(); //關閉手牌
            }
            Players[PublicSetUp.Seat[_p]].script.addCardView(1);//顯示加牌

            i++;

        }, 0.3, _cardArray.length - 1);

    },
    //判斷12張
    Check12Card(array) {
        cc.log("判斷12張");

        let numList = [];
        array.forEach(element => {
            let CardColor = Math.ceil(element / 11);//花色
            CardColor = CardColor % 4;
            let CardNum = (element % 11 == 0) ? 11 : element % 11;//點數
            if (element > 176 && element < 181) CardNum = 12;//換色卡

            numList.push(CardNum);

        });
        // cc.log("numList", numList);

        var result = {};
        //計算相同卡片數量
        numList.forEach(function (item) {
            result[item] = result[item] ? result[item] + 1 : 1;
        });

        cc.log("result", result);

        //過濾並生成相同卡片的第一張
        let filter = 0;
        let _ca = [];
        Object.keys(result).forEach(element => {
            this.MainExtCard(array[filter], 1);
            filter += result[element];
            _ca.push(result[element]);

        });

        // cc.log("_ca", _ca);

        //顯示卡片數量
        let i = 0;
        this.node.children.forEach(element => {
            this.amount = cc.find("amount", element);
            this.amount.active = true;

            this.txt_amount = cc.find("txt_Amount", this.amount).getComponent(cc.Label);
            this.txt_amount.string = _ca[i];
            i++;
        });
    },
    //生成主玩家卡片 _num:卡片編號 _t:0:不為12張 1:12張
    MainExtCard(num, _t) {
        let card = this.ExtCard(num); // 實體化卡片
        let sp = card.getComponent(cc.Sprite);
        let CheckCard = GameFight.CardCheck(num);//判斷手牌
        sp.spriteFrame = CheckCard;
        if (_t == 0) card.on('touchend', this.onTouchend, this);
        else card.on('touchend', this.on12Touchend, this);

        this.node.addChild(card);

    }

    ,
    //實體化卡片
    ExtCard(num) {
        let card = cc.instantiate(this.PokerCard);
        card.name = num.toString();
        return card;

    }
    ,
    //重整牌角度和位置
    reAnglePosition() {
        let count = 0;
        this.node.children.forEach(element => {
            let move = cc.tween().to(0.3, { position: cc.v2(CardSetX[count], CardSetY[count]) });
            let angle = cc.tween().to(0.3, { angle: CardSetR[count] });
            element.setPosition(CardSetX[count], CardSetY[count]);
            cc.tween(element).then(move).start();
            cc.tween(element).then(angle).start();
            //element.angle = CardSetR[count];
            count++;
        });
    },
    //刪除當前卡片並丟牌
    /*removeCard(name){
        let target = cc.find(name,this.node);
        target.destroy();           
        
        PublicSetUp.SelectCard = null;
     
        PokerArea.AddCard(name,0,target); 
        //light.active = false;
        Players[0].script.addCardView(-1);//當前玩家顯示減牌
        PublicSetUp.isOpenCard = false;//關閉丟牌    
        GameFight.CardBanner(parseInt(name));  
     
    },*/

    //尋找同花色同點數 num:牌值 color:花色
    CheckHandThrow(num, color) {

        cc.log("尋找牌值= ", num, "顏色", color)
        PublicSetUp.HandPoker[PublicSetUp.SelfSeat].forEach(element => {
            let a = GameFight.ThrowCardCheck(element);
            cc.log("尋找的牌 = ", element, "a=", a);

            if (PublicSetUp.CurrentThrow != null) {

                if (num == element && a[0] == color) {
                    cc.log("有找到!!");
                    GameFight.send_GamePlayCard(element, color);
                    return true;
                }
            }
        });
        cc.log("尋找不到要丟的牌");
        return false;
    },
    //判斷能不能出牌 num：牌號  回傳 true:正確 false:錯誤
    CheckThrow(num) {
        let a = GameFight.ThrowCardCheck(num);
        if (PublicSetUp.CurrentThrow != null) {
            if (a[0] == PublicSetUp.CurrentThrow[0] || a[1] == PublicSetUp.CurrentThrow[1] || parseInt(num) > 176) {
                if (a[1] > 9 && a[1] < 12) //pass卡 轉向只能判斷花色
                {
                    if (a[0] != PublicSetUp.CurrentThrow[0]) //花色
                    {
                        // cc.log("錯誤牌");
                        return false;
                    }
                }
                cc.log("正確牌： " + num);
                return true;

            } else {
                // cc.log("錯誤牌");
                return false;
            }
        } else return true;

    }
    ,
    //目前玩家點擊
    onTouchend(e) {

        if (!PublicSetUp.isOpenCard || !this.CheckThrow(e.target.name)) return;

        cc.log("點擊的牌:" + e.target.name);

        let light = cc.find("pokerLight", e.target);
        e.target.parent.children.forEach(element => {
            element.y = 0;
            cc.find("pokerLight", element).active = false;
        });

        e.target.y += 20;
        if (e.target.name > 176 && e.target.name < 181) {
            cc.log("丟出換色卡");//換色卡
            Prompt.open();
        }

        light.active = true;
        if (PublicSetUp.SelectCard == e.target.name) {

            let _cc = GameFight.ThrowCardCheck(e.target.name);
            GameFight.send_GamePlayCard(e.target.name, _cc[0]);

            /* e.target.destroy();
             
         
             PublicSetUp.SelectCard = null;
     
             PokerArea.AddCard(e.target.name,0,e.target); 
             light.active = false;
             Players[0].script.addCardView(-1);//當前玩家顯示減牌
             PublicSetUp.isOpenCard = false;//關閉丟牌    
             GameFight.CardBanner(parseInt(e.target.name));   */

        }

        PublicSetUp.SelectCard = e.target.name;
    },
    //高於12張 點擊效果
    on12Touchend(e) {

        cc.log("12張");

        //判斷是否可以點擊
        let color1 = e.target.color;
        let color2 = new cc.Color(255, 255, 255);
        let canPick = color1.equals(color2);

        // cc.log(color1, color2, canPick);

        if (!PublicSetUp.isOpenCard || !canPick)
            return;

        let light = cc.find("pokerLight", e.target);
        e.target.parent.children.forEach(element => {
            element.y = 0;
            cc.find("pokerLight", element).active = false;
        });

        e.target.y += 20;
        light.active = true;

        cc.log("***12***", e.target.name);

        let _a = GameFight.ThrowCardCheck(e.target.name);

        Prompt12.open(_a);
        /*if(e.target.name > 176 && e.target.name < 181)
        {
            cc.log("丟出換色卡");//換色卡
            Prompt12.open();     
        } */

        PublicSetUp.SelectCard = e.target.name;

    },

    //關閉12張視窗時回復位置與光圈
    Prompt12close() {
        this.node.children.forEach(element => {
            element.y = 0;
            cc.find("pokerLight", element).active = false;
        });
    },

    // update (dt) {},
});
