/*global angular*/
angular.module('app')
    .filter('trustHtml', ['$sce', ($sce) => {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);