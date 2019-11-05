// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        lbl_player: cc.Label,
        lbl_score: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.lbl_player.string = "";
        this.lbl_score.string = "";
    },

    start () {

    },

    // update (dt) {},

    setScore (score) {
        this.lbl_score.string = "得分：" + score;
    },

    setPlayerInfo(nick, id) {
        this.lbl_player.string = "玩家：" + nick + " ID:" + id;
    },

    clearUI () {
        this.lbl_player.string = "";
        this.lbl_score.string = "";
    },

    enablePlayerInfo(enable) {
        this.lbl_player.node.active = enable;
    },

    enableScore(enable) {
        this.lbl_score.node.active = enable;
    },
    
});
