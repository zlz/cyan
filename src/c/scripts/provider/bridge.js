/*global angular*/
angular.module('app')
    .provider('bridge', function() {
        let that = this;
        this.$get = () => {
            return that;
        };
        this.store = (...para) => {
            that[para[0]] = para[1];
        };
    });