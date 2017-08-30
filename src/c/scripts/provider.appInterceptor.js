/*global angular*/
angular.module('app').factory('appInterceptor', [
    '$q',
    function($q) {
        return {
            request: function(config) {
                return $q.when(config);
            },
            response: function(res) {
                return $q.when(res);
            },
            requestError: function(reqErr) {
                return $q.when(reqErr);
            },
            responseError: function(resErr) {
                return $q.when(resErr);
            }
        };
    }
]);
