// 全cocos共用參數
module.exports = {
    GameVer: "Ver.0.0.5",
    ServerVer: "",
    VPoints: 0, // 玩家點數

    DesignWidth: 1280,
    DesignHeight: 720,

    musicPoint: 0.5,
    audioPoint: 0.5,
    aio_click: null,
    aio_game: [cc.AudioClip],

    // 語系
    // Language: "th-TH",
    // Language: "zh-TW",
    Language: "zh-CN",
    // Language: "en-US",
    LanguageNo: 0,

    //多國語系 - 文字
    public_msg: {},
    FightGame009_msg: {},

    //LOG開關
    isLog: true,

    //SERVER
    SystemClose: false,

    //指定牌型
    OrderPublic: [],

    //遊戲公告
    GameAnnounce: {},
    Announce: {},

    //撲克牌卡牌圖
    poker_Club: [],
    poker_Diamond: [],
    poker_Heart: [],
    poker_Spade: [],
    poker_Color: null,
    poker_Back: null,
    poker_Grey: null,

    //頭像圖片
    Avatar: [],
    MyAvatar: -1,

    //玩家資訊
    VPoints: 0,
    SelfSeat: 0, // 本端座位
    Seat: [], // 相對位置
    PositionX: [-466, -85, -465, -867],
    PositionY: [-165, 304, 448, 304],
    //玩家卡片數
    PlayerCard: [],

    //GameFight物件
    LoginServer: {},
    GetLobbyInfo: {},
    Ante: 0,
    LowLimit: 0,
    WaitGameGroup: {},
    CancelWait: {},
    ReturnLobby: {},
    GameTableInfo: {},
    History: {},
    Feedback: {},
    EditBoxString: "",
    OrderHand: "",
    Game_Chip: [],

    BtnAtlas: [],
    GameAtlas: [],
    GameText: [],
    Ani_Start: [],

    GameVoice: {
        MyVoice: -1,
        VoiceArr: [0, 0, 0, 0, 0],
        Men: [],
        Women: [],
    },

    JoinGame: false,

    //場景資訊
    GameGs0: {},
    GameGs1: {},
    GameGs2: {},
    GameGs3: {},
    GameGs4: {},
    GameGs5: {},
    GameGs6: {},

    nowState: "",
    date_GameGs: 0,//時間

    //當前出牌順序方向：0(順時鐘) / 1(逆時鐘)
    //預設：0
    Turn: 0,

    isSendReLobby: false,
    isOpenCard: false,
    isFocus: true,
    KeepGame: false,
    //設定的卡片
    SelectCard: null,
    //設定的顏色
    SelectColor: null,
    //整個手牌
    HandPoker: [],
    //主畫面手牌
    MainHandPoker: null,
    //當前Table丟的卡片
    CurrentThrow: null,
    //進入房間等級
    RoomLevel: null,
    DemoCard: [0, 5, 6, 7, 8],

    //Demo用參數
    // DemoName: "user_0",
    // DemoVPoint: 50000,
    // DemoBet: [10, 50, 100],
    // DemoAnte: 0,

    // 延遲檢測
    _nowTime: 0,
    ping: 0,

    isPressExit: false,
    isGameFinish: false,
    isGotoGame: false,
    Countdown: 0,
    TableAnte: 0,

    avatar: [cc.SpriteFrame],
    avatar_none: null,
};