/*global angular*/
angular.module('app')
    .factory('trans', ['$rootScope', '$q', '$urlRouter', 'bridge', 'crud', function($rootScope, $q, $urlRouter, bridge, crud) {
        return (para) => {
            crud.$http({
                    method: 'GET',
                    url: bridge.GLOBAL_CONFIG.path + 'admin/common.do?lang=' + para,
                    cache: false
                })
                .then((res) => {
                    $rootScope.rootComm.dt = res.data.data;
                }, (err) => {
                    console.log(err);
                });
        };
    }]);