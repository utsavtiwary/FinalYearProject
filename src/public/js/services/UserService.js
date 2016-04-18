/**
 * Created by utsavtiwary on 17/04/16.
 */

angular.module('UserService', ['ResponseHandleService']).service('userService', function($http, $q, responseHandler) {

    var currentUser;

    return {
        getUsers: getUsers,
        setCurrentUser: setCurrentUser,
        getCurrentUsr: getCurrentUser
    };

    function getUsers() {
        return $http.get('/api/users')
            .then(responseHandler.handleSuccess, responseHandler.handleError);
    }

    function setCurrentUser(user) {
        currentUser = user;
    }

    function getCurrentUser() {
        return currentUser;
    }
});