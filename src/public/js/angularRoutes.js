/**
 * Created by utsavtiwary on 13/04/16.
 */

angular.module('GoodStoriesAppRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        });


}]);