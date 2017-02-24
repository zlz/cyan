/*global angular*/
angular.module('app')
    .directive('hd', () => {
        return {
            restrict: 'E',
            scope: {
                dt: '='
            },
            template: `<div class="hd">
            <div class="w-1000">
                <ul class="vm">
                    <li class="ib mg-r-50" ng-class="{'mg-l-20': $index === 0}" ng-repeat="item in dt">
                        <a class="ib pd-lr-10" ui-sref="{{item.href}}">{{item.text}}</a>
                    </li>
                </ul>
            </div>
        </div>`,
            replace: true
        };
    });