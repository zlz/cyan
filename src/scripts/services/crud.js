/*global angular*/
angular.module('app')
    .service('crudServ', ['$http', ($http) => {
        return (para) => {
            // let def = $q.defer();
            // $http.get(para)
            //     .then((res) => {
            //         def.resolve(res);
            //     }, (err) => {
            //         def.rejecct(err);
            //     });
            // return def.promise;
            return new Promise((resolve, rejecct) => {
                $http({
                        method: para.method,
                        url: para.url,
                        data: para.data,
                        params: para.params,
                    })
                    .then((res) => {
                        resolve(res);
                    }, (err) => {
                        rejecct(err);
                    });
            });
        };
    }]);