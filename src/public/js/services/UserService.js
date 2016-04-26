/**
 * Created by utsavtiwary on 17/04/16.
 */

angular.module('UserService', ['ResponseHandleService']).service('userService', function($http, $q, responseHandler) {

    return {
        getUsers: getUsers,
        getCurrentUser: getCurrentUser,
        login: login,
        signup: signup,
        logout: logout
    };

    function getUsers() {
        return $http.get('/api/users')
            .then(responseHandler.handleSuccess, responseHandler.handleError);
    }

    function login(email, password) {
        return $http.post('/login', {email: email, password: password})
            .then(responseHandler.handleSuccess, responseHandler.handleError);
    }

    function signup(username, email, password) {
        return $http.post('/api/users', {username: username, email: email, password: password})
            .then(responseHandler.handleSuccess, responseHandler.handleError);
    }

    function logout() {
        return $http.get('/logout')
            .then(responseHandler.handleSuccess, responseHandler.handleError);
    }

    function getCurrentUser() {
        return $http.get('/currentUser')
            .then(responseHandler.handleSuccess, responseHandler.handleError);
    }
});