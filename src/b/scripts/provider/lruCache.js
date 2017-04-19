/*global angular*/
angular.module('app')
    .service('lruCache', ['$cacheFactory', function($cacheFactory) {
        let that = this;
        return (...para) => {
            if (!that['lruCache-' + para[0]]) {
                that['lruCache-' + para[0]] = {
                    cache: $cacheFactory('lruCache-' + para[0]),
                    count: para[1]
                };
            }
            if (that['lruCache-' + para[0]].count === 0) {
                that['lruCache-' + para[0]].cache.removeAll();
                that['lruCache-' + para[0]].count = para[1];
            }
            that['lruCache-' + para[0]].count = that['lruCache-' + para[0]].count - 1;
            return that['lruCache-' + para[0]].cache;
        };
    }]);