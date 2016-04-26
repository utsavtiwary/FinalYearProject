/**
 * Created by utsavtiwary on 13/04/16.
 */

angular.module('GoodStoriesAppRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .when('/signup', {
            templateUrl: 'views/signup.html',
            controller: 'SignupController'
        })
        .when('/home', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })
        .when('/addArticle', {
            templateUrl: 'views/addArticle.html',
            controller: 'ArticleController'
        });

    $locationProvider.html5Mode(true);
}]);