import {
    app
} from '../common.js';
app.controller('AppCtrl', function () {
    this.hd = {
        nav: [{
            text: 'HOME',
            href: '/'
        },
        {
            text: 'CODES',
            href: '/codes'
        }, {
            text: 'ABOUT',
            href: '/about'
        }]
    };
    this.a = 1;
    console.log(this);
});