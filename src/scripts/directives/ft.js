/*global angular*/
angular.module('app')
    .directive('ft', () => {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            template: `<div class="ft">
            <div class="pd-r-10 pd-l-2 text-right em-12">
                <a ng-href="{{data.dt.ft.href}}">{{data.dt.ft.text}}</a>
            </div>
        </div>`,
            replace: true
        };
    });