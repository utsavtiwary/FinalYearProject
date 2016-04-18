/**
 * Created by utsavtiwary on 13/04/16.
 */

angular.module('GoodStoriesAppRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })
        .when('/articles', {
            templateUrl: 'views/articles.html',
            controller: 'ArticlesController'
        });

    $locationProvider.html5Mode(true);
}]);