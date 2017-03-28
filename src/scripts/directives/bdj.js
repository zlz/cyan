/*global angular*/
angular.module('app')
    .directive('bdj', () => {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: '../../views/bdj.htm',
            controller: ['$rootScope', '$scope', 'bridge', 'crud', ($rootScope, $scope, bridge, crud) => {
                const path = bridge.GLOBAL_CONFIG.path;
                $scope.getWeather = () => {
                    crud.$http({
                            method: 'GET',
                            url: path + 'sho/255-1?page=&showapi_appid=33446&title=&type=&showapi_sign=d3f5fd95469849eb859a84e27023fa00&lang=' + $rootScope.rootComm.trans,
                            cache: bridge.lruCache('bdj', 10)
                        })
                        .then((res) => {
                            if (res) {
                                $scope.data = res.data.showapi_res_body.pagebean;
                            }
                        });
                };
                $scope.getWeather();
            }]
        };
    });