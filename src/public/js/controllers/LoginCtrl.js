/**
 * Created by utsavtiwary on 13/04/16.
 */

angular.module('LoginCtrl', ['UserService'])
    .controller('LoginController', ['$scope', '$location', 'userService',
        function($scope, $location, userService) {


            $scope.email = "";
            $scope.password = "";

            userService.getCurrentUser()
                .then(function(user) {
                    if(user) {
                        $location.path('/home');
                    }
                }, function(err) {
                    console.log(err);
                });

            $scope.login = function() {
                userService.login($scope.email, $scope.password)
                    .then(function() {
                        $location.path('/home');
                    }, function(err) {
                        console.log(err);
                    })
            };

    }]);