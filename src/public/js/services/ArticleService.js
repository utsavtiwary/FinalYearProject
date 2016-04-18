/**
 * Created by utsavtiwary on 18/04/16.
 */

angular.module('ArticleService', ['ResponseHandleService']).service('articleService', function($http, $q, responseHandler) {

    return {
        getArticles: getArticles
    };

    function getArticles() {
        return $http.get('/api/articles')
            .then(responseHandler.handleSuccess, responseHandler.handleError);
    }
});