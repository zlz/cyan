/*global angular */
angular.module('app')
    .controller('codesCtrl', ['$rootScope', '$scope', 'bridge', 'crud', ($rootScope, $scope, bridge, crud) => {
        const path = bridge.GLOBAL_CONFIG.path;
        $scope.title = 'codes.htm';
        let getData = () => {
            crud.$http({
                    method: 'GET',
                    url: path + 'codes.do?lang=' + $rootScope.rootComm.trans
                })
                .then((res) => {
                    $scope.data = res.data.data;
                });
        };
        $rootScope.$watch('rootComm.trans', () => {
            getData();
        });
    }]);