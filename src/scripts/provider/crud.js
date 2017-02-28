/*global angular*/
angular.module('app')
    .provider('crud', function() {
        this.$get = ['$http', function($http) {
            return (paras) => {
                return new Promise((resolve, rejecct) => {
                    $http({
                            method: paras.method,
                            url: paras.url,
                            data: paras.data,
                            params: paras.params,
                        })
                        .then((res) => {
                            resolve(res);
                        }, (err) => {
                            rejecct(err);
                        });
                });
            };
        }];
    });