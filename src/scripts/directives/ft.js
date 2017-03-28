/*global angular*/
angular.module('app')
    .directive('ft', () => {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                data: '='
            },
            templateUrl: '../../views/ft.htm',
        };
    });