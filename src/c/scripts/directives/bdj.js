/*global angular*/
angular.module('app').directive('bdj', [
    'bridge',
    bridge => {
        return {
            restrict: 'EA',
            replace: true,
            scope: {},
            templateUrl: bridge.G_CFG.url + 'tpls/bdj.htm',
            controller: [
                '$rootScope',
                '$scope',
                'bridge',
                'crud',
                ($rootScope, $scope, bridge, crud) => {
                    let getWeather = () => {
                        crud
                            .$http({
                                method: 'GET',
                                url:
                                    bridge.G_CFG.api +
                                    'sho/255-1?page=&showapi_appid=33446&title=&type=&showapi_sign=d3f5fd95469849eb859a84e27023fa00',
                                cache: bridge.lruCache('bdj', 10)
                            })
                            .then(res => {
                                if (res) {
                                    $scope.data = res.data.showapi_res_body.pagebean;
                                }
                            });
                    };
                    getWeather();
                }
            ]
        };
    }
]);
