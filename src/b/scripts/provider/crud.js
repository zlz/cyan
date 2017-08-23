/*global angular*/
angular.module('app').provider('crud', function() {
    let that = this,
        $http,
        $q;
    this.cancel = () => {};
    this.$http = paras => {
        let deferred = $q.defer();
        $http({
            method: paras.method,
            url: paras.url,
            data: paras.data,
            params: paras.params,
            jsonpCallbackParam: paras.jsonpCallbackParam || 'callback',
            responseType: paras.responseType,
            cache: paras.cache,
            timeout: paras.timeout
        }).then(
            res => {
                if (res && res.status !== -1) {
                    deferred.resolve(res);
                } else {
                    deferred.resolve(false);
                }
            },
            err => {
                deferred.rejecct(err);
            }
        );
        that.cancel = () => {
            return deferred.resolve(false);
        };
        return deferred.promise;
    };
    this.$get = [
        '$http',
        '$resource',
        '$q',
        function(_$http, _$resource, _$q) {
            $http = _$http;
            that.$resource = _$resource;
            $q = _$q;
            return this;
        }
    ];
});
