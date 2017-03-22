angular.module('app').controller('searchController', ['$scope', '$http', function ($scope, $http) {
    var that = $scope;
    that.apiURL = 'http://localhost:3000/api';
    that.products = [];
    that.filter = '';
    that.doFilter = false;
    that.init = (host) => {
        if (host) {
            that.apiURL = host;
        }
        that.updateProducts();

    };
    that.onFilter = () => {
        if (!that.filter || that.filter === '') {
            that.doFilter = false;

        } else {
            that.doFilter = true;
        }
        console.log("filter", that.filter);
        that.updateProducts();
    };
    that.updateProducts = () => {
        that.getProducts()
            .then(data => {
                //console.log(data);
                that.products = data.data;
            }, error => {
                console.log(error);
            });
    };
    that.getProducts = () => {
        var url = that.apiURL + '/product';
        if (that.doFilter) {
            url += '?name=' + that.filter;
        }
        console.log('request: ', url);
        return $http.get(url);
    };
}]);