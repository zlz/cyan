/*global angular */
angular.module('app')
    .controller('commonCtrl', ['$scope', '$http', 'crudServ', ($scope, $http, crudServ) => {
        let vm = $scope.commonctrl;
        crudServ({
                method: 'POST',
                url: '../../datas/common.json'
            })
            .then((res) => {
                console.log(res);
                $scope.$apply(() => vm.data = res.data);
            });
    }]);