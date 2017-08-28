/*global */
/*
 cyan.js v1.0.2
 (c) 2017 zlz
 Released under the MIT License.
 */
class Cyan {
    constructor() {}
    //顶部提示，自动隐藏
    pop(txt, type, cb) {
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
    }
    confirm(cb, txt) {
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
    }
    //返回当前年月日星期
    date() {
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
    }
    //获取url参数name的值
    getUrlParam(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
            r = window.location.search.substr(1).match(reg);
        if (r !== null) {
            return decodeURIComponent(r[2]);
        }
        return null;
    }
    //获取pathName的值
    getPathName(param) {
        var pathName = window.location.pathname.split('/').splice(1);
        if (pathName[param] !== '' && pathName[param].indexOf('.') === -1) {
            return decodeURIComponent(pathName[param]);
        }
        return null;
    }
    //邮箱正则测试
    emailTest(val) {
        var regexp = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/i;
        return !regexp.test(val);
    }
    //电话号码正则测试
    telTest(val) {
        var regexp = /^(1[0-9]{1}[\d]{9})|(((400)-(\d{3})-(\d{4}))|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{3,7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
        return !regexp.test(val);
    }
    //手机号正则测试
    phoneTest(val) {
        var regexp = /^(0?1[34578]\d{9})$|^((0(10|2[1-3]|[3-9]\d{2}))?[1-9]\d{6,7})$/;
        return !regexp.test(val);
    }
    //查找数组arr的val是否存在
    arrFind(arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === val) {
                return i;
            }
        }
        return -1;
    }
    //去除HTML标签
    removeHtmlTag(html) {
        html = html.replace(/(\n)/g, '');
        html = html.replace(/(\t)/g, '');
        html = html.replace(/(\r)/g, '');
        html = html.replace(/<\/?[^>]*>/g, '');
        html = html.replace(/\s*/g, '');
        return html;
    }
    //设置首页
    setHome(obj, url) {
        try {
            obj.style.behavior = 'url(#default#homepage)';
            obj.setHomePage(url);
        } catch (e) {
            if (window.netscape) {
                try {
                    window.netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
                } catch (e) {
                    alert(
                        "抱歉，此操作被浏览器拒绝！\n\n请在浏览器地址栏输入“about:config”并回车然后将[signed.applets.codebase_principal_support]设置为'true'"
                    );
                }
            } else {
                alert('抱歉，您所使用的浏览器无法完成此操作。\n\n您需要手动将【' + url + '】设置为首页。');
            }
        }
    }
    addFav(title, url) {
        try {
            window.external.addFavorite(url, title);
        } catch (e) {
            try {
                window.sidebar.addPanel(title, url, '');
            } catch (e) {
                alert('抱歉，您所使用的浏览器无法完成此操作。\n\n加入收藏失败，请使用Ctrl+D进行添加');
            }
        }
    }
}
let cyan = new Cyan();
export { cyan };
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
