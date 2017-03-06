/*global angular*/
angular.module('app')
    .provider('crud', function() {
        let $http, $resource;
        this.$http = (paras) => {
            return new Promise((resolve, rejecct) => {
                $http({
                        method: paras.method,
                        url: paras.url,
                        data: paras.data,
                        params: paras.params,
                        jsonpCallbackParam: paras.jsonpCallbackParam || 'callback',
                        responseType: paras.responseType
                    })
                    .then((res) => {
                        resolve(res);
                    }, (err) => {
                        rejecct(err);
                    });
            });
        };
        this.$resource = (paras) => {
            return new Promise((resolve, rejecct) => {
                $http({
                        method: paras.method,
                        url: paras.url,
                        data: paras.data,
                        params: paras.params,
                        jsonpCallbackParam: paras.jsonpCallbackParam || 'callback',
                        responseType: paras.responseType
                    })
                    .then((res) => {
                        resolve(res);
                    }, (err) => {
                        rejecct(err);
                    });
            });
        };
        this.$get = ['$http', '$resource', function(_$http, _$resource) {
            $http = _$http;
            $resource = _$resource;
            return this;
        }];
    });