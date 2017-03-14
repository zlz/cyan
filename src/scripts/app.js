/*global angular*/
let app = angular.module('app', ['ui.router', 'ngResource', 'ui.bootstrap']);
require('./controllers/home');
require('./controllers/news');
require('./controllers/codes');
require('./controllers/about');
require('./directives/hd');
require('./directives/ft');
require('./directives/list');
require('./directives/weather');
require('./directives/bdj');
require('./provider/globalConfig');
require('./provider/crud');
require('./provider/bridge');
require('./provider/appInterceptor');
require('./provider/trans');
require('./filter/trustHtml');
app.config(['$stateProvider', '$urlRouterProvider', '$sceDelegateProvider', '$httpProvider', 'bridgeProvider', 'GLOBAL_CONFIG', function($stateProvider, $urlRouterProvider, $sceDelegateProvider, $httpProvider, bridgeProvider, GLOBAL_CONFIG) {
        $urlRouterProvider.deferIntercept(false);
        bridgeProvider.store('$stateProvider', $stateProvider);
        bridgeProvider.store('$urlRouterProvider', $urlRouterProvider);
        bridgeProvider.store('GLOBAL_CONFIG', GLOBAL_CONFIG);
        $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://platform.sina.com.cn/slide/album', 'https://angularjs.org/**']);
        $httpProvider.interceptors.push('appInterceptor');
        $httpProvider.defaults.headers.common['X-Requested-By'] = 'cyan';
    }])
    .run(['$rootScope', '$injector', '$urlRouter', '$q', 'crud', 'bridge', 'trans', function($rootScope, $injector, $urlRouter, $q, crud, bridge, trans) {
        let localTrans = localStorage.getItem('trans');
        $rootScope.rootComm = {
            transFn: () => {
                if ($rootScope.rootComm.transFlag === '中') {
                    $rootScope.rootComm.transFlag = 'EN';
                    $rootScope.rootComm.trans = 'en';
                } else if ($rootScope.rootComm.transFlag === 'EN') {
                    $rootScope.rootComm.transFlag = '日';
                    $rootScope.rootComm.trans = 'jp';
                } else if ($rootScope.rootComm.transFlag === '日') {
                    $rootScope.rootComm.transFlag = 'FR';
                    $rootScope.rootComm.trans = 'fr';
                } else if ($rootScope.rootComm.transFlag === 'FR') {
                    $rootScope.rootComm.transFlag = '中';
                    $rootScope.rootComm.trans = 'cn';
                }
                localStorage.setItem('trans', $rootScope.rootComm.trans);
                trans($rootScope.rootComm.trans);
            },
        };
        if (!localTrans) {
            $rootScope.rootComm.trans = 'cn';
            $rootScope.rootComm.transFlag = '中';
        } else {
            $rootScope.rootComm.trans = localTrans;
            if ($rootScope.rootComm.trans === 'cn') {
                $rootScope.rootComm.transFlag = '中';
            } else if ($rootScope.rootComm.trans === 'en') {
                $rootScope.rootComm.transFlag = 'EN';
            } else if ($rootScope.rootComm.trans === 'jp') {
                $rootScope.rootComm.transFlag = '日';
            } else if ($rootScope.rootComm.trans === 'fr') {
                $rootScope.rootComm.transFlag = 'FR';
            }
        }
        trans($rootScope.rootComm.trans);
        $rootScope.$watch('rootComm.dt', () => {
            if ($rootScope.rootComm.dt && $rootScope.rootComm.routeFlag === undefined) {
                $rootScope.rootComm.routeFlag = true;
                $rootScope.rootComm.dt.nav.forEach(function(item) {
                    bridge.$stateProvider.state({
                        name: item.href,
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
    .controller('appCtrl', ['$rootScope', '$scope', 'bridge', ($rootScope, $scope, bridge) => {}]);