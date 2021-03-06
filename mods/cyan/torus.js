(function(window, Raphael) {
    var ob = function(para) {
        var torus = {};
        torus.per = 0;
        torus.PI = Math.PI;
        if (para.perc >= 1) {
            para.perc = 0.9999;
        }
        $('#' + para.id + ' svg, #' + para.id + ' div').remove();
        torus.halfDime = para.dimension / 2;
        torus.r = torus.halfDime - para.width;
        torus.paper = Raphael(para.id, para.dimension, para.dimension);
        torus.x0 = torus.halfDime + torus.r * Math.cos(-2 * torus.PI * 0.25);
        torus.y0 = torus.halfDime + torus.r * Math.sin(-2 * torus.PI * 0.25);
        if (para.type === 'full') {
            torus.bgPath = torus.paper.path(
                'M' +
                    torus.x0 +
                    ',' +
                    torus.y0 +
                    'A' +
                    torus.r +
                    ',' +
                    torus.r +
                    ',0,1,1,' +
                    (torus.halfDime + torus.r * Math.cos(2 * torus.PI * 0.74999)) +
                    ',' +
                    (torus.halfDime + torus.r * Math.sin(2 * torus.PI * 0.74999))
            );
            torus.si = window.setInterval(function() {
                if (torus.per <= para.perc) {
                    torus.per = torus.per + 0.02;
                    if (torus.path) {
                        torus.path.remove();
                    }
                    torus.x = torus.halfDime + torus.r * Math.cos(2 * torus.PI * (torus.per - 0.25));
                    torus.y = torus.halfDime + torus.r * Math.sin(2 * torus.PI * (torus.per - 0.25));
                    torus.path = torus.paper.path(
                        'M' +
                            torus.x0 +
                            ',' +
                            torus.y0 +
                            'A' +
                            torus.r +
                            ',' +
                            torus.r +
                            ',0,' +
                            (torus.per > 0.5 ? 1 : 0) +
                            ',1,' +
                            torus.x +
                            ',' +
                            torus.y
                    );
                    torus.path.attr({
                        stroke: para.fgColor,
                        'stroke-width': para.width
                    });
                } else {
                    window.clearInterval(torus.si);
                    torus.per = 0;
                }
            }, para.animationstep);
        } else if (para.type === 'half-a') {
            torus.bgPath = torus.paper.path(
                'M' +
                    (torus.halfDime + torus.r * Math.cos(0)) +
                    ',' +
                    (torus.halfDime + torus.r * Math.sin(0)) +
                    'A' +
                    torus.r +
                    ',' +
                    torus.r +
                    ',0,1,1,' +
                    (torus.halfDime + torus.r * Math.cos(2 * torus.PI * 0.5)) +
                    ',' +
                    (torus.halfDime + torus.r * Math.sin(2 * torus.PI * 0.5))
            );
            torus.x = torus.halfDime + torus.r * Math.cos(2 * torus.PI * para.perc / 2);
            torus.y = torus.halfDime + torus.r * Math.sin(2 * torus.PI * para.perc / 2);
            torus.path = torus.paper.path(
                'M' +
                    (torus.halfDime + torus.r * Math.cos(0)) +
                    ',' +
                    (torus.halfDime + torus.r * Math.sin(0)) +
                    'A' +
                    torus.r +
                    ',' +
                    torus.r +
                    ',0,0,1,' +
                    torus.x +
                    ',' +
                    torus.y
            );
            torus.path.attr({
                stroke: para.fgColor,
                'stroke-width': para.width
            });
        }
        torus.bgPath.attr({
            stroke: para.bgColor,
            'stroke-width': para.width
        });
    };
    if (typeof define === 'function' && define.amd) {
        define('torus', [], function() {
            return ob;
        });
    } else {
        window.torus = ob;
    }
})(window, Raphael);
