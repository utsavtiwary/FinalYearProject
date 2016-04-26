/**
 * Created by utsavtiwary on 25/04/16.
 */

angular.module('SignupCtrl', ['UserService'])
    .controller('SignupController', ['$scope', '$location', 'userService',
        function($scope, $location, userService) {

            $scope.email = "";
            $scope.username = "";
            $scope.password = "";

            $scope.signup = function() {
                userService.signup($scope.username, $scope.email, $scope.password)
                    .then(function() {
                        $location.path('/');
                    }, function(err) {
                        console.log(err);
                    })
            };

        }]);