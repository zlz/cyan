/*global angular */
angular.module('app')
    .controller('formCtrl', ['$rootScope', '$scope', 'bridge', 'crud', ($rootScope, $scope, bridge, crud) => {
        const path = bridge.GLOBAL_CONFIG.path;
        $scope.formSubmit = () => {
            let req = $scope.formData;
            if (req && $scope.form.$valid) {
                crud.$http({
                        method: 'post',
                        url: path + 'admin/form.do?lang=' + $rootScope.rootComm.trans,
                        data: req 
                    })
                    .then(() => {
                        window.cyan.pop('成功提交！', 'success');
                    });
            }
        };
        $scope.$on('$destroy', () => {
            if ($rootScope.transWatch instanceof Function) {
                $rootScope.transWatch();
            }
        });
    }]);