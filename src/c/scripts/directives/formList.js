/*global angular*/
angular.module('app')
    .directive('formList', ['bridge', (bridge) => {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: bridge.G_CFG.url + 'tpls/formList.htm',
            controller: ['$rootScope', '$scope', 'bridge', 'crud', ($rootScope, $scope, bridge, crud) => {
                let getFormList = () => {
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
                getFormList();
                $scope.$on('newMsg', () => {
                    $scope.data.unshift(JSON.parse(JSON.stringify($scope.formData)));
                });
            }]
        };
    }]);