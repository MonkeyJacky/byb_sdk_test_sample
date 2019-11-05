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
    btn_login: cc.Node,
    hud: Hud,
  },

  initConfig: function () {
    // cc.debug.setDisplayStats(true); // 显示fps
  },

  onLoad: function () {
    this.initConfig();
    this.pipeMng.init(this, this._passCall);
    // if (cc.sys.localStorage.getItem("OpenID") != null)
    //   this.toggleGameState(GameState.START);
    // else
    this.toggleGameState(GameState.LOGIN);
    this.node.on('touchstart', function (event) { // 监听触摸开始事件
      if(this.currState === GameState.PLAYING ){
        this.bird.onJump();
      }
    }, this);

    BYBApi.Notification.on("ThemeChange", this._onThemeChange, this);
    BYBApi.Notification.on("BYBAuthorizeCallback", this._handleBYBAuth, this);
  },

  onDestroy: function () {
    BYBApi.Notification.off("ThemeChange", this._onThemeChange, this);
    BYBApi.Notification.off("BYBAuthorizeCallback", this._handleBYBAuth, this);
  },

  _onThemeChange: function (data) {
    this.pipeMng._changeTheme(data);
    this.sky._changeTheme(data.background);
    this.foreground._changeTheme(data.foreground);
  },

  _handleBYBAuth: function (data) {
    if (data.Code != null) {
      cc.log("auth ok", data.Code);
      this.authData = data;
      this.tip.show("授权成功");
    } else {
      this.authData = null;
      this.tip.show("取消授权");
    }
  },

  _authorize: function (data) {
    var _this = this;
    var callback = function (d) {
    if (d != null) {
      cc.log("resp", d.code);
      if (d.code == 0) {
          //OpenID nick IsActived AccessToken
          HttpMng.token = d.data.AccessToken;
          HttpMng.IsActived = d.data.IsActived;
          cc.log("IsActived", d.data.IsActived);
          _this.hud.setPlayerInfo(d.data.nick, d.data.OpenID);
          _this.toggleGameState(GameState.START);
        } else {
          _this.tip.show("授权失败");
        }
      }
    };
    HttpMng.appUserInfoReq(data.Code, callback);
  },

  /**
   * 切换游戏状态
   * @param state
   */
  toggleGameState: function (state) {
    this.currState = state;
    switch (this.currState) {
      case GameState.LOGIN:
        this._enableLoginButton(true);
        this.menu.active = false;
        this.hud.enablePlayerInfo(false);
        break;
      case GameState.START:
        this._enableLoginButton(false);
        this.title.active = true;
        this.menu.active = true;
        this.hud.enablePlayerInfo(true);
        break;
      case GameState.END:
        this._enableLoginButton(false);
        this.title.active = true;
        this.menu.active = true;
        this.pipeMng.stopPipe();
        this.hud.enablePlayerInfo(true);
        break;
      default:
        this._enableLoginButton(false);
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

    if (this.authData != null) {
      this._authorize(this.authData);
      this.authData = null;
    }
  },

  onClickStore() {
    this.store.active = true;
  },

  onClickLogin() {
      Utils.sdk.authorize();
  },

  _enableLoginButton(enable) {
    this.btn_login.active = enable;
  },

  _passCall() {
    this.score += 1;
    this.hud.setScore(this.score);
  },

});
