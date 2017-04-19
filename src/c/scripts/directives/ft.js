/*global angular*/
angular.module('app')
    .directive('ft', ['bridge', (bridge) => {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                data: '='
            },
            templateUrl: bridge.G_CFG.url + 'tpls/ft.htm',
        };
    }]);