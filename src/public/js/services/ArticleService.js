/**
 * Created by utsavtiwary on 18/04/16.
 */

angular.module('ArticleService', ['ResponseHandleService']).service('articleService', function($http, $q, responseHandler) {

    return {
        getArticles: getArticles,
        addArticle: addArticle,
        vote: vote
    };

    function getArticles(limit) {
        return $http.get('/api/articles/limit/' + limit)
            .then(responseHandler.handleSuccess, responseHandler.handleError);
    }

    function addArticle(description, url) {
        return $http.post('/api/articles', {description: description, url: url})
            .then(responseHandler.handleSuccess, responseHandler.handleError);
    }

    function vote(articleId, voteType) {
        var url = '/api/articles/' + articleId + '/votes/' + voteType;
        return $http.post(url)
            .then(responseHandler.handleSuccess, responseHandler.handleError);
    }
});