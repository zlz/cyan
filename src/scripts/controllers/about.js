/*global angular */
angular.module('app')
    .controller('aboutCtrl', ['$scope', 'bridge', 'crud', ($scope, bridge, crud) => {
        const path = bridge.GLOBAL_CONFIG.path;
        $scope.title = 'codes.htm';
    }]);