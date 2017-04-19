/*global angular zslide*/
angular.module('app')
    .controller('homeCtrl', ['$rootScope', '$scope', 'bridge', 'crud', ($rootScope, $scope, bridge, crud) => {
        let getData = () => {
            crud.$resource(bridge.G_CFG.api + 'album', {}, {
                    get: {
                        method: 'GET',
                        cache: true
                    }
                })
                .get()
                .$promise.then((res) => {
                    bridge.$ocLazyLoad.load([{
                            files: ['../mods/zSlide/zslide.min.js'],
                            cache: true
                        }])
                        .then(() => {
                            $scope.zslide = zslide.data = res.data;
                            zslide($('.sld'), 6000);
                        });
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