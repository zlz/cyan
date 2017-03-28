/*global angular*/
angular.module('app')
    .directive('weather', () => {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: '../../views/weather.htm',
            controller: ['$rootScope', '$scope', 'bridge', 'crud', ($rootScope, $scope, bridge, crud) => {
                const path = bridge.GLOBAL_CONFIG.path;
                $scope.getWeather = () => {
                    crud.$http({
                            method: 'GET',
                            url: path + 'sho/9-6?area=' + encodeURIComponent('杭州') + '&need3HourForcast=0&needAlarm=0&needHourData=0&needIndex=0&needMoreDay=0&showapi_appid=33446&spotId=&showapi_sign=d3f5fd95469849eb859a84e27023fa00&lang=' + $rootScope.rootComm.trans,
                            cache: bridge.lruCache('weather', 10)
                        })
                        .then((res) => {
                            if (res) {
                                $scope.data = res.data.showapi_res_body;
                            }
                        });
                };
                $scope.getWeather();
            }]
        };
    });