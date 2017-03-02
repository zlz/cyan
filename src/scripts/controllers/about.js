/*global angular */
angular.module('app')
    .controller('aboutCtrl', ['$scope', 'bridge', ($scope, bridge) => {
        bridge.getCommonData.then(() => {
            let vm = $scope.aboutctrl;
            vm.title = 'about.htm';
        });
    }]);