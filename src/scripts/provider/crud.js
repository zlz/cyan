/*global angular*/
angular.module('app')
    .provider('crud', function() {
        let $http, $resource, $q;
        this.$http = (paras) => {
            let deferred = $q.defer();
            $http({
                    method: paras.method,
                    url: paras.url,
                    data: paras.data,
                    params: paras.params,
                    jsonpCallbackParam: paras.jsonpCallbackParam || 'callback',
                    responseType: paras.responseType
                })
                .then((res) => {
                    deferred.resolve(res);
                }, (err) => {
                    deferred.rejecct(err);
                });
            return deferred.promise;
        };
        this.$resource = (paras) => {
            let deferred = $q.defer();
            $http({
                    method: paras.method,
                    url: paras.url,
                    data: paras.data,
                    params: paras.params,
                    jsonpCallbackParam: paras.jsonpCallbackParam || 'callback',
                    responseType: paras.responseType
                })
                .then((res) => {
                    deferred.resolve(res);
                }, (err) => {
                    deferred.rejecct(err);
                });
            return deferred.promise;
        };
        this.$get = ['$http', '$resource', '$q', function(_$http, _$resource, _$q) {
            $http = _$http;
            $resource = _$resource;
            $q = _$q;
            return this;
        }];
    });