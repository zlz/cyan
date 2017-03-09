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
app.config(['$stateProvider', '$urlRouterProvider', '$sceDelegateProvider', '$httpProvider', 'bridgeProvider', 'GLOBAL_CONFIG', function($stateProvider, $urlRouterProvider, $sceDelegateProvider, $httpProvider, bridgeProvider, GLOBAL_CONFIG) {
        $urlRouterProvider.deferIntercept(false);
        bridgeProvider.store('$stateProvider', $stateProvider);
        bridgeProvider.store('$urlRouterProvider', $urlRouterProvider);
        bridgeProvider.store('GLOBAL_CONFIG', GLOBAL_CONFIG);
        $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://platform.sina.com.cn/slide/album', 'https://angularjs.org/**']);
        $httpProvider.interceptors.push('appInterceptor');
        $httpProvider.defaults.headers.common['X-Requested-By'] = 'cyan';
    }])
    .run(['$rootScope', '$injector', '$urlRouter', '$q', 'crud', 'bridge', function($rootScope, $injector, $urlRouter, $q, crud, bridge) {
        let deferred = $q.defer();
        crud.$http({
                method: 'GET',
                url: bridge.GLOBAL_CONFIG.path + 'common.do?lang=cn'
            })
            .then((res) => {
                res.data.data.nav.forEach(function(item) {
                    bridge.$stateProvider.state({
                        name: item.href,
                        url: '/' + item.href,
                        templateUrl: './views/' + item.href + '.htm',
                        controller: item.href + 'Ctrl as ' + item.href + 'ctrl'
                    });
                });
                bridge.$urlRouterProvider.when('', '/home');
                bridge.$urlRouterProvider.otherwise('/404');
                $urlRouter.sync();
                deferred.resolve(res);
            }, (err) => {
                deferred.reject(err);
            });
        bridge.store('getCommonData', deferred.promise);
    }])
    .controller('appCtrl', ['$rootScope', '$scope', 'bridge', ($rootScope, $scope, bridge) => {
        let vm = $scope.appctrl;
        let trans = localStorage.getItem('trans');
        if (!trans) {
            vm.trans = 'cn';
        } else {
            vm.trans = trans;
        }
        vm.transFn = function(para) {
            vm.trans = para;
            localStorage.setItem('trans', para);
        };
        bridge.getCommonData.then((res) => {
            vm.data = res.data.data;
            console.log(vm.data);
            
        });
    }]);