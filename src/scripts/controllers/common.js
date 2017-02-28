/*global angular */
angular.module('app')
    .controller('commonCtrl', ['$scope', '$injector', 'crud', ($scope, $injector, crud) => {
        let vm = $scope.commonctrl;
        crud({
                method: 'GET',
                url: '../../datas/common.json'
            })
            .then((res) => {
                $scope.$apply(() => vm.data = res.data);
            });

    }]);