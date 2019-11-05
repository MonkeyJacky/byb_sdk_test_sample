//模拟商城
var FloatingTip = require('FloatingTip');
var assets = [
    {id: 0, name: "主题1", price: 0, bought: true, inuse: true},
    {id: 1, name: "主题2", price: 1000, bought: false, inuse: false},
    {id: 2, name: "主题3", price: 1000, bought: false, inuse: false},
];
var assetsRes = [
    {pipeUp: "pipes/pipeUp1", pipeDown: "pipes/pipeDown1", background: "backgrounds/Background0-0", foreground: "backgrounds/Background0-1"},
    {pipeUp: "pipes/pipeUp2", pipeDown: "pipes/pipeDown2", background: "backgrounds/Background1-0", foreground: "backgrounds/Background1-1"},
    {pipeUp: "pipes/pipeUp3", pipeDown: "pipes/pipeDown3", background: "backgrounds/Background2-0", foreground: "backgrounds/Background2-1"},
];

cc.Class({
    extends: cc.Component,

    properties: {
        pageview: cc.PageView,

        lbl_price: cc.Label,

        tip: FloatingTip,

        btn_use: cc.Node,
        btn_buy: cc.Node,
        lbl_inuse: cc.Node,
        layout_price: cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        BYBApi.Notification.on("BYBPaymentCallback", this._handleBYBPayment, this);
    },

    onDestroy () {
        BYBApi.Notification.off("BYBPaymentCallback", this._handleBYBPayment, this);
    },

    start () {
        this.configs = cc.sys.localStorage.getItem("theme_configs");
        if (this.configs != null) {
            this.configs = JSON.parse(this.configs);
        } else {
            this.configs = assets;
        }

        this.page = cc.sys.localStorage.getItem("theme_index");
        if (this.page == null)
            this.page = 0;

        this.lastInusePage = this.page;
        this._loadAssetConfig(this.page);
        this.pageview.scrollToPage(this.page, 0.1);
    },

    // update (dt) {},
    _loadAssetConfig: function (index) {
        var cfg = this.configs[index];
        cc.log(cfg);
        if (cfg.bought) {
            if (cfg.inuse) {
                this.lbl_inuse.active = true;
                this.btn_use.active = false;
            }  else {
                this.lbl_inuse.active = false;
                this.btn_use.active = true;
            }
            this.btn_buy.active = false;
            this.layout_price.active = false;
        } else {
            this.lbl_price.string = cfg.price;
            this.lbl_inuse.active = false;
            this.btn_buy.active = true;
            this.btn_use.active = false;
            this.layout_price.active = true;
        }
    },

    _changeConfig: function(index, key, value) {
        var cfg = this.configs[index];
        if (cfg != null && cfg[key] != null) {
            cfg[key] = value;

            if (key == "inuse") {
                if (this.lastInusePage != null) {
                    this.configs[this.lastInusePage][key] = false;
                }
                this.lastInusePage = index;
            }
            // cc.sys.localStorage.setItem('theme_configs', JSON.stringify(this.configs));
        }
    },

    _handleBYBPayment: function (data) {
        if (data.code == 0) { //成功
            this.tip.show("购买成功");

            this._changeConfig(this.page, "bought", true);
            this._loadAssetConfig(this.page);
        } else { //失败
            this.tip.show("购买失败");
        }
    },

    onPageLeft() {
        this.page--;
        if (this.page < 0)
            this.page = 2;
        this.pageview.scrollToPage(this.page);

        this._loadAssetConfig(this.page);
    },

    onPageRight() {
        this.page++;
        if (this.page > 2)
            this.page = 0;
        this.pageview.scrollToPage(this.page);

        this._loadAssetConfig(this.page);
    },

    onClickBuy() {
        var _this = this;

        BYBApi.prepare(); //异步回调中唤起app需要调用prepare接口

        var callback = function(data) {
            if (data != null) {
                if (data.code == 0) {
                    if (BYBApi.getAppID() == data.data.AppID)
                        BYBApi.pay(data.data.PrepayID, data.data.Nonce, data.data.TimeStamp, data.data.sign)
                    else
                        _this.tip.show("下单应用与应用注册的AppID不一致");
                } else {
                    _this.tip.show(data.msg);
                }
            }
        };
        var cfg = this.configs[this.page];
        //该订单请求链接为测试链接，参数仅供参考
        HttpMng.payorderReq(BYBApi.getAppID(), BYBApi.getAccessToken(), cfg.name, cfg.price, callback);
    },

    onClickClose() {
        this.node.active = false;
    },

    onClickUse() {
        this._changeConfig(this.page, "inuse", true);
        this._loadAssetConfig(this.page);
        // cc.sys.localStorage.setItem("theme_index", this.page);
        BYBApi.Notification.emit("ThemeChange", assetsRes[this.page]);
    },

});
