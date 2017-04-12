/*global angular*/
angular.module('app')
    .directive('hd', () => {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                data: '=',
            },
            templateUrl: '../../tpls/hd.htm',
            link: ($scope) => {
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
            }
        };
    });