var HttpUtil = {
    times: 3,

    send: function(url, reqType, callback, resType, data, header, sync, tick, eventname) {
        var _this = this;
        var xhr = new XMLHttpRequest();

        var retry = function () {
            tick = (tick==null)?tick:0;
            tick += 1;

            if (tick < _this.times)
                _this.send(url, reqType, callback, resType, data, header, sync, tick);
        };

        xhr.onload = function (event) {
            var resp = xhr.response;
            cc.log("response: ", xhr.responseURL, resp);
            
            if (callback != null) callback(resp);
            if (eventname != null) Notification.emit(eventname, resp);
        };

        xhr.onerror = function (event) {
            // cc.log(event);
        };

        xhr.onabort = function (event) {
            // cc.log(event);
        };

        xhr.onloadstart = function (event) {
            // cc.log(event);
        };

        xhr.onprogress = function (event) {
            // cc.log(event);
        };

        xhr.ontimeout = function (event) {
            // cc.log(event);
            retry();
        };

        xhr.open(reqType, url, (sync==null)?true:false);

        // xhr.withCredentials = true; //允许跨域请求

        if (resType != null)
            xhr.responseType = resType;

        if (header != null) {
            //header 定义参考[[key, value], [key, value]]
            for (var i in header) {
                xhr.setRequestHeader(header[i][0], header[i][1]);
            }
        }

        xhr.timeout = 1000;
        // cc.log("xhr.timeout", xhr.ontimeout);

        xhr.send(data);
    },

    POST: function (url, data, callback) {
        var header = [["Content-Type", "application/json"], ["Accept", "application/json"]];
        
        data = JSON.stringify(data);

        cc.log("post:", url + " " + data);
        this.send(url, "POST", callback, "json", data, header);
    },

};

window.HttpUtil = HttpUtil;

module.exports = HttpUtil;
