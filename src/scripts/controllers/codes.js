/*global angular */
angular.module('app')
    .controller('codesCtrl', ['$scope', 'bridge', 'crud', ($scope, bridge, crud) => {
        bridge.getCommonData.then(() => {
            let vm = $scope.codesctrl;
            vm.title = 'codes.htm';
            crud.$http({
                    method: 'GET',
                    url: '/data/imgs?col=壁纸&tag=风景&sort=0&pn=3&rn=3&p=channel&from=1'
                })
                .then((res) => {
                    vm.data = res.data;
                });
        });
    }]);