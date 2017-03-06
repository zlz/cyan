/*global angular zslide*/
angular.module('app')
    .controller('homeCtrl', ['$scope', '$http', '$resource', 'bridge', 'crud', ($scope, $http, $resource, bridge, crud) => {
        bridge.getCommonData.then(() => {
            let vm = $scope.homectrl;
            vm.title = 'home.htm';
        });
        crud.$http({
                method: 'GET',
                url: 'api/album',
            })
            .then((res) => {
                console.log(res);
                zslide.data = res.data;
                zslide($('.sld'), 3000);
            });
    }]);