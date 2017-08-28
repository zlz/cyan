/*global ActiveXjctject*/
/*
 cyan.js v0.9.5
 (c) 2016 zlz
 Released under the MIT License.
 */
(function(window) {
    var ob = {};
    //
    ob.getEvt = function() {
        return window.event || event;
    };
    //
    ob.getjctj = function(evt) {
        return evt.srcElement || evt.target;
    };
    //
    ob.getElementsByClassName = function(scope, tagName, str) {
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
    //
    ob.getNextSibling = function(n) {
        try {
            var x = n.nextSibling;
            while (x.nodeType !== 1) {
                x = x.nextSibling;
            }
            return x;
        } catch (ignore) {
            //ignore
        }
    };
    //
    ob.getPreviousSibling = function(n) {
        try {
            var x = n.previousSibling;
            while (x.nodeType !== 1) {
                x = x.previousSibling;
            }
            return x;
        } catch (ignore) {
            //ignore
        }
    };
    //
    ob.xmlhttp = function() {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXjctject('Microsoft.XMLHTTP');
        }
        return xmlhttp;
    };
    ob.coord = function(evt) {
        var x = evt.clientX + document.documentElement.scrollLeft,
            y = evt.clientY + document.documentElement.scrollTop;
        return {
            X: x,
            Y: y
        };
    };
    //
    ob.getStyle = function(el, style) {
        var gs = null;
        if (el.currentStyle) {
            gs = el.currentStyle.style;
        } else if (window.getComputedStyle) {
            gs = window.getComputedStyle(el, null).getPropertyValue(style);
        }
        return gs;
    };
    //加载外部css直到完成
    ob.cssLoaded = function(url, callback) {
        var node = document.createElement('link'),
            poll;
        node.type = 'text/css';
        node.rel = 'stylesheet';
        node.href = url;
        document.getElementsByTagName('head')[0].appendChild(node);
        poll = function(node, callback) {
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
                setTimeout(function() {
                    callback();
                }, 1);
            } else {
                setTimeout(function() {
                    poll(node, callback);
                }, 1);
            }
        };
        if (node.attachEvent) {
            node.attachEvent('onload', callback);
        } else {
            setTimeout(function() {
                poll(node, callback);
            }, 0);
        }
    };
    //
    ob.addListener = function(eventFlag, eventFunc, jctj) {
        if (jctj.addEventListener) {
            return jctj.addEventListener(eventFlag, eventFunc, false);
        }
        if (jctj.attachEvent) {
            return jctj.attachEvent('on' + eventFlag, eventFunc);
        }
    };
    //
    ob.removeListener = function(eventFlag, eventFunc, jctj) {
        if (jctj.removeEventListener) {
            return jctj.removeEventListener(eventFlag, eventFunc, false);
        }
        if (jctj.detachEvent) {
            return jctj.detachEvent('on' + eventFlag, eventFunc);
        }
    };
    //
    ob.stopListener = function(event) {
        if (!window.event) {
            return event.stopPropagation();
        }
        window.event.cancelBubble = true;
    };
    //顶部提示，自动隐藏
    ob.pop = function(txt, type, cb) {
        var jct = {};
        var cssText =
            'animation: anim-pop 3s linear forwards; border-radius: 0 0 5px 5px; position:fixed; z-index:1000000; opacity:0.1; left:1px; top:0; padding:3px 20px; text-align:center; background:#F2DEDE; color:#333; font-weight:normal;';
        jct.pp = document.createElement('div');
        jct.pp.innerHTML = txt;
        document.body.appendChild(jct.pp);
        switch (type) {
            case 'error': {
                jct.pp.style.cssText = cssText + ' background:#f2dede; color:#a94442;';
                break;
            }
            case 'warning': {
                jct.pp.style.cssText = cssText + ' background:#fcf8e3; color:#8a6d3b;';
                break;
            }
            case 'success': {
                jct.pp.style.cssText = cssText + ' background:#dff0d8; color:#3c763d;';
                break;
            }
            default: {
                jct.pp.style.cssText = cssText + ' background:#d9edf7; color:#31708f';
                break;
            }
        }
        jct.pp.style.left = (document.documentElement.clientWidth - jct.pp.offsetWidth) / 2 + 'px';
        if (cb && cb instanceof Function) {
            cb();
        }
        window.setTimeout(function() {
            document.body.removeChild(jct.pp);
        }, 3000);
    };
    ob.confirm = function(cb, txt) {
        var cbVal = false;
        if (!txt) {
            txt = '确定删除？';
        }
        var htmStr =
            '<div style="z-index:100000000; position:absolute; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,.4)"></div><div style="z-index:100000001;font-size:13px;background:#fff;border-radius:5px;position:absolute;width:300px; height:120px; top:50%; left:50%; margin-left:-150px; margin-top:-125px;border:1px solid #ddd; color:#333;"><div style="text-align:center; margin-top:30px;height:50px;">' +
            txt +
            '</div><div style="text-align:center;font-size:12px;"><span class="cyan-confirm-y" style="background:#337ab7; color:#fff;border:1px solid #337ab7; cursor:pointer; padding:5px 20px;border-radius:5px;margin-right:10px;">确定</span><span class="cyan-confirm-n" style="background:#f1f1f1;border:1px solid #ddd; cursor:pointer; padding:5px 20px;border-radius:5px;">取消</span></div></div>';
        var el = document.createElement('div');
        el.innerHTML = htmStr;
        document.body.appendChild(el);
        var si = setInterval(function() {
            if (el) {
                document.body.removeChild(el);
                clearInterval(si);
                if (cb && cb instanceof Function) {
                    cb(cbVal);
                }
            }
        }, 6e4);
        document.querySelector('.cyan-confirm-y').addEventListener(
            'click',
            function() {
                clearInterval(si);
                document.body.removeChild(el);
                cbVal = true;
                if (cb && cb instanceof Function) {
                    cb(cbVal);
                }
            },
            false
        );
        document.querySelector('.cyan-confirm-n').addEventListener(
            'click',
            function() {
                clearInterval(si);
                document.body.removeChild(el);
                if (cb && cb instanceof Function) {
                    cb(cbVal);
                }
            },
            false
        );
    };
    //返回当前年月日星期
    ob.date = function() {
        var d = new Date(),
            dt,
            wd = new Array(7);
        wd[0] = '星期日';
        wd[1] = '星期一';
        wd[2] = '星期二';
        wd[3] = '星期三';
        wd[4] = '星期四';
        wd[5] = '星期五';
        wd[6] = '星期六';
        dt = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + wd[d.getDay()];
        return dt;
    };
    //获取url参数name的值
    ob.getUrlParam = function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
            r = window.location.search.substr(1).match(reg);
        if (r !== null) {
            return decodeURIComponent(r[2]);
        }
        return null;
    };
    //获取pathName的值
    ob.getPathName = function(param) {
        var pathName = window.location.pathname.split('/').splice(1);
        if (pathName[param] !== '' && pathName[param].indexOf('.') === -1) {
            return decodeURIComponent(pathName[param]);
        }
        return null;
    };
    //邮箱正则测试
    ob.emailTest = function(val) {
        var regexp = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/i;
        return !regexp.test(val);
    };
    //电话号码正则测试
    ob.telTest = function(val) {
        var regexp = /^(1[0-9]{1}[\d]{9})|(((400)-(\d{3})-(\d{4}))|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{3,7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
        return !regexp.test(val);
    };
    //手机号正则测试
    ob.phoneTest = function(val) {
        var regexp = /^(0?1[34578]\d{9})$|^((0(10|2[1-3]|[3-9]\d{2}))?[1-9]\d{6,7})$/;
        return !regexp.test(val);
    };
    //查找数组arr的val是否存在
    ob.arrFind = function(arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === val) {
                return i;
            }
        }
        return -1;
    };
    //去除HTML标签
    ob.removeHtmlTag = function(html) {
        html = html.replace(/(\n)/g, '');
        html = html.replace(/(\t)/g, '');
        html = html.replace(/(\r)/g, '');
        html = html.replace(/<\/?[^>]*>/g, '');
        html = html.replace(/\s*/g, '');
        return html;
    };
    if (typeof define === 'function' && define.amd) {
        define('cyan', [], function() {
            return ob;
        });
    } else {
        window.cyan = ob;
    }
    //获取数组值val的索引
    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === val) {
                return i;
            }
        }
        return -1;
    };
    //删除数组值val
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    // console兼容
    if (!window.console) {
        window.console = { log: function() {} };
    }
})(window);
