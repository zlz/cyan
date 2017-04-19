/*global angular md5*/
angular.module('app')
    .controller('loginCtrl', ['$rootScope', '$scope', 'bridge', 'crud', ($rootScope, $scope, bridge, crud) => {
        $scope.formSubmit = () => {
            if ($scope.submitValid) {
                window.cyan.pop('您提交的速度太快了！', 'warning');
                return false;
            }
            let req = {
                name: $scope.formData.name,
                pswd: md5($scope.formData.pswd)
            };
            if (req && $scope.form.$valid) {
                $scope.submitValid = true;
                crud.$http({
                        method: 'post',
                        url: bridge.G_CFG.api + 'login',
                        data: req
                    })
                    .then((res) => {
                        if (res.data.status === 1003) {
                            window.cyan.pop(res.data.msg, 'warning');
                        } else {
                            bridge.auth.create(res.data.data);
                            bridge.$state.go('home');
                        }
                        setTimeout(() => {
                            $scope.submitValid = false;
                        }, 5000);
                    });
            }
        };
    }]);