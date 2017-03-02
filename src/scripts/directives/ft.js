/*global angular*/
angular.module('app')
    .directive('ft', () => {
        return {
            restrict: 'E',
            scope: {
                dt: '='
            },
            template: `<div class="ft">
            <div class="pd-r-10 pd-l-2 text-right em-12">
                <a ng-href="{{dt.data[dt.trans].ft.href}}">{{dt.data[dt.trans].ft.text}}</a>
            </div>
        </div>`,
            replace: true
        };
    });