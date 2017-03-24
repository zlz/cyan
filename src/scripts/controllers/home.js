/*global angular zslide*/
angular.module('app')
    .controller('homeCtrl', ['$rootScope', '$scope', 'bridge', 'crud', ($rootScope, $scope, bridge, crud) => {
        const path = bridge.GLOBAL_CONFIG.path;
        let getData = () => {
            crud.$resource(path + 'admin/album.do?lang=' + $rootScope.rootComm.trans)
                .get()
                .$promise.then((res) => {
                    $scope.zslide = zslide.data = res.data;
                    zslide($('.sld'), 6000);
                });
        };
        $rootScope.transWatch = $rootScope.$watch('rootComm.trans', () => {
            getData();
        });
        $scope.$on('$destroy', () => {
            clearInterval(window.animTimer);
            if ($rootScope.transWatch instanceof Function) {
                $rootScope.transWatch();
            }
        });
        $scope.zslideSwipe = (para) => {
            if (para === 'left') {
                zslide.animLeft();
            } else {
                zslide.animRight();
            }
        };
    }]);