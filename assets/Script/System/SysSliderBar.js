let public_SetUp = require('PublicSetUp');

cc.Class({
    extends: cc.Component,

    properties: {
        mask: {
            default: null,
            type: cc.Mask
        },

        txtNum: {
            default: null,
            type: cc.Label
        },

        _width: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let slider = this.getComponent(cc.Slider);

        if (slider == null || this.mask == null) {
            return;
        }

        //音量設定同步
        if (this.node.name == "MusicBar") {
            slider.progress = public_SetUp.musicPoint;
        } else if (this.node.name == "EffectBar") {
            slider.progress = public_SetUp.audioPoint;
        }

        this._width = this.mask.node.width;
        this.mask.node.width = this._width * slider.progress;

        let self = this;
        slider.node.on('slide', function (evern) {
            self.mask.node.width = self._width * slider.progress;

            //修改音樂
            if (this.node.name == "MusicBar") {
                public_SetUp.musicPoint = slider.progress;
                cc.audioEngine.setMusicVolume(public_SetUp.musicPoint);
            } else if (this.node.name == "EffectBar") {
                public_SetUp.audioPoint = slider.progress;
                cc.audioEngine.setEffectsVolume(public_SetUp.audioPoint);
            }

        }, this);
    },

    start() {

    },

    update(dt) {
        this.txtNum.string = parseInt(this.getComponent(cc.Slider).progress * 100);
    },
});
