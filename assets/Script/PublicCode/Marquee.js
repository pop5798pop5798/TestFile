let Marquee = {};
let WaitTime = 3;

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        Marquee.self = this;
        this.node_mask = this.node.getChildByName("mask");
        this.node_sumtext = cc.find('mask/sumtext', this.node);
        this.node.opacity = 0;

        this.txt_marquee = [];
        let _children = this.node_sumtext.children;
        let _childrenCount = this.node_sumtext.childrenCount;
        this.num_marquee = _childrenCount;
        for(let i=0;i<_childrenCount;i++) this.txt_marquee[i] = _children[i].getComponent(cc.Label);
    },

    start () {
        
    },

    update (dt) {

    },

    initState() {
        this.node.opacity = 0;
        this.unscheduleAllCallbacks();
    },

    clear() {
        this.node_sumtext.x = this.node_mask.width;
        this.node_sumtext.stopAllActions();
        for(let i=0;i<this.txt_marquee.length;i++) this.txt_marquee[i].string = "";
    },
    
    startMove() {
        let _time = this.node_sumtext.width*0.017;
        if(this.node_sumtext.width < this.node_mask.width) _time = this.node_mask.width*0.017;
        else _time = this.node_sumtext.width*0.017;

        let moveAction = cc.sequence(
            cc.moveTo(_time, cc.v2(Marquee.self.node_sumtext.width*(-1), 0)),
            cc.callFunc(Marquee.self.finishMove),
        );

        this.node_sumtext.x = this.node_mask.width;
        this.node_sumtext.runAction(moveAction);
    },

    finishMove() {
        Marquee.self.scheduleOnce(function() {
            Marquee.self.startMove();
        }, WaitTime);
    },

    setMarqueeText(str) {
        this.clear();
        this.node.opacity = 255;
        this.node_sumtext.x = this.node_mask.width;

        let arr = this.chunkString(str, 85);
        for(let i=0;i<arr.length;i++) {
            if(i<10) {
                this.txt_marquee[i].string = arr[i];
            } else break;
        }

        for(let i=0;i<this.num_marquee;i++) {
            this.txt_marquee[i]._forceUpdateRenderData();
            if(i > 0) {
                this.txt_marquee[i].node.x = this.txt_marquee[i-1].node.x + this.txt_marquee[i-1].node.width;
            }
        }
        this.node_sumtext.width = this.txt_marquee[this.num_marquee-1].node.x + this.txt_marquee[this.num_marquee-1].node.width;
        
        this.unscheduleAllCallbacks();
        this.finishMove();
    },

    chunkString(str, length) {
        return str.match(new RegExp('.{1,' + length + '}', 'g'));
    },
});