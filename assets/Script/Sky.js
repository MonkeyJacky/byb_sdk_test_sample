var Gloable = require('Gloable');

cc.Class({
  extends: cc.Component,

  properties: {
    xSpeed: 0,  // 背景移动速度
    xWidth: 0,   // 背景切换距离
    sp: cc.Sprite,
  },

  update: function (dt) { // 背景无限滚动逻辑
    if (this.node.x <= this.xWidth) {
        this.node.x = 0;
    } else {
        this.node.x += dt * this.xSpeed;
    }
  },

  _changeTheme: function (themeUrl) {
    Gloable.setSprite(this.sp, themeUrl);

    var subSp = this.node.getChildByName("sky").getComponent(cc.Sprite);
    Gloable.setSprite(subSp, themeUrl);
  },

});
