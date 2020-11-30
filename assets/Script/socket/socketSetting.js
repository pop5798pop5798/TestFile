//let data      = require('USD');
//let Game_data = require('Game_CNY');
module.exports ={
    serverSfs:{},//Socket連線用
    ClientSetObject:{},//客端底層所有參數存放位置
    setboolean:false,//讓設定直指設定一次
    ServerReturnData:{},//Server回傳所有參數
    init(language){
        //data      = require(language);
        //Game_data = require('Game_'+language);
    },
    gt(option){//各遊戲語系
        //return Game_data[option];
    },
    t(option){//公版
       // return data[option];
    }
};