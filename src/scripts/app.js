/*global angular*/
let app = angular.module('app', ['ui.router', 'ui.bootstrap']);
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    /* 使用when来对一些不合法的路由进行重定向 */
    $urlRouterProvider.when('', '/');
    /* 通过$stateProvider的state()函数来进行路由定义 */
    $stateProvider.state('/', {
            url: '/',
            templateUrl: '../views/index.htm'
        })
        .state('/codes', {
            url: '/codes',
            templateUrl: '../views/codes.htm'
        })
        .state('/about', {
            url: '/about',
            templateUrl: '../views/about.htm'
        });
}]);
require('./controllers/common');
require('./controllers/app');
require('./directives/hd');
require('./directives/ft');
require('./services/crud');