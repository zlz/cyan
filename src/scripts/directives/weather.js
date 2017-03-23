/*global angular*/
angular.module('app')
    .directive('weather', () => {
        return {
            restrict: 'E',
            scope: {},
            template: `<div class="lst1 pd-20 mg-b-20 clear text-center">
                <span class="em-18">{{data.cityInfo.c3}} {{data.f1.day_weather}}</span>
                <span class="em-60 clr1">{{data.f1.day_air_temperature}}℃</span><br>
                <span class="em-14">明天{{data.f2.day_weather}},{{data.f2.day_air_temperature}}℃，
                后天{{data.f3.day_weather}},{{data.f3.day_air_temperature}}℃</span>
            </div>`,
            controller: ['$rootScope', '$scope', 'bridge', 'crud', ($rootScope, $scope, bridge, crud) => {
                const path = bridge.GLOBAL_CONFIG.path;
                $scope.getWeather = () => {
                    crud.$http({
                            method: 'GET',
                            url: path + 'sho/9-6?area=' + encodeURIComponent('杭州') + '&need3HourForcast=0&needAlarm=0&needHourData=0&needIndex=0&needMoreDay=0&showapi_appid=33446&spotId=&showapi_sign=d3f5fd95469849eb859a84e27023fa00&lang=' + $rootScope.rootComm.trans
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