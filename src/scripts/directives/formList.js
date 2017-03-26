/*global angular*/
angular.module('app')
    .directive('formList', () => {
        return {
            restrict: 'E',
            replace: true,
            template: `<ul class="pd-tb-30" ng-if="data.length > 0">
                <li ng-repeat="item in data" class="lst1 pd-20 mg-b-20 clear">
                        <div class="pd-b-5 em-18">{{item.name}}</div>
                        <div class="dest" ng-bind="item.msg"></div>
                    <div class="pull-right em-12 grey"><span class="mg-r-10"><i class="icon iconfont icon-qq mg-r-5"></i>{{item.qq}}</span><span class="mg-r-10"><i class="icon iconfont icon-email1 mg-r-5"></i>{{item.email}}</span></div>
                </li>
            </ul>`,
            controller: ['$rootScope', '$scope', 'bridge', 'crud', ($rootScope, $scope, bridge, crud) => {
                const path = bridge.GLOBAL_CONFIG.path;
                $scope.getFormList = () => {
                    crud.$http({
                            method: 'GET',
                            url: path + 'admin/get-form.do?lang=' + $rootScope.rootComm.trans
                        })
                        .then((res) => {
                            if (res) {
                                $scope.data = res.data.data;
                            }
                        });
                };
                $scope.getFormList();
                $scope.$on('newMsg', () => {
                    $scope.data.unshift(JSON.parse(JSON.stringify($scope.formData)));
                });
            }]
        };
    });