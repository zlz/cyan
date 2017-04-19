/*global angular */
angular.module('app')
    .controller('formCtrl', ['$rootScope', '$scope', 'bridge', 'crud', ($rootScope, $scope, bridge, crud) => {
        $scope.formSubmit = () => {
            if ($scope.submitValid) {
                window.cyan.pop('您提交的速度太快了！', 'warning');
                return false;
            }
            let req = $scope.formData;
            if (req && $scope.form.$valid) {
                $scope.submitValid = true;
                crud.$http({
                        method: 'post',
                        url: bridge.G_CFG.api + 'form',
                        data: req
                    })
                    .then(() => {
                        window.cyan.pop('成功提交！', 'success');
                        $scope.$broadcast('newMsg');
                        setTimeout(() => {
                            $scope.submitValid = false;
                        }, 5000);
                    });
            }
        };
    }]);