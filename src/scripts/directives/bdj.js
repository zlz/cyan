/*global angular*/
angular.module('app')
    .directive('bdj', () => {
        return {
            restrict: 'E',
            scope: {},
            template: `<ul ng-if="data.contentlist.length > 0" class="em-14">
                <li ng-repeat="item in data.contentlist" class="lst1 pd-20 mg-b-20 clear" ng-if="!item.video_uri">
                    <a target="_blank" ng-href="{{item.weixin_url}}">
                        <div class="pd-b-5 em-18">{{item.text}}</div>
                        <div class="pd-tb-10" ng-if="item.image0">
                            <img style="max-width: 100%; max-height:300px;" ng-src="{{item.image0}}">
                        </div>
                    </a>
                </li>
            </ul>`,
            controller: ['$rootScope', '$scope', 'bridge', 'crud', ($rootScope, $scope, bridge, crud) => {
                const path = bridge.GLOBAL_CONFIG.path;
                $scope.getWeather = () => {
                    crud.$http({
                            method: 'GET',
                            url: path + 'sho/255-1?page=&showapi_appid=33446&title=&type=&showapi_sign=d3f5fd95469849eb859a84e27023fa00&lang=' + $rootScope.rootComm.trans
                        })
                        .then((res) => {
                            $scope.data = res.data.showapi_res_body.pagebean;
                        });
                };
                $scope.getWeather();
            }]
        };
    });