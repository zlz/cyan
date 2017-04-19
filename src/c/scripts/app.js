/*global angular*/
let app = angular.module('app', ['ngCookies', 'ui.router', 'ngResource', 'ui.bootstrap', 'ngAnimate', 'ngTouch', 'oc.lazyLoad']);
require('./directives/hd');
require('./directives/ft');
require('./directives/list');
require('./directives/formList');
require('./directives/weather');
require('./directives/bdj');
require('./provider/globalConfig');
require('./provider/crud');
require('./provider/bridge');
require('./provider/auth');
require('./provider/appInterceptor');
require('./provider/common');
require('./provider/lruCache');
require('./filter/trustHtml');
app.config(['$stateProvider', '$urlRouterProvider', '$sceDelegateProvider', '$httpProvider', 'bridgeProvider', 'G_CFG', function($stateProvider, $urlRouterProvider, $sceDelegateProvider, $httpProvider, bridgeProvider, G_CFG) {
        $urlRouterProvider.deferIntercept(false);
        bridgeProvider.store('$stateProvider', $stateProvider);
        bridgeProvider.store('$urlRouterProvider', $urlRouterProvider);
        bridgeProvider.store('G_CFG', G_CFG);
        $sceDelegateProvider.resourceUrlWhitelist(['self', '']);
        $httpProvider.interceptors.push('appInterceptor');
        $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.common['X-Requested-By'] = 'cyan';
    }])
    .run(['$cookies', '$rootScope', '$injector', '$urlRouter', '$state', '$stateParams', '$location', '$q', '$ocLazyLoad', 'lruCache', '$cacheFactory', 'crud', 'bridge', 'common', function($cookies, $rootScope, $injector, $urlRouter, $state, $stateParams, $location, $q, $ocLazyLoad, lruCache, $cacheFactory, crud, bridge, common) {
        bridge.store('$cookies', $cookies);
        bridge.store('$state', $state);
        bridge.store('$stateParams', $stateParams);
        bridge.store('$cacheFactory', $cacheFactory);
        bridge.store('$ocLazyLoad', $ocLazyLoad);
        bridge.store('lruCache', lruCache);
        $rootScope.common = {};
        let localTheme = JSON.parse(localStorage.getItem('theme'));
        if (localTheme) {
            $rootScope.common.theme = localTheme;
        } else {
            $rootScope.common.theme = {
                val: 'theme-1',
                idx: 0
            };
        }
        common(bridge.G_CFG.api)
            .then((res) => {
                $rootScope.common.dt = res.data.data;
                $rootScope.common.dt.nav.forEach(function(item) {
                    bridge.$stateProvider.state({
                        name: item.href,
                        title: item.text,
                        cache: true,
                        url: '/' + item.href,
                        templateUrl: './tpls/' + item.href + '.htm',
                        controller: item.href + 'Ctrl',
                        controllerAs: item.href + 'ctrl',
                        resolve: {
                            loadMod: ['$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load('./scripts/controllers/' + item.href + '.min.js');
                            }]
                        }
                    });
                });
                bridge.$urlRouterProvider.when('', () => {
                        if ($location.$$absUrl.indexOf('_escaped_fragment_') < 0) {
                            $state.go('home');
                        }
                    })
                    .when('/admin/:login', ['auth', (auth) => {
                        let userInfo = auth.login();
                        if (userInfo) {
                            $state.go($location.$$url);
                        } else {
                            $state.go('about');
                        }
                    }])
                    .otherwise('/404');
                $urlRouter.sync();
            });
    }])
    .controller('appCtrl', ['$rootScope', '$scope', 'bridge', ($rootScope, $scope, bridge) => {
        let goTop = () => {
            $('html,body')
                .animate({
                    'scrollTop': 0
                }, 500);
        };
        $scope.$on('$stateChangeStart', (event, toState) => {
            $rootScope.title = '.Beta Mach. ' + toState.title;
            bridge.$cookies.put('current_hash', toState.name);
            goTop();
        });
        $('body')
            .find('a[title="站长统计"]')
            .addClass('hide');
    }]);