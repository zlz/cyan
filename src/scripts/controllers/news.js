/*global angular */
angular.module('app')
    .controller('newsCtrl', ['$rootScope', '$scope', 'bridge', 'crud', ($rootScope, $scope, bridge, crud) => {
        const path = bridge.GLOBAL_CONFIG.path;
        $scope.news = {
            chanelNames: ['知乎日报', '国际焦点', '国内焦点', '军事焦点', '互联网焦点', '娱乐焦点']
        };
        $scope.news.selectedChanelName = $scope.news.chanelNames[0];
        $scope.getNews = (...para) => {
            let url = '';
            $scope.news.selectedChanelName = para[0];
            if (para[0] === '知乎日报') {
                url = path + 'zhihu';
            } else {
                url = path + 'sho/109-35?&channelId=&channelName=' + encodeURIComponent($scope.news.selectedChanelName) + '&maxResult=20&needAllList=0&needContent=0&needHtml=0&page=1&showapi_appid=33446&&title=&showapi_sign=d3f5fd95469849eb859a84e27023fa00&lang=' + $rootScope.rootComm.trans;
            }
            if (para[1]) {
                crud.cancel();
            }
            $scope.news.data = undefined;
            crud.$http({
                    method: 'GET',
                    url: url,
                    cache: bridge.lruCache('news' + encodeURIComponent($scope.news.selectedChanelName), 10)
                })
                .then((res) => {
                    if (res) {
                        if (res.data.stories) {
                            let dt = [];
                            for (let item of res.data.stories) {
                                dt.unshift({
                                    title: item.title,
                                    link: 'http://news-at.zhihu.com/story/' + item.id,
                                    imageurls: [{
                                        url: item.images[0].replace(/https:\/\//, 'https://images.weserv.nl/?url=')
                                    }],
                                    source: 'zhihu',
                                    pubDate: res.data.date
                                });
                            }
                            $scope.news.data = {
                                contentlist: dt
                            };
                            console.log($scope.news.data);
                        } else {
                            $scope.news.data = res.data.showapi_res_body.pagebean;
                            console.log($scope.news.data);
                        }
                    }
                });
        };
        $rootScope.transWatch = $rootScope.$watch('rootComm.trans', () => {
            $scope.getNews($scope.news.selectedChanelName);
        });
        $scope.$on('$destroy', () => {
            if ($rootScope.transWatch instanceof Function) {
                $rootScope.transWatch();
            }
        });
    }]);