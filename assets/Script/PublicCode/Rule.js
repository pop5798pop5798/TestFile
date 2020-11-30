let Rule;
let HttpRequest;

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        Rule = this;
        this.Mask = cc.find("Mask", this.node);
        this.View = cc.find("View", this.node);

        this.wView_rule = cc.find("View/wView_rule", this.node).getComponent(cc.WebView);
        this.btn_Close = cc.find("View/btn_Close", this.node);
        this.btn_Close.on(cc.Node.EventType.TOUCH_END, this.onTouchend, this);
    },

    start() {
        this.initState();
    },

    // update (dt) {},

    initState() {
        this.Mask.active = false;
        this.View.active = false;
    },

    open() {
        this.Mask.active = true;
        this.View.active = true;

        let _od = { game_id: 1016 };

        if (window.ruleURL && window.ruleURL != "")
            this.JavaScriptAJAXRequest(window.ruleURL, _od, 'POST');
        else
            this.JavaScriptAJAXRequest('http://45.77.253.199:7720/web/js/ajax/GetGameIntro.php', _od, 'POST');
    },

    // 呼叫
    // sUrl = 網址
    // oData = 傳入資料
    // sType = 傳輸方式 ex: GET/POST
    // bTF = 是否同步, true 預設非同步, false 同步
    JavaScriptAJAXRequest(sUrl, oData, sType, bTF = true) {
        if (sUrl == '') return false;
        if (oData == '') return false;
        if (sType == '') return false;
        bTF = bTF === false ? false : true;

        if (window.XMLHttpRequest) {
            HttpRequest = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            HttpRequest = new ActiveXObject('Microsoft.XMLHTTP');
        }

        // 回傳
        HttpRequest.onreadystatechange = function (e) {
            if (HttpRequest.readyState === XMLHttpRequest.DONE) {
                Rule.JavaScriptAJAXResponse(HttpRequest.response);
            } else {
                switch (HttpRequest.readyState) {
                    case 0:
                        console.log('還沒開始');
                        break;
                    case 1:
                        console.log('讀取中');
                        break;
                    case 2:
                        console.log('已讀取');
                        break;
                    case 3:
                        console.log('資訊交換中');
                        break;
                }
            }
        };

        // 整理傳出參數
        var sSend = '';
        if (oData != '') {
            let i = 0;
            for (let k in oData) {
                sSend += (i == 0 ? '' : '&') + k + '=' + oData[k];
                ++i;
            }
        }

        HttpRequest.open(sType, sUrl, bTF);
        HttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        HttpRequest.send(sSend);
    },

    // 收到回傳資料
    JavaScriptAJAXResponse(_o) {
        let o = JSON.parse(_o);
        if (o.Code == 1) {
            this.wView_rule.url = o.Data.game_intro_url;
        }
    },

    onTouchend(e) {
        this.initState();
    },
});
