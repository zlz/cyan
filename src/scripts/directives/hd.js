/*global angular*/
angular.module('app')
    .directive('hd', () => {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                data: '=',
            },
            template: `<div class="hd">
                <div class="hd-bg">
                    <a href="#" class="logo"></a>
                </div>
                <div class="hd-ct" ng-class="{on:menuBool}" ng-swipe-right="menuFn()">
                    <ul class="vm" ng-click="menuFn()">
                        <li class="ib" ng-repeat="item in data.dt.nav">
                            <a class="ib pd-lr-15" ui-sref="{{item.href}}" ui-sref-active="active">{{item.text}}</a>
                        </li>
                    </ul>
                    <div class="translate em-12 cur"><span class="pd-r-10" ng-click="data.transFn()">{{data.transFlag}}</span></div>
                    <i class="icon iconfont icon-caidan h5-menu-btn em-24" ng-click="menuFn()"></i>
                </div>
            </div>`,
            controller: ['$rootScope', '$scope', ($rootScope, $scope) => {
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
            }]
        };
    });