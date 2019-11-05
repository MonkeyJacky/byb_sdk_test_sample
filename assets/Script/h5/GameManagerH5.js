require("HttpMng");
require("HttpUtil");
require("Utils");

var Hud = require("Hud");
var Bird = require('Bird');
var Ground = require('Ground');
var Sky = require('Sky');
var PipeManager = require('PipeManager');
var Foreground = require('Foreground');
var GameState = {
  START: 0,     // 游戏开始前
  PLAYING: 1,   // 游戏进行中
  END: 2,       // 游戏结束后
  LOGIN: 3,
};
var FloatingTip = require('FloatingTip');

cc.Class({
  extends: cc.Component,

  properties: {
    bird: Bird,           // 小鸟
    ground: Ground,       // 地面
    sky: Sky,             // 天空
    foreground: Foreground,      // 前景
    menu: cc.Node,        // 菜单节点
    pipeMng: PipeManager, // 管道管理类
    title: cc.Node,       // 标题
    store: cc.Node,       // 商城
    tip: FloatingTip,
    hud: Hud,
  },

  initConfig: function () {
    // cc.debug.setDisplayStats(true); // 显示fps
  },

  onLoad: function () {
    this._BYBApiInit();
    this.initConfig();
    this.pipeMng.init(this, this._passCall);
    this.toggleGameState(GameState.START);
    this.node.on('touchstart', function (event) { // 监听触摸开始事件
      if(this.currState === GameState.PLAYING ){
        this.bird.onJump();
      }
    }, this);

    BYBApi.Notification.on("ThemeChange", this._onThemeChange, this);
  },

  onDestroy: function () {
    BYBApi.Notification.off("ThemeChange", this._onThemeChange, this);
  },

  _BYBApiInit() {
    var _this = this;
    BYBApi.init(9);

    var callback = function (data) {
      if (data != null) {
        if (data.code == 0) {
          //OpenID nick IsActived
          _this.hud.setPlayerInfo(data.data.nick, data.data.OpenID);
        }
      }
    };
    HttpMng.userInfoReq(BYBApi.getCode(), BYBApi.getAccessToken(), callback);
  },

  _onThemeChange: function (data) {
    this.pipeMng._changeTheme(data);
    this.sky._changeTheme(data.background);
    this.foreground._changeTheme(data.foreground);
  },

  /**
   * 切换游戏状态
   * @param state
   */
  toggleGameState: function (state) {
    this.currState = state;
    switch (this.currState) {
      case GameState.START:
        this.title.active = true;
        this.menu.active = true;
        this.hud.enablePlayerInfo(true);
        break;
      case GameState.END:
        this.title.active = true;
        this.menu.active = true;
        this.pipeMng.stopPipe();
        this.hud.enablePlayerInfo(true);
        break;
      default:
        this.title.active = false;
        this.menu.active = false;
        this.score = 0;
        this.hud.setScore(this.score);
        this.hud.enablePlayerInfo(false);
        break;
    }
  },

  /**
   * 游戏结束回调
   */
  onGameOver: function () {
    this.toggleGameState(GameState.END);
  },

  /**
   * 点击开始按钮
   */
  clickStart: function () {
    this.toggleGameState(GameState.PLAYING);
    this.bird.onStart();
    this.bird.onJump();
    this.pipeMng.startPipe();
  },

  update: function (dt) {
    if (this.currState === GameState.PLAYING || this.currState === GameState.END) {
      if (this.bird.node.y > this.ground.node.y) { // 当小鸟没有碰到地面
        this.bird.onDrop(dt, this.ground.node.y);
      } else {  // 当小鸟碰到地面，则游戏结束
        this.onGameOver();
      }
    }
  },

  onClickStore() {
    this.store.active = true;
  },

  onClickQuit() {
    BYBApi.quit();
  },

  _passCall() {
    this.score += 1;
    this.hud.setScore(this.score);
  },

});
