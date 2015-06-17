/*!absolute-ajax
---------------
version 0.3.0
author: Leandro Cabrera (leaocabrera@gmail.com)
https://github.com/lean/
Licensed under the MIT license.
*/
(function () {
    "use strict";
    var abjax;

    var isObject = function (obj) {
        var type = typeof obj;
        return type === "function" || type === "object" && !!obj;
    };
    var isFunction = function (obj) {
        return toString.call(obj) === "[object Function]";
    };

    // Underscore.js: Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
    // IE 11 (#1621), and in Safari 8 (#1929).
    /* jshint ignore:start */
    if (typeof /./ != "function" && typeof Int8Array != "object") {
        isFunction = function(obj) {
            return typeof obj == "function" || false;
        };
    }
    /* jshint ignore:end */
    var param = function (obj, prefix) {
        var str = [];

        for (var p in obj) {

            if (isFunction(obj[p])) {
                continue;
            }
            var k = prefix ? prefix + "[" + p + "]" : p,
                v = obj[p];
            str.push(isObject(v) ? abjax.param(v, k) : (k) + "=" + encodeURIComponent(v));
        }
        return str.join("&");
    };

    var extend = function (obj) {
        if (!isObject(obj)) {
            return obj;
        }
        var source, prop;
        for (var i = 1, length = arguments.length; i < length; i++) {
            source = arguments[i];
            for (prop in source) {
                obj[prop] = source[prop];
            }
        }
        return obj;
    };

    function empty() {}

    var ajaxSettings = {
        type: "GET",
        success: empty,
        error: empty,
        complete: empty, //XHR only
        context: undefined,
        timeout: 0,
        crossDomain: null,
        processData: true
    };



    var ajax = function (opts) {
        var settings = opts || {};

        for (var key in ajaxSettings) {
            if (typeof (settings[key]) === "undefined") {
                settings[key] = ajaxSettings[key];
            }
        }

        if (window.XDomainRequest) {
            useXDR(opts, settings);
        } else {
            useXHR(opts, settings);
        }
    };

    function useXDR(opts, settings) {
        var xdr = new XDomainRequest();
        var context = settings.context;

        var callback = function (status, statusText, responses) {

            xdr.onload = xdr.onerror = xdr.ontimeout = function () {};
            xdr = undefined;

            if (status >= 200 && status < 300) {
                if (settings.success) {
                    settings.success(JSON.parse(responses.text));
                }
            } else {
                if (settings.error) {
                    settings.error.call(context, status, statusText);
                }
            }
        };

        xdr.timeout = settings.timeout;
        xdr.open(settings.type, settings.url);

        xdr.onprogress = function () {
            //Progress
        };

        xdr.ontimeout = function () {
            callback(0, "timeout");
        };

        xdr.onerror = function () {
            callback(404, "Not Found");
        };

        xdr.onload = function () {
            callback(200, "OK", {
                text: xdr.responseText
            }, "Content-Type: " + xdr.contentType);
        };

        setTimeout(function () {
            xdr.send(settings.data || null);
        }, 0);
    }

    function useXHR(opts, settings) {
        var xhr = new window.XMLHttpRequest(),
            abortTimeout,
            context = settings.context,
            protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;

        if (typeof (opts) === "string") {
            var oldUrl = opts;
            opts = {
                url: oldUrl
            };
        }

        if (!settings.url) {
            settings.url = window.location;
        }

        if (!settings.headers) {
            settings.headers = {};
        }

        if (!("async" in settings) || settings.async !== false) {
            settings.async = true;
        }
        if (settings.processData && isObject(settings.data)) {
            settings.data = param(settings.data);
        }
        if (settings.type.toLowerCase() === "get" && settings.data) {
            if (settings.url.indexOf("?") === -1) {
                settings.url += "?" + settings.data;
            } else {
                settings.url += "&" + settings.data;
            }
        }
        if (settings.data) {
            if (!settings.contentType && settings.contentType !== false) {
                settings.contentType = "application/x-www-form-urlencoded; charset=UTF-8";
            }
        }
        if (!settings.dataType) {
            settings.dataType = "text/html";
        } else {
            switch (settings.dataType) {
            case "script":
                settings.dataType = "text/javascript, application/javascript";
                break;
            case "json":
                settings.dataType = "application/json";
                break;
            case "xml":
                settings.dataType = "application/xml, text/xml";
                break;
            case "html":
                settings.dataType = "text/html";
                break;
            case "text":
                settings.dataType = "text/plain";
                break;
            default:
                settings.dataType = "text/html";
                break;
            }
        }

        if (settings.crossDomain === null) {
            settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 !== window.location.host;
        }

        if (!settings.crossDomain) {
            settings.headers = extend({
                "X-Requested-With": "XMLHttpRequest"
            }, settings.headers);
        }

        xhr.onreadystatechange = function () {
            var mime = settings.dataType;
            if (xhr.readyState === 4) {
                clearTimeout(abortTimeout);
                var result, error = false;
                var contentType = xhr.getResponseHeader("content-type") || "";
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0 && protocol === "file:") {
                    if ((contentType.indexOf("application/json") >= 0) || (mime === "application/json" && !(/^\s*$/.test(xhr.responseText)))) {
                        try {
                            result = JSON.parse(xhr.responseText);
                        } catch (e) {
                            error = e;
                        }
                    } else if (contentType.indexOf("javascript") !== -1) {
                        try {
                            result = xhr.responseText;
                        } catch (e) {
                            console.error(e);
                        }
                    } else if (mime === "application/xml, text/xml") {
                        result = xhr.responseXML;
                    } else if (mime === "text/html") {
                        result = xhr.responseText;
                    } else {
                        result = xhr.responseText;
                    }
                    //If we're looking at a local file, we assume that no response sent back means there was an error
                    if (xhr.status === 0 && result.length === 0) {
                        error = true;
                    }
                    if (error) {
                        settings.error.call(context, xhr, "parsererror", error);
                    } else {
                        settings.success.call(context, result, "success", xhr);
                    }
                } else {
                    error = true;

                    settings.error.call(context, xhr, "error");
                }
                var respText = error ? "error" : "success";
                settings.complete.call(context, xhr, respText);
            }
        };
        xhr.open(settings.type, settings.url, settings.async);
        if (settings.withCredentials) {
            xhr.withCredentials = true;
        }

        if (settings.contentType) {
            settings.headers["Content-Type"] = settings.contentType;
        }
        for (var name in settings.headers) {
            if (typeof settings.headers[name] === "string") {
                xhr.setRequestHeader(name, settings.headers[name]);
            }
        }

        if (settings.timeout > 0) {
            abortTimeout = setTimeout(function () {
                xhr.onreadystatechange = empty;
                xhr.abort();
                settings.error.call(context, xhr, "timeout");
            }, settings.timeout);
        }
        xhr.send(settings.data);

        return xhr;

    }

    window.abjax = {
        ajax: ajax,
        get: function(options){
            options.type = "GET";
            ajax(options);
        },
        post: function(options){
            options.type = "POST";
            ajax(options);
        }
    };

})();
