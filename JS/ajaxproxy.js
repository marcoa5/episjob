var ajaxProxy = {
    _lambda: "https://o6xa1qdc4k.execute-api.eu-west-1.amazonaws.com/default/ProxyLambda",
    init: function() {
        (function(open) {
            XMLHttpRequest.prototype.open = function (verb, url, async, user, password) {
                if (url === ajaxProxy._lambda) {
                    open.call(this,
                        verb,
                        url,
                        async,
                        user,
                        password);
                } else {
                    open.call(this,
                        verb,
                        ajaxProxy._lambda,
                        async,
                        user,
                        password);
                    this.setRequestHeader("X-Target", url);
                }  
            };
         })(XMLHttpRequest.prototype.open);

         (function (addProxyHeaders) {
            XMLHttpRequest.prototype.addProxyHeaders = function (url, username, password) {
                this.setRequestHeader("X-Proxy", url || ajaxProxy.proxy.url);
                this.setRequestHeader("X-Proxy-Username", username || ajaxProxy.proxy.credentials.username);
                this.setRequestHeader("X-Proxy-Password", password || ajaxProxy.proxy.credentials.password);
            };
        })(XMLHttpRequest.prototype.addProxyHeaders);
     },
     proxy: {
         url: "",
         credentials:
         {
             username: "",
             password: ""
         }
     },
     proxyHeaders: function (url, username, password) {
         return{
             "X-Proxy": url || ajaxProxy.proxy.url,
             "X-Proxy-Username": username || ajaxProxy.proxy.credentials.username,
             "X-Proxy-Password": password || ajaxProxy.proxy.credentials.password
         };
     },
     Encrypt: function(text,callback) {
         var xhr = new XMLHttpRequest();
         xhr.onreadystatechange = function () {
             if (this.readyState === 4 && this.status === 200) {
                 console.log(this.responseText);
                 if (callback) callback(this.responseText);
             }
         };
         xhr.open("POST", ajaxProxy._lambda, true);
         xhr.setRequestHeader("X-Target", "ENCRYPT");
         xhr.addProxyHeaders();
         xhr.send(text);
    }
};