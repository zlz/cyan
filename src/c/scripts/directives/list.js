/*global angular*/
angular.module('app')
    .directive('list', ['bridge', (bridge) => {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                data: '=',
            },
            templateUrl: bridge.G_CFG.url + 'tpls/list.htm'
        };
    }]);