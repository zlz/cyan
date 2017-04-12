/*global angular*/
angular.module('app')
    .directive('ft', () => {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                data: '='
            },
            templateUrl: '../../tpls/ft.htm',
        };
    });