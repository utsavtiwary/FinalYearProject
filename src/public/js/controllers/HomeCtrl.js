/**
 * Created by utsavtiwary on 13/04/16.
 */

angular.module('HomeCtrl', ['UserService'])
    .controller('HomeController', ['$scope', '$location', 'userService',
        function($scope, $location, userService) {

            $scope.header = "Welcome to the Main Page";
            $scope.users = [];

            $scope.setUserAndProgress = function(user) {
                userService.setCurrentUser(user);
                $location.path('/articles');
            };

            userService.getUsers()
                .then(loadUsers, function(err) {
                    console.log(err);
                });

            function loadUsers(users) {
                $scope.users = users;
            }

    }]);