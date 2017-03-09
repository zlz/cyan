/*global angular */
angular.module('app')
    .controller('aboutCtrl', ['$scope', 'bridge', 'crud', ($scope, bridge, crud) => {
        bridge.getCommonData.then(() => {
            let rootPath = bridge.GLOBAL_CONFIG.rootPath;
            let vm = $scope.aboutctrl;
            vm.title = 'codes.htm';
        });
    }]);