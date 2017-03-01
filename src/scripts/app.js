/*global angular*/
let app = angular.module('app', ['ui.router', 'ui.bootstrap']);
require('./controllers/home');
require('./directives/hd');
require('./directives/ft');
require('./provider/crud');
require('./provider/bridge');
app.config(['$stateProvider', '$urlRouterProvider', '$injector', 'bridgeProvider', function($stateProvider, $urlRouterProvider, $injector, bridgeProvider) {
        $urlRouterProvider.deferIntercept(false);
        bridgeProvider.store('$stateProvider', $stateProvider);
        bridgeProvider.store('$urlRouterProvider', $urlRouterProvider);
    }])
    .run(['$rootScope', '$injector', '$urlRouter', 'crud', 'bridge', function($rootScope, $injector, $urlRouter, crud, bridge) {
        let getCommonData = new Promise((resolve, reject) => {
            crud({
                    method: 'GET',
                    url: './datas/common.json'
                })
                .then((res) => {
                    resolve(res);
                    res.data.cn.hd.nav.forEach(function(item) {
                        bridge.$stateProvider.state({
                            name: item.href,
                            url: '/' + item.href,
                            templateUrl: '../views/' + item.href + '.htm'
                        });
                    });
                    bridge.$urlRouterProvider.when('/', '/home');
                    bridge.$urlRouterProvider.otherwise('/404');
                    $urlRouter.sync();
                }, (err) => {
                    reject(err);
                });
        });
        bridge.store('getCommonData', getCommonData);
    }])
    .controller('appCtrl', ['$rootScope', '$scope', 'bridge', ($rootScope, $scope, bridge) => {
        let vm = $scope.appctrl;
        vm.translate = 'cn';
        bridge.getCommonData.then((val) => {
            $scope.$apply(() => vm.data = val.data);
        });
    }]);