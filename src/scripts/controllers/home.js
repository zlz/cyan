/*global angular zslide*/
angular.module('app')
    .controller('homeCtrl', ['$rootScope', '$scope', 'bridge', 'crud', ($rootScope, $scope, bridge, crud) => {
        const path = bridge.GLOBAL_CONFIG.path;
        crud.$resource(path + 'album.do?lang=' + $rootScope.rootComm.trans)
            .get()
            .$promise.then((res) => {
                $scope.zslide = zslide.data = res.data;
                zslide($('.sld'), 3000);
            });
    }]);