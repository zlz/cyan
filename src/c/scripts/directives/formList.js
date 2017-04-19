/*global angular*/
angular.module('app')
    .directive('formList', () => {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '../../tpls/formList.htm',
            controller: ['$rootScope', '$scope', 'bridge', 'crud', ($rootScope, $scope, bridge, crud) => {
                $scope.getFormList = () => {
                    crud.$http({
                            method: 'GET',
                            url: bridge.G_CFG.api + 'form'
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