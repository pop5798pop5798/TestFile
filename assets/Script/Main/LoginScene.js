let PublicSetUp = require('PublicSetUp');
let Enum = require('Enum');

let LoginScene = {};
let Socket;
let Common;
let Message;
let SysMessage;

let DesignWidth = 1280;
let DesignHeight = 720;
let ProgressLength = 610;

let isPreLoadComp = false;
let isLoginServer = false;
let isGetLobbyInfo = false;
let isLoadFail = false;
let LoadVoice = false;

let GameID = "";
let CurLoadRes = 0;

let loadText = false;
let loadEnd = false;
let LoadAvatar = false;
let LoadGameAtlas = false;
let LoadPoker = false;


cc.Class({
    extends: cc.Component,

    properties: {
        Tsv_Language: {
            default: null,
            type: cc.TextAsset,
        },
        PokDeng_Language: {
            default: null,
            type: cc.TextAsset,
        },
        Logo: {
            default: [],
            type: cc.SpriteFrame,
        },
    },

    onLoad: function () {
        //Socketcommon
        Socket = cc.find("Socketcommon").getComponent("socket");
        Common = cc.find("Socketcommon").getComponent("Common");
        cc.game.addPersistRootNode(cc.find("Socketcommon"));


        LoginScene.self = this;
        LoginScene.LoadingMask = cc.find("Canvas/LoginScene/loadingSence/pic_Loadingbar_BG/LoadingMask");   //載入條遮罩
        LoginScene.loadingSence = cc.find("Canvas/LoginScene/loadingSence");
        this.UILanguage(); // 載入語系
        this.loadResource();
    },

    start() {
        LoginScene.loadingSence.active = true;
        LoginScene.LoadingMask.width = 0;

        Common.setNowScene(this);
        //直接呼叫登入大廳
        Socket.GameSocketSet(9);
        //顯示載入中
        GameID = Enum.Message['1016'];
        this.preLoadScene();
    },

    UILanguage() {
        CurLoadRes = 0;
        let _index;
        if (window.lang) PublicSetUp.Language = window.lang;

        switch (PublicSetUp.Language) {
            case 'th-TH':
                _index = 3;
                PublicSetUp.LanguageNo = 4;
                break;
            case 'zh-TW':
                _index = 2;
                PublicSetUp.LanguageNo = 3;
                break;
            case 'zh-CN':
                _index = 1;
                PublicSetUp.LanguageNo = 2;
                break;
            case 'en-US':
                _index = 0;
                PublicSetUp.LanguageNo = 1;
                break;
            default:
                break;
        }

        // 載共用文字
        let language = this.tsvToObject(this.Tsv_Language.text);
        let arr_key = Object.keys(language[_index]);
        for (let i = 0; i < arr_key.length; i++) {
            Enum.Message[arr_key[i]] = language[_index][arr_key[i]];
        }
        // 載最後一張專用文字
        let languagePD = this.tsvToObject(this.PokDeng_Language.text);
        let arr_keyPD = Object.keys(languagePD[_index]);
        for (let i = 0; i < arr_keyPD.length; i++) {
            Enum.Message[arr_keyPD[i]] = languagePD[_index][arr_keyPD[i]];
        }

    },
    loadResource() {
        //文字圖
        cc.loader.loadRes("Language/" + PublicSetUp.Language + "/Text", cc.SpriteAtlas, function (err, atlas) {
            if (err) {
                cc.error(err);
                return;
            }
            PublicSetUp.GameText = atlas;
            loadText = true;
        });

        //撲克牌圖面
        cc.loader.loadRes("Game/Card", cc.SpriteAtlas, function (err, atlas) { // 梅花 方塊 紅心 黑桃
            if (err) {
                cc.error(err);
                return;
            }

            PublicSetUp.poker_Back = atlas.getSpriteFrame("pic_poker_back");    // 牌背
            //PublicSetUp.poker_Grey = atlas.getSpriteFrames()[40];   // 灰階

            for (let i = 1; i < 13; i++) {
                if (i > 9) {
                    switch (i) {
                        case 10://轉向卡
                            PublicSetUp.poker_Club[i - 1] = atlas.getSpriteFrame("pic_poker_G_turn");
                            PublicSetUp.poker_Diamond[i - 1] = atlas.getSpriteFrame("pic_poker_Y_turn");
                            PublicSetUp.poker_Heart[i - 1] = atlas.getSpriteFrame("pic_poker_R_turn");
                            PublicSetUp.poker_Spade[i - 1] = atlas.getSpriteFrame("pic_poker_B_turn");
                            break
                        case 11://pass卡
                            PublicSetUp.poker_Club[i - 1] = atlas.getSpriteFrame("pic_poker_G_pass");
                            PublicSetUp.poker_Diamond[i - 1] = atlas.getSpriteFrame("pic_poker_Y_pass");
                            PublicSetUp.poker_Heart[i - 1] = atlas.getSpriteFrame("pic_poker_R_pass");
                            PublicSetUp.poker_Spade[i - 1] = atlas.getSpriteFrame("pic_poker_B_pass");
                            break
                        case 12://換色卡
                            PublicSetUp.poker_Color = atlas.getSpriteFrame("pic_poker_ColorChange");
                            break;

                    }

                }
                else //數字卡
                {
                    PublicSetUp.poker_Club[i - 1] = atlas.getSpriteFrame("pic_poker_G_0" + i);
                    PublicSetUp.poker_Diamond[i - 1] = atlas.getSpriteFrame("pic_poker_Y_0" + i);
                    PublicSetUp.poker_Heart[i - 1] = atlas.getSpriteFrame("pic_poker_R_0" + i);
                    PublicSetUp.poker_Spade[i - 1] = atlas.getSpriteFrame("pic_poker_B_0" + i);
                }

            }
            // cc.log(PublicSetUp.poker_Club);
            // cc.log(PublicSetUp.poker_Diamond);
            // cc.log(PublicSetUp.poker_Heart);
            // cc.log(PublicSetUp.poker_Spade);
            // cc.log("撲克牌讀取完畢");
            LoadPoker = true;
        });

        //玩家頭像
        cc.loader.loadRes("Game/Avatar", cc.SpriteAtlas, function (err, atlas) {
            if (err) {
                cc.error(err);
                return;
            }
            PublicSetUp.Avatar = atlas;

            LoadAvatar = true;
        });
        cc.loader.loadRes("Other/none", cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err);
                return;
            }

            PublicSetUp.avatar_none = spriteFrame;
        });

        //遊戲圖
        cc.loader.loadRes("Game/Game", cc.SpriteAtlas, function (err, atlas) {
            if (err) {
                cc.error(err);
                return;
            }
            PublicSetUp.GameAtlas = atlas;

            LoadGameAtlas = true;
        });
    },

    preLoadScene() {
        //預載大廳資源
        cc.director.preloadScene('Lobby', this.onProgress.bind(this), function (err, res) {
            if (err) {
                if (PublicSetUp.isLog) console.log(err);
                LoginSence.self.setLoadFailMsg();
                return;
            }

            isPreLoadComp = true;
        });
    },

    update: function (dt) {
        if ((cc.view.getFrameSize().width / cc.view.getFrameSize().height) >= (DesignWidth / DesignHeight)) {
            //宽度超出
            var width = cc.view.getFrameSize().width * (DesignHeight / cc.view.getFrameSize().height);
            cc.view.setDesignResolutionSize(width, DesignHeight, cc.ResolutionPolicy.FIXED_HEIGHT);
        } else {
            //高度超出
            var height = cc.view.getFrameSize().height * (DesignWidth / cc.view.getFrameSize().width);
            cc.view.setDesignResolutionSize(DesignWidth, height, cc.ResolutionPolicy.FIXED_WIDTH);
        }

        // if (isGetLobbyInfo && isPreLoadComp && CurLoadRes == ?) {
        if (isLoginServer && isGetLobbyInfo) {
            LoginScene.loadingSence.active = false;

            try {
                window.CocosLoadEnd();
                // if (PublicSetUp.isLog) console.log("Call Adaptive Adjustment Success !");
            } catch (e) {
                // if (PublicSetUp.isLog) console.log("Call Adaptive Adjustment Fail !");
            };

            loadEnd = true;
            cc.director.loadScene('Lobby');
        }
    },

    onProgress(completedCount, totalCount, item) {
        LoginScene.LoadingMask.width = Math.round(ProgressLength * completedCount / totalCount);
    },
    cmd_LoginServer(info){
        isLoginServer = true;

    },
    cmd_GetLobbyInfo(info){
        isGetLobbyInfo = true;

    },
    setPingState() {
    },
    //cmd相關結尾//////////////////////////////////////////

    //切換語系
    LanguageChange() {
        cc.log("LC=", _LC);
        LoginScene.pic_logo.spriteFrame = this.Logo[_LC];
    },

    tsvToObject(tsv) {
        let rows = tsv.split("\n");
        let dict = [];
        let object = {};
        let array = rows.map(function (row) {
            return row.split("\t");
        });

        for (let i = 1; i < array[0].length; i++) {
            for (let j = 0; j < array.length; j++) {
                object[array[j][0]] = array[j][i];
            }
            dict.push(object);
            object = {};
        }
        return dict;
    },
});
