/*global angular*/
angular.module('app')
    .directive('formList', () => {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '../../views/formList.htm',
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