/*global angular */
angular.module('app')
    .controller('newsCtrl', ['$rootScope', '$scope', 'bridge', 'crud', ($rootScope, $scope, bridge, crud) => {
        const path = bridge.GLOBAL_CONFIG.path;
        $scope.news = {
            chanelNames: ['国际焦点', '国内焦点', '军事焦点', '互联网焦点', '娱乐焦点']
        };
        $scope.news.selectedChanelName = $scope.news.chanelNames[0];
        $scope.getNews = (para) => {
            $scope.news.selectedChanelName = para;
            crud.$http({
                    method: 'GET',
                    url: '/api/sho/109-35?channelId=&channelName=' + $scope.news.selectedChanelName + '&maxResult=20&needAllList=1&needContent=1&needHtml=1&page=1&showapi_appid=33446&&title=&showapi_sign=d3f5fd95469849eb859a84e27023fa00&lang=' + $rootScope.rootComm.trans
                })
                .then((res) => {
                    $scope.news.data = res.data.showapi_res_body.pagebean;
                });
        };
        $rootScope.$watch('rootComm.trans', () => {
            $scope.getNews($scope.news.selectedChanelName);
        });
    }]);