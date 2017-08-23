/*global angular */
angular.module('app').controller('newsCtrl', [
    '$rootScope',
    '$scope',
    'bridge',
    'crud',
    ($rootScope, $scope, bridge, crud) => {
        $scope.news = { chanelNames: ['国际焦点', '国内焦点', '军事焦点', '互联网焦点', '娱乐焦点'] };
        $scope.news.selectedChanelName = $scope.news.chanelNames[0];
        $scope.getNews = (...para) => {
            $scope.news.selectedChanelName = para[0];
            if (para[1]) {
                crud.cancel();
            }
            $scope.news.data = undefined;
            crud
                .$http({
                    method: 'GET',
                    url:
                        bridge.G_CFG.api +
                        'sho/109-35?&channelId=&channelName=' +
                        encodeURIComponent($scope.news.selectedChanelName) +
                        '&maxResult=15&needAllList=0&needContent=0&needHtml=0&page=1&showapi_appid=33446&&title=&showapi_sign=d3f5fd95469849eb859a84e27023fa00&',
                    cache: bridge.lruCache('news' + encodeURIComponent($scope.news.selectedChanelName), 10)
                })
                .then(res => {
                    if (res) {
                        $scope.news.data = res.data.showapi_res_body.pagebean;
                    }
                });
        };
        $scope.getNews($scope.news.selectedChanelName);
    }
]);
