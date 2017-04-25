/*global angular*/
angular.module('app')
    .directive('hd', ['$rootScope', 'bridge', ($rootScope, bridge) => {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                data: '=',
            },
            templateUrl: bridge.G_CFG.url + 'tpls/hd.htm',
            link: ($scope) => {
                $scope.nav = [];
                $scope.data.forEach((item) => {
                    if (item.parent === 'root') {
                        $scope.nav.push(item);
                    }
                });
                $scope.menuFn = () => {
                    if ($(window)
                        .width() < 992) {
                        $scope.menuBool = !$scope.menuBool;
                        if ($scope.menuBool && navigator.userAgent.indexOf('Android') > -1) {
                            $(document)
                                .find('video')
                                .hide();
                        } else {
                            $(document)
                                .find('video')
                                .show();
                        }
                    }
                };
                $scope.themeFn = () => {
                    if ($rootScope.common.theme) {
                        $rootScope.common.theme.idx = $rootScope.common.theme.idx + 1;
                        if ($rootScope.common.theme.idx >= $rootScope.common.dt.theme.length) {
                            $rootScope.common.theme.idx = 0;
                        }
                        $rootScope.common.theme.val = $rootScope.common.dt.theme[$rootScope.common.theme.idx];
                        localStorage.setItem('theme', JSON.stringify($rootScope.common.theme));
                    } else {
                        window.cyan.pop('数据读取中');
                    }
                };
            }
        };
    }]);