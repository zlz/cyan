/*global angular*/
angular.module('app')
    .directive('hd', () => {
        return {
            restrict: 'E',
            scope: {
                dt: '='
            },
            template: `<div class="hd relative">
            <div class="w-1140">
                <ul class="vm">
                    <li class="ib mg-r-30" ng-class="{'mg-l-20': $index === 0}" ng-repeat="item in dt.data[dt.trans].hd.nav">
                        <a class="ib pd-lr-15" ui-sref="{{item.href}}" ui-sref-active="active">{{item.text}}</a>
                    </li>
                </ul>
                <div class="translate em-12 cur"><span class="pd-r-10" ng-click="dt.transFn('cn')">中</span><span ng-click="dt.transFn('en')">EN</span></div>
            </div>
        </div>`,
            replace: true
        };
    });