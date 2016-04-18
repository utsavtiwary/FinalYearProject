/**
 * Created by utsavtiwary on 18/04/16.
 */

angular.module('ArticlesCtrl', ['ArticleService']).controller('ArticlesController', ['$scope', 'articleService',
    function($scope, articleService) {
        $scope.header = "This is the Articles Page";
        $scope.articles = [];

        articleService.getArticles()
            .then(loadArticles, function(err) {
                console.log(err);
            });

        function loadArticles(articles) {
            $scope.articles = articles;
        }
}]);