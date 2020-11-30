let PublicSetUp = require('PublicSetUp');
let Video = {};
let Common;

cc.Class({
    extends: cc.Component,

    statics: {
    },

    properties: {

    },

    onLoad() {
        Video.self = this;
        Video.Command = [];
        this.step = 0;
    },

    start() {
        Common = cc.find("Socketcommon").getComponent("Common");
    },

    getDataByToken(token) {
        let xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                if (xhr.responseText == "") {
                    console.log("Call Http Fail !");
                } else {
                    console.log(xhr);
                    let _res = JSON.parse(xhr.responseText);

                    if (_res.result_code == 1) {
                        let _content = _res.data.content.split("\n");
                        for (let i = 0; i < _content.length; i++) {
                            Video.Command[i] = _content[i].split("@");
                        }

                        Video.self.WebToGame(0);
                        Video.self.WebToGame(1);
                        this.step = 2;
                    } else {
                        // Err
                    }
                }
            }
        };

        if (window.video) {
            xhr.open('POST', window.video, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.timeout = 8000; // 8 seconds for timeout
            xhr.send(token);
        }
    },

    runVideo() {
        let _json = {};//Server回傳所有參數
        _json = JSON.parse(Video.Command[this.step][1]);
        let cmd = _json.Cmd;//連線封包代號
        let data = _json.Data;
        Common.WebToGame(cmd, data);
        console.log(cmd + ": ", data);

        if (this.step < Video.Command.length - 2) {
            this.scheduleOnce(function () {
                this.step++;
                this.runVideo();
            }, Video.Command[this.step + 1][0] - Video.Command[this.step][0]);
        }
    },

    WebToGame(step) {
        let _json = {};//Server回傳所有參數
        _json = JSON.parse(Video.Command[step][1]);
        let cmd = _json.Cmd;//連線封包代號
        let data = _json.Data;

        Common.WebToGame(cmd, data);
    },

    update: function (dt) {

    },
});