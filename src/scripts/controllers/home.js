/*global angular zslide*/
angular.module('app')
    .controller('homeCtrl', ['$scope', '$http', '$resource', 'bridge', 'crud', ($scope, $http, $resource, bridge, crud) => {
        bridge.getCommonData.then(() => {
            let vm = $scope.homectrl;
            vm.title = 'home.htm';
        });
        crud.$http({
                method: 'GET',
                url: '/data/imgs?col=%E5%A3%81%E7%BA%B8&tag=%E9%A3%8E%E6%99%AF&sort=0&pn=3&rn=10&p=channel&from=1',
            })
            .then((res) => {
                let data = [];
                
                res.data.imgs.forEach((item) => {
                    data.push({
                        id: item.id,
                        title: item.desc,
                        url: item.imageUrl,
                        fromUrl: item.fromUrl
                    });
                });
                zslide.data = data;
                zslide($('.sld'), 3000);
            });
    }]);