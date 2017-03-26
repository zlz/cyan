/*global angular*/
angular.module('app')
    .directive('list', () => {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                data: '=',
            },
            template: `<div>
                <div class="pd-30 text-center"  ng-if="!data.contentlist">
                    数据加载中...
                </div>
                <ul ng-else>
                    <li ng-repeat="item in data.contentlist" class="lst1 pd-20 mg-b-20 clear">
                        <a target="_blank" ng-href="{{item.link}}">
                            <div class="pd-b-5 em-18">{{item.title}}</div>
                            <div class="dest" ng-bind="item.dest"></div>
                        </a>
                        <div ng-if="item.imageurls.length > 0">
                            <div class="pd-tb-10">
                                <img style="max-width: 100%; max-height:300px;" ng-src="{{item.imageurls[0].url}}">
                            </div>
                        </div>
                        <div class="pull-right em-12 grey"><span class="mg-r-10"><i class="icon iconfont icon-fangkelaiyuan mg-r-5"></i>{{item.source}}</span><span class="mg-r-10"><i class="icon iconfont icon-shizhong mg-r-5"></i>{{item.pubDate}}</span></div>
                    </li>
                </ul>
            </div>`
        };
    });