/*global angular*/
angular.module('app').factory('common', [
    '$rootScope',
    '$q',
    '$urlRouter',
    'bridge',
    'crud',
    function($rootScope, $q, $urlRouter, bridge, crud) {
        return () => {
            let deferred = $q.defer();
            crud
                .$http({
                    method: 'GET',
                    url: 'datas/common.json',
                    cache: true
                })
                .then(
                    res => {
                        if (res) {
                            deferred.resolve(res);
                        } else {
                            deferred.resolve(false);
                        }
                    },
                    err => {
                        deferred.rejecct(err);
                    }
                );
            return deferred.promise;
        };
    }
]);
