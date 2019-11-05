var urls = {
    payorder: "https://biwan.wanlege.com/test/order/indent",
    userinfo: "https://biwan.wanlege.com/test/h5/redirect",
    userinfoapp: "https://biwan.wanlege.com/test/app/redirect",
};
//正式服 https://biyoubao.io

var HttpMng = {
    //模拟第三方请求商品订单接口, 参数仅供参考
    payorderReq: function (appid, token, productname, price, callback) {
        var data = {};
        data.AppID = appid;
        data.AccessToken = HttpMng.encodeToken(token);
        data.productName = productname;
        data.TotalFee = price;

        HttpUtil.POST(urls.payorder, data, callback);
    },

    userInfoReq: function (code, token, callback) {
        var data = {};
        data.Code = code;
        data.AccessToken = HttpMng.encodeToken(token);

        HttpUtil.POST(urls.userinfo, data, callback);
    },

    appUserInfoReq: function (code, callback) {
        var data = {};
        data.Code = code;

        HttpUtil.POST(urls.userinfoapp, data, callback);
    },

};

HttpMng.encodeToken = function(token) {
    var data = {};
    data.EncryptStr = encodeURIComponent(token.EncryptStr);
    data.EncryptKey = encodeURIComponent(token.EncryptKey);

    return data;
};

window.HttpMng = HttpMng;

module.exports = HttpMng;
