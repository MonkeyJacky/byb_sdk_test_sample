var Utils = {
    urlparams2obj: function (paramStr) { 
        var obj = {};
        var arr = paramStr.split('&');
        for (var i = 0; i < arr.length; i++) {
            var kv = arr[i].split('=');
            obj[kv[0]] = kv[1];
        }
        return obj;
    },
    
    sdk: {
        data: null,

        authorize: function () {
            if (Utils.android)
                jsb.reflection.callStaticMethod(
                    "org/cocos2dx/javascript/AppActivity", "authorise", "()V");
        },

        pay: function(prepayid, nonce, timestamp, sign) {
            if (Utils.android)
                jsb.reflection.callStaticMethod(
                    "org/cocos2dx/javascript/AppActivity", "pay", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", 
                    prepayid, nonce, timestamp, sign);
        },

        handle: function (data) {
            if (data != null && data != "") {
                cc.log("handle", data);
                this.data = Utils.urlparams2obj(data);

                if (this.data.ReqType == "auth") {
                    BYBApi.Notification.emit("BYBAuthorizeCallback", this.data);
                }
                else if (this.data.ReqType == "pay") {
                    BYBApi.Notification.emit("BYBPaymentCallback", this.data);
                }
            }
        },

        
    }
};

Utils.ios = (cc.sys.platform === cc.sys.IPHONE || cc.sys.platform === cc.sys.IPAD);
Utils.android = (cc.sys.platform === cc.sys.ANDROID);
Utils.h5 = (cc.sys.platform === cc.sys.MOBILE_BROWSER || cc.sys.platform === cc.sys.DESKTOP_BROWSER);
window.Utils = Utils;

module.exports = Utils;
