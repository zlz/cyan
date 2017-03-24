/*global angular */
angular.module('app')
    .controller('formCtrl', ['$rootScope', '$scope', 'bridge', 'crud', ($rootScope, $scope, bridge, crud) => {
        const path = bridge.GLOBAL_CONFIG.path;
        $scope.formSubmit = () => {
            if ($scope.submitValid) {
                window.cyan.pop('您提交的速度太快了！', 'warning');
                return false;
            }
            $scope.submitValid = true;
            let req = $scope.formData;
            if (req && $scope.form.$valid) {
                crud.$http({
                        method: 'post',
                        url: path + 'admin/post-form.do?lang=' + $rootScope.rootComm.trans,
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
        $scope.$on('$destroy', () => {
            if ($rootScope.transWatch instanceof Function) {
                $rootScope.transWatch();
            }
        });
    }]);