/*global angular*/
angular.module('app')
    .directive('newsList', ['bridge', (bridge) => {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: bridge.G_CFG.url + 'tpls/newsList.htm',
            controller: ['$rootScope', '$scope', 'bridge', 'crud', ($rootScope, $scope, bridge, crud) => {
                $scope.getNewsList = () => {
                    crud.$http({
                            method: 'GET',
                            url: bridge.G_CFG.api + 'news'
                        })
                        .then((res) => {
                            if (res) {
                                $scope.data = res.data.data;
                            }
                        });
                };
                $scope.getNewsList();
                $scope.$on('newMsg', () => {
                    $scope.data.unshift(JSON.parse(JSON.stringify($scope.formData)));
                });
            }]
        };
    }]);