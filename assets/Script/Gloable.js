module.exports = {
  pipes: [], // 管道数组

  setSprite: function (sp, url) {
  	if (sp == null || url == null) return;

    cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
        if (err == null) {
            sp.spriteFrame = spriteFrame;
            sp.node.active = true;
        } else {
            sp.node.active = false;
            cc.log("setSprite err:", err);
        }
    });
  },
};