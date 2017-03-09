/*global angular*/
let app = angular.module('app', ['ui.router', 'ngResource', 'ui.bootstrap']);
require('./controllers/home');
require('./controllers/codes');
require('./controllers/about');
require('./directives/hd');
require('./directives/ft');
require('./provider/globalConfig');
require('./provider/crud');
require('./provider/bridge');
require('./provider/appInterceptor');
require('./provider/trans');
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
            transFn: (para) => {
                $rootScope.rootComm.trans = para;
                localStorage.setItem('trans', para);
                trans($rootScope.rootComm.trans);
            }
        };
        if (!localTrans) {
            $rootScope.rootComm.trans = 'cn';
        } else {
            $rootScope.rootComm.trans = localTrans;
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
    .controller('appCtrl', ['$rootScope', '$scope', 'bridge', ($rootScope, $scope, bridge) => {
    }]);