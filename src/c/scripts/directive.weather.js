/*global angular*/
angular.module('app').directive('weather', [
    'bridge',
    bridge => {
        return {
            restrict: 'EA',
            replace: true,
            scope: {},
            templateUrl: bridge.G_CFG.url + 'tpls/weather.htm',
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
                                    'sho/9-6?area=' +
                                    encodeURIComponent('ć­ĺˇ') +
                                    '&need3HourForcast=0&needAlarm=0&needHourData=0&needIndex=0&needMoreDay=0&showapi_appid=33446&spotId=&showapi_sign=d3f5fd95469849eb859a84e27023fa00',
                                cache: bridge.lruCache('weather', 10)
                            })
                            .then(res => {
                                if (res) {
                                    $scope.data = res.data.showapi_res_body;
                                }
                            });
                    };
                    getWeather();
                }
            ]
        };
    }
]);
