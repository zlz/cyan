/*global angular*/
angular.module('app')
    .provider('auth', function() {
        let that = this;
        this.$get = () => {
            return that;
        };
        this.create = (...para) => {
            window.sessionStorage.setItem('userAuth', JSON.stringify(para[0]));
            return true;
        };
        this.check = (...para) => {
            if (window.sessionStorage.getItem('userAuth')) {
                return true;
            } else {
                return false;
            }
        };
        this.destory = (...para) => {
            window.sessionStorage.removeItem('userAuth');
            return true;
        }
    });