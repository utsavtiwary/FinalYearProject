/**
 * Created by utsavtiwary on 18/04/16.
 */

angular.module('ArticleCtrl', ['ArticleService']).controller('ArticleController', ['$scope', '$location','articleService',
    function($scope, $location, articleService) {
        $scope.description = "";
        $scope.url = "";

        $scope.addArticle = function() {
            articleService.addArticle($scope.description, $scope.url)
                .then(function() {
                    $location.path('/home')
                }, function(err) {
                    console.log(err);
                })
        }
    }]);