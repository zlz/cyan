/*global angular */
angular.module('app')
    .controller('codesCtrl', ['$rootScope', '$scope', 'bridge', 'crud', ($rootScope, $scope, bridge, crud) => {
        const path = bridge.GLOBAL_CONFIG.path;
        $scope.title = 'codes.htm';
        let getData = () => {
            crud.$http({
                    method: 'GET',
                    url: path + 'admin/codes.do?lang=' + $rootScope.rootComm.trans
                })
                .then((res) => {
                    if (res) {
                        $scope.data = res.data.data;
                    }
                });
        };
        $rootScope.transWatch = $rootScope.$watch('rootComm.trans', () => {
            getData();
        });
        $scope.$on('$destroy', () => {
            if ($rootScope.transWatch instanceof Function) {
                $rootScope.transWatch();
            }
        });
    }]);