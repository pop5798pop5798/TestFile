export const GameScene = {
    LOBBY: 0,
    PLAYING: 1,
    GAME_GS0: 2,
    GAME_GS1: 3,
    GAME_GS2: 4,
    GAME_GS3: 5,
    GAME_GS4: 6,
    GAME_GS5: 7,
    GAME_GS6: 8,
    GAME_GS7: 9,
};

export const Message = {
    SELECT: "請選擇出牌",
    WAIT: "等待配桌中",
    WAITSUCCESS: "確認座位",
    WAITFAIL: "匹配失敗 請重新匹配",
    STARTFAIL: "技術上發生問題,請聯繫客服 謝謝!!",
    WRITEFAIL: "帳務寫入失敗",
    NENMONEY: "您的金額低於最小攜入金額,匹配失敗",
    T2LOBBY: "遊戲進行中，請稍後離開",
    LTINFO: "載入桌資訊",
    NONEHIS: "尚無歷史紀錄",
    FBFAIL: "發送回饋意見失敗",
    FBSUCCESS: "發送回饋意見成功",
    SHUTDOWN: "伺服器即將維護",
    DISCONNECT: "連線錯誤，請確認連線狀態",
    KICK: "技術上發生問題,此局已解散",
};

export const Game = {
    SELECT: "技術上發生問題,請選擇出牌",
};

cc.Class({ extends: cc.Component });
