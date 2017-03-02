/*global angular */
angular.module('app')
    .controller('homeCtrl', ['$scope', 'bridge', ($scope, bridge) => {
        bridge.getCommonData.then(() => {
            let vm = $scope.homectrl;
            vm.title = 'home.htm';
        });
    }]);