/*global angular*/
angular.module('app')
    .factory('trans', ['$rootScope', '$q', '$urlRouter', 'bridge', 'crud', function($rootScope, $q, $urlRouter, bridge, crud) {
        return (para) => {
            crud.$http({
                    method: 'GET',
                    url: bridge.GLOBAL_CONFIG.path + 'web/common?lang=' + para,
                    cache: true
                })
                .then((res) => {
                    if (res) {
                        $rootScope.rootComm.dt = res.data.data;
                    }
                }, (err) => {
                    console.log(err);
                });
        };
    }]);