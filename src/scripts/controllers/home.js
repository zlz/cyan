/*global angular zslide*/
angular.module('app')
    .controller('homeCtrl', ['$scope', 'bridge', 'crud', ($scope, bridge, crud) => {
        bridge.getCommonData.then(() => {
            let path = bridge.GLOBAL_CONFIG.path;
            let vm = $scope.homectrl;
            vm.title = 'home.htm';
            crud.$resource(path + 'album.do?lang=cn')
                .get()
                .$promise.then((res) => {
                    vm.zslide = zslide.data = res.data;
                    zslide($('.sld'), 3000);
                });
        });
    }]);