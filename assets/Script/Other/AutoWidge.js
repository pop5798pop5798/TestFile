export const AlignMode = cc.Enum({
    TOP_TOP: 0,
    TOP_BOTTOM: 1,
    BOTTOM_TOP: 2,
    BOTTOM_BOTTOM: 3,
    LEFT_LEFT: 4,
    LEFT_RIGHT: 5,
    RIGHT_LEFT: 6,
    RIGHT_RIGHT: 7,
});

cc.Class({
    extends: cc.Component,

    properties: {
        target: {
            default: null,
            type: cc.Node,
        },
        txt: {
            default: null,
            type: cc.Node,
        },

        alignMode: {
            default: AlignMode.TOP_TOP,
            type: AlignMode,
        },

        distance: {
            default: 0,
            type: cc.Float,
        },
    },

    onLoad() {
        this.t_width = 0;
        this.t_height = 0;
        this.t_left = 0;
        this.t_right = 0;
        this.t_top = 0;
        this.t_bottom = 0;

        this.temp_x = 0;
        this.temp_y = 0;
    },

    start() {
        if (this.target) {
            this.getInfo();
            this.setAlign();
        }
    },

    update(dt) {
        this.getInfo();
        this.setAlign();
    },

    getInfo() {
        if (this.target != null) {
            this.t_width = this.target.width;
            this.t_height = this.target.height;
            this.t_left = this.target.x - this.target.width * this.target.anchorX;
            this.t_right = this.target.x + this.target.width * (1 - this.target.anchorX);
            this.t_top = this.target.y + this.target.height * (1 - this.target.anchorY);
            this.t_bottom = this.target.y - this.target.height * this.target.anchorY;
        } else {

        }
    },

    setAlign() {
        switch (this.alignMode) {
            case AlignMode.TOP_TOP:

                break;
            case AlignMode.TOP_BOTTOM:

                break;
            case AlignMode.BOTTOM_TOP:

                break;
            case AlignMode.BOTTOM_BOTTOM:

                break;
            case AlignMode.LEFT_LEFT:

                break;
            case AlignMode.LEFT_RIGHT:

                break;
            case AlignMode.RIGHT_LEFT:
                if (this.target != null) {
                    this.temp_x = this.t_left + this.distance;
                    this.node.x = this.temp_x - this.node.width * (1 - this.node.anchorX);
                }
                if (this.txt != null) {

                    if (this.txt.getComponent(cc.Label).string == "") {

                    } else {
                        this.node.width = this.txt.width + 30;

                    }
                }
                break;
            case AlignMode.RIGHT_RIGHT:

                break;
        }
    },
});
