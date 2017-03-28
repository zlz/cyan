/*global angular*/
let app = angular.module('app', ['ui.router', 'ngResource', 'ui.bootstrap', 'ngAnimate', 'ngTouch']);
require('./controllers/home');
require('./controllers/news');
require('./controllers/form');
require('./controllers/about');
require('./directives/hd');
require('./directives/ft');
require('./directives/list');
require('./directives/formList');
require('./directives/weather');
require('./directives/bdj');
require('./provider/globalConfig');
require('./provider/crud');
require('./provider/bridge');
require('./provider/appInterceptor');
require('./provider/trans');
require('./provider/lruCache');
require('./filter/trustHtml');
app.config(['$stateProvider', '$urlRouterProvider', '$sceDelegateProvider', '$httpProvider', 'bridgeProvider', 'GLOBAL_CONFIG', function($stateProvider, $urlRouterProvider, $sceDelegateProvider, $httpProvider, bridgeProvider, GLOBAL_CONFIG) {
        $urlRouterProvider.deferIntercept(false);
        bridgeProvider.store('$stateProvider', $stateProvider);
        bridgeProvider.store('$urlRouterProvider', $urlRouterProvider);
        bridgeProvider.store('GLOBAL_CONFIG', GLOBAL_CONFIG);
        $sceDelegateProvider.resourceUrlWhitelist(['self', '']);
        $httpProvider.interceptors.push('appInterceptor');
        $httpProvider.defaults.headers.common['X-Requested-By'] = 'cyan';
    }])
    .run(['$rootScope', '$injector', '$urlRouter', '$state', '$stateParams', '$q', 'lruCache', '$cacheFactory', 'crud', 'bridge', 'trans', function($rootScope, $injector, $urlRouter, $state, $stateParams, $q, lruCache, $cacheFactory, crud, bridge, trans) {
        bridge.store('$state', $state);
        bridge.store('$stateParams', $stateParams);
        bridge.store('$cacheFactory', $cacheFactory);
        bridge.store('lruCache', lruCache);
        $rootScope.rootComm = {
            transFn: () => {
                if ($rootScope.rootComm.transFlag === '中') {
                    $rootScope.rootComm.transFlag = 'EN';
                    $rootScope.rootComm.trans = 'en';
                } else if ($rootScope.rootComm.transFlag === 'EN') {
                    $rootScope.rootComm.transFlag = '日';
                    $rootScope.rootComm.trans = 'ja';
                } else if ($rootScope.rootComm.transFlag === '日') {
                    $rootScope.rootComm.transFlag = 'FR';
                    $rootScope.rootComm.trans = 'fr';
                } else if ($rootScope.rootComm.transFlag === 'FR') {
                    $rootScope.rootComm.transFlag = '中';
                    $rootScope.rootComm.trans = 'zh-cn';
                }
                localStorage.setItem('trans', $rootScope.rootComm.trans);
                trans($rootScope.rootComm.trans);
            }
        };
        let localLang = localStorage.getItem('trans');
        let bowserLang = (navigator.language || navigator.browserLanguage)
            .toLowerCase();
        console.log(bowserLang);
        let getLang = (lang) => {
            $rootScope.rootComm.trans = lang;
            switch (lang) {
                case 'zh-cn':
                    {
                        $rootScope.rootComm.transFlag = '中';
                        break;
                    }
                case 'cn':
                    {
                        $rootScope.rootComm.trans = 'zh-cn';
                        localStorage.setItem('trans', 'zh-cn');
                        $rootScope.rootComm.transFlag = '中';
                        break;
                    }
                case 'en':
                    {
                        $rootScope.rootComm.transFlag = 'EN';
                        break;
                    }
                case 'ja':
                    {
                        $rootScope.rootComm.transFlag = '日';
                        break;
                    }
                case 'jp':
                    {
                        $rootScope.rootComm.trans = 'ja';
                        localStorage.setItem('trans', 'ja');
                        $rootScope.rootComm.transFlag = '日';
                        break;
                    }
                case 'fr':
                    {
                        $rootScope.rootComm.transFlag = 'FR';
                        break;
                    }
            }
        };
        if (localLang) {
            getLang(localLang);
        } else if (bowserLang) {
            getLang(bowserLang);
        } else {
            $rootScope.rootComm.trans = 'zh-cn';
            $rootScope.rootComm.transFlag = '中';
        }
        trans($rootScope.rootComm.trans);
        $rootScope.$watch('rootComm.dt', () => {
            if ($rootScope.rootComm.dt && $rootScope.rootComm.routeFlag === undefined) {
                $rootScope.rootComm.routeFlag = true;
                $rootScope.rootComm.dt.nav.forEach(function(item) {
                    bridge.$stateProvider.state({
                        name: item.href,
                        cache: true,
                        url: '/' + item.href,
                        templateUrl: './views/' + item.href + '.htm',
                        controller: item.href + 'Ctrl',
                        controllerAs: item.href + 'ctrl'
                    });
                });
                bridge.$urlRouterProvider.when('', '/home');
                bridge.$urlRouterProvider.otherwise('/404');
                $urlRouter.sync();
            }
        });
    }])
    .controller('appCtrl', ['$rootScope', '$scope', 'bridge', ($rootScope, $scope, bridge) => {
        let goTop = () => {
            $('html,body')
                .animate({
                    'scrollTop': 0
                }, 500);
        };
        $scope.$on('$stateChangeStart', () => {
            console.log(true);
            goTop();
        });
    }]);