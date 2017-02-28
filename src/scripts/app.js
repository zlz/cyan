/*global angular*/
let app = angular.module('app', ['ui.router', 'ui.bootstrap']);
require('./controllers/common');
require('./controllers/app');
require('./directives/hd');
require('./directives/ft');
require('./provider/crud');
require('./provider/bridge');
app.config(['$stateProvider', '$urlRouterProvider', '$injector', 'bridgeProvider', function($stateProvider, $urlRouterProvider, $injector, bridgeProvider) {
        $urlRouterProvider.when('', '/home');
        $urlRouterProvider.otherwise('/404');
        bridgeProvider.store('$stateProvider', $stateProvider);
    }])
    .run(['$injector', 'crud', 'bridge', function($injector, crud, bridge) {
        crud({
                method: 'GET',
                url: './datas/router.json'
            })
            .then((res) => {
                res.data.states.forEach(function(state) {
                    bridge.$stateProvider.state(state);
                });
            });
    }]);