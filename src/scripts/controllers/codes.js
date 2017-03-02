/*global angular */
angular.module('app')
    .controller('codesCtrl', ['$scope', 'bridge', ($scope, bridge) => {
        bridge.getCommonData.then(() => {
            let vm = $scope.codesctrl;
            vm.title = 'codes.htm';
        });
    }]);