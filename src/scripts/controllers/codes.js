/*global angular */
angular.module('app')
    .controller('codesCtrl', ['$scope', 'bridge', 'crud', ($scope, bridge, crud) => {
        bridge.getCommonData.then(() => {
            let rootPath = bridge.GLOBAL_CONFIG.rootPath;
            let vm = $scope.codesctrl;
            vm.title = 'codes.htm';
            crud.$http({
                    method: 'GET',
                    url: rootPath + '/api/codes'
                })
                .then((res) => {
                    vm.data = res.data;
                });
        });
    }]);