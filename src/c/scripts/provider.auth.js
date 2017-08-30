/*global angular*/
/*global angular*/
angular.module('app').provider('auth', function() {
    let that = this;
    this.$get = () => {
        return that;
    };
    this.login = (...para) => {
        return true;
    };
});
