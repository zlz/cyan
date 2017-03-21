/*global angular*/
angular.module('app')
    .directive('hd', () => {
        return {
            restrict: 'E',
            scope: {
                data: '=',
            },
            template: `<div class="hd">
            <div class="w-1140">
                <div class="hd-btm" ng-class="{on:menuBool}">
                        <div class="translate em-12 cur"><span class="pd-r-10" ng-click="data.transFn()">{{data.transFlag}}</span></div>
                        <i class="icon iconfont icon-caidan h5-menu em-24" ng-click="menuFn()"></i>
                </div>
                <ul class="vm relative" ng-class="{on:menuBool}">
                    <li class="ib" ng-repeat="item in data.dt.nav" ng-click="menuFn()">
                        <a class="ib pd-lr-15" ui-sref="{{item.href}}" ui-sref-active="active">{{item.text}}</a>
                    </li>
                </ul>
            </div>
        </div>`,
            replace: true,
            controller: ['$rootScope', '$scope', ($rootScope, $scope) => {
                $scope.menuFn = () => {
                    if ($(window)
                        .width() < 992) {
                        $scope.menuBool = !$scope.menuBool;
                    }
                };
            }]
        };
    });