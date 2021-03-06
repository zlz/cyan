(function(define) {
    var fn = function(sld, spdb) {
        var $ = fn.$ || jQuery,
            spda = 450,
            data = fn.data,
            i,
            len,
            arwLeft,
            arwRight,
            roll,
            tit,
            pageItms,
            viewWidth,
            rollStr = '',
            pageStr = '',
            stepWidth,
            step = 0,
            setTitPage;
        if (data.length === 0) {
            return false;
        }
        sld.html('');
        clearInterval(window.animTimer);
        len = data.length;
        for (i = 0; i < len; i = i + 1) {
            rollStr = rollStr + "<a href='" + data[i].fromUrl + "' target='_blank' class='sld-a0'><img class='sld-img' src='" + data[i].url + "'' style='height:100%'></a>";
            pageStr = pageStr + "<span class='sld-page-itm' data-num='" + i + "'></span>";
        }
        rollStr = rollStr + "<a href='" + data[0].fromUrl + "' target='_blank' class='sld-a0'><img class='sld-img' src='" + data[0].url + "'' style='height:100%'></a>";
        sld.append('<div class="sld-roll">' + rollStr + '</div><span class="sld-tit" target="_blank"></span><div class="sld-page">' + pageStr + '</div><div class="sld-arw-left"></div><div class="sld-arw-right"></div>')
            .css({
                'display': 'block'
            });
        roll = sld.find('.sld-roll');
        tit = sld.find('.sld-tit');
        arwLeft = sld.find('.sld-arw-left');
        arwRight = sld.find('.sld-arw-right');
        pageItms = sld.find('.sld-page-itm');
        viewWidth = sld.innerWidth();
        stepWidth = viewWidth;
        setTitPage = function() {
            tit.href = data[step].url;
            tit.html(data[step].title);
            pageItms.removeClass('sld-page-fcs')
                .eq(step)
                .addClass('sld-page-fcs');
        };
        fn.animLeft = function() {
            if ($('body')
                .find('.sld')
                .length === 0) {
                clearInterval(window.animTimer);
            }
            roll.stop(true, true);
            step = step + 1;
            stepWidth = viewWidth * step;
            roll.animate({
                scrollLeft: stepWidth
            }, spda, 'swing', function() {
                if (step === len) {
                    step = 0;
                    roll.scrollLeft(0);
                }
                setTitPage();
            });
        };
        fn.animRight = function() {
            roll.stop(true, true);
            step = step - 1;
            if (step < 0) {
                step = len - 1;
                roll.scrollLeft(viewWidth * len);
            }
            stepWidth = viewWidth * step;
            roll.animate({
                scrollLeft: stepWidth
            }, spda, 'swing', function() {
                setTitPage();
            });
        };
        window.animTimer = window.setInterval(fn.animLeft, spdb);
        setTitPage();
        sld.on({
            mouseover: function(evt) {
                var $el = $(evt.target);
                clearInterval(window.animTimer);
                arwLeft.show();
                arwRight.show();
                if ($el.hasClass('sld-page-itm')) {
                    step = $el.data('num') - 1;
                    fn.animLeft();
                }
            },
            mouseout: function() {
                clearInterval(window.animTimer);
                window.animTimer = window.setInterval(fn.animLeft, spdb);
            },
            click: function(evt) {
                var $el = $(evt.target);
                if ($el.hasClass('sld-arw-left')) {
                    fn.animRight();
                }
                if ($el.hasClass('sld-arw-right')) {
                    fn.animLeft();
                }
            }
        });
        $(document)
            .on('mouseover', function(evt) {
                var $el = $(evt.target);
                if (!$el.parents()
                    .hasClass('sld')) {
                    arwLeft.hide();
                    arwRight.hide();
                }
            });
        $(window)
            .resize(function() {
                viewWidth = sld.innerWidth();
            });
    };
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function($) {
            fn.$ = $;
            return fn;
        });
    } else {
        window.zslide = fn;
    }
}(window.define));