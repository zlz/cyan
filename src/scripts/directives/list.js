/*global angular*/
angular.module('app')
    .directive('list', () => {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                data: '=',
            },
            templateUrl: '../../views/list.htm'
        };
    });