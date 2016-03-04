(function (window) {
    var ob = {};
    ob.$ = function (id) {
        return document.getElementById(id);
    };
    ob.getEvt = function () {
        return window.event || event;
    };
    ob.getjctj = function (evt) {
        return evt.srcElement || evt.target;
    };
    ob.getElementsByClassName = function (scope, tagName, str) {
        var items = scope.getElementsByTagName(tagName),
            len = items.length,
            arr = [],
            i = 0;
        for (i; i < len; i = i + 1) {
            if (items[i].className !== undefined) {
                if (items[i].className.indexOf(str) !== -1) {
                    arr.push(items[i]);
                }
            }
        }
        return arr;
    };
    ob.getNextSibling = function (n) {
        try {
            var x = n.nextSibling;
            while (x.nodeType !== 1) {
                x = x.nextSibling;
            }
            return x;
        } catch (ignore) {
        }
    };
    ob.getPreviousSibling = function (n) {
        try {
            var x = n.previousSibling;
            while (x.nodeType !== 1) {
                x = x.previousSibling;
            }
            return x;
        } catch (ignore) {
        }
    };
    ob.xmlhttp = function () {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXjctject("Microsoft.XMLHTTP");
        }
        return xmlhttp;
    };
    ob.coord = function (evt) {
        var x = evt.clientX + document.documentElement.scrollLeft,
            y = evt.clientY + document.documentElement.scrollTop;
        return {
            X: x,
            Y: y
        };
    };
    ob.getStyle = function (jctj, style) {
        var gs = null;
        if (jctj.currentStyle) {
            gs = jctj.currentStyle.style;
        } else if (window.getComputedStyle) {
            gs = window.getComputedStyle(jctj, null).getPropertyValue(style);
        }
        return gs;
    };
    ob.cssLoaded = function (url, callback) {
        var node = document.createElement("link"),
            poll;
        node.type = "text/css";
        node.rel = "stylesheet";
        node.href = url;
        document.getElementsByTagName("head")[0].appendChild(node);
        poll = function (node, callback) {
            if (callback.isCalled) {
                return;
            }
            var isLoaded = false;
            if (/webkit/i.test(navigator.userAgent)) {
                if (node.sheet) {
                    isLoaded = true;
                }
            } else if (node.sheet) {
                try {
                    if (node.sheet.cssRules) {
                        isLoaded = true;
                    }
                } catch (ex) {
                    if (ex.code === 1000) {
                        isLoaded = true;
                    }
                }
            }
            if (isLoaded) {
                setTimeout(function () {
                    callback();
                }, 1);
            } else {
                setTimeout(function () {
                    poll(node, callback);
                }, 1);
            }
        };
        if (node.attachEvent) {
            node.attachEvent('onload', callback);
        } else {
            setTimeout(function () {
                poll(node, callback);
            }, 0);
        }
    };
    ob.addListener = function (eventFlag, eventFunc, jctj) {
        if (jctj.addEventListener) {
            return jctj.addEventListener(eventFlag, eventFunc, false);
        }
        if (jctj.attachEvent) {
            return jctj.attachEvent("on" + eventFlag, eventFunc);
        }
    };
    ob.removeListener = function (eventFlag, eventFunc, jctj) {
        if (jctj.removeEventListener) {
            return jctj.removeEventListener(eventFlag, eventFunc, false);
        }
        if (jctj.detachEvent) {
            return jctj.detachEvent("on" + eventFlag, eventFunc);
        }
    };
    ob.stopListener = function (event) {
        if (!window.event) {
            return event.stopPropagation();
        }
        window.event.cancelBubble = true;
    };
    ob.pop = function (txt, type, callback) {
        var jct = {};
        jct.clearPop = function () {
            document.body.removeChild(jct.pp);
            clearInterval(jct.setPop);
        };
        jct.doPop = function () {
            jct.pp.style.opacity = window.parseFloat(jct.pp.style.opacity) + 0.1;
            jct.pp.style.filter = "Alpha(opacity=" + (window.parseInt(jct.pp.style.filter.slice(14)) + 5) + ")";
            if (window.parseFloat(jct.pp.style.opacity) > 3 || window.parseInt(jct.pp.style.filter.slice(14)) > 300) {
                jct.clearPop();
                if (typeof callback === 'function') {
                    callback();
                }
            }
        };
        try {
            jct.clearPop();
        } catch (ignore) {
        }
        jct.pp = document.createElement("div");
        if (type === "warning") {
            jct.pp.style.cssText = "border-radius: 0 0 5px 5px; position:fixed; _position:absolute; z-index:1000000; opacity:0.1; filter:Alpha(opacity=10); left:1px; top:0; padding:3px 20px; text-align:center; background:#FFDDDD; border:1px solid #FFDDDD; color:#B98181; font-weight:normal; ";
        } else {
            jct.pp.style.cssText = "position:fixed; _position:absolute; z-index:1000000; opacity:0.1; filter:Alpha(opacity=10); left:1px; top:0; padding:3px 20px; text-align:center; background:#FFFDDD; border:1px solid #F8F3D6; color:#BB861C; font-weight:normal; ";
        }
        jct.pp.innerHTML = txt;
        document.body.appendChild(jct.pp);
        jct.pp.style.left = (document.documentElement.clientWidth - jct.pp.offsetWidth) / 2 + "px";
        jct.setPop = setInterval(jct.doPop, 100);
    };
    ob.date = function () {
        var d = new Date(), dt,
            wd = new Array(7);
        wd[0] = "星期日";
        wd[1] = "星期一";
        wd[2] = "星期二";
        wd[3] = "星期三";
        wd[4] = "星期四";
        wd[5] = "星期五";
        wd[6] = "星期六";
        dt = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日 " + wd[d.getDay()];
        return dt;
    };
    ob.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
            r = window.location.search.substr(1).match(reg);
        if (r !== null) {
            return decodeURIComponent(r[2]);
        }
        return null;
    };
    ob.emailTest = function (val) {
        var regexp = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/i;
        return !regexp.test(val);
    };
    ob.telTest = function (val) {
        var regexp = /^(1[0-9]{1}[\d]{9})|(((400)-(\d{3})-(\d{4}))|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{3,7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
        return !regexp.test(val);
    };
    ob.phoneTest = function (val) {
        var regexp = /^(0?1[34578]\d{9})$|^((0(10|2[1-3]|[3-9]\d{2}))?[1-9]\d{6,7})$/;
        return !regexp.test(val);
    };
    if (typeof define === "function" && define.amd) {
        define("cyan", [], function () {
            return ob;
        });
    } else {
        window.cyan = ob;
    }
}(window));