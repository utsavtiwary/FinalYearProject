/**
 * Created by utsavtiwary on 25/04/16.
 */

angular.module('HomeCtrl', ['UserService', 'ArticleService'])
    .controller('HomeController', ['$scope', '$location', 'userService', 'articleService',
        function($scope, $location, userService, articleService) {
            var ARTICLE_LIMIT = 10;
            $scope.article = [];

            userService.getCurrentUser()
                .then(function(user) {
                    if (user) {
                        $scope.user = user;
                    } else {
                        $location.path('/');
                    }
                }, function(err) {
                    console.log(err);
                });

            loadArticles();

            $scope.addArticlePage = function() {
                $location.path('/addArticle');
            };

            $scope.voteUp = function (articleId) {
                articleService.vote(articleId, "up")
                    .then(loadArticles, function(err) {
                        console.log(err);
                    })
            };

            $scope.voteDown = function(articleId) {
                articleService.vote(articleId, "down")
                    .then(loadArticles, function(err) {
                        console.log(err);
                    })
            };

            $scope.logout = function() {
                userService.logout()
                    .then(function() {
                        $location.path('/');
                    }, function(err) {
                        console.log(err);
                    })
            };

            function loadArticles() {
                articleService.getArticles(ARTICLE_LIMIT)
                    .then(function(articles) {
                        articles.map(function(article) {
                            var indexUp = article.votes.upVoters.indexOf($scope.user._id);
                            var indexDown = article.votes.downVoters.indexOf($scope.user._id);
                            article["inUp"] = indexUp != -1;
                            article["inDown"] = indexDown != -1;
                        });
                        $scope.articles = articles;
                    }, function(err) {
                        console.log(err);
                    });
            }

        }]);