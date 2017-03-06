/*global angular */
angular.module('app')
    .controller('codesCtrl', ['$scope', 'bridge', 'crud', ($scope, bridge, crud) => {
        bridge.getCommonData.then(() => {
            let vm = $scope.codesctrl;
            vm.title = 'codes.htm';
            crud.$http({
                    method: 'GET',
                    url: '/api/codes'
                })
                .then((res) => {
                    vm.data = res.data;
                    $scope.$apply(() => vm.data = res.data);
                });
        });
    }]);