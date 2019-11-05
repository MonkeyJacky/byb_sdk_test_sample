//飘窗提示
cc.Class({
    extends: cc.Component,

    properties: {
        lbl_tip: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.opacity = 0;
    },

    start () {
        
    },

    show (str) {
        this.lbl_tip.string = str;
        var actTime = 0.2;
        var seq = cc.sequence(
            cc.fadeIn(actTime),
            cc.delayTime(1),
            cc.fadeOut(actTime),
            );
        this.node.opacity = 0;
        this.node.stopAllActions();
        this.node.runAction(seq);
    },
});
