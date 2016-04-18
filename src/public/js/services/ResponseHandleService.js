/**
 * Created by utsavtiwary on 18/04/16.
 */

angular.module('ResponseHandleService', []).service('responseHandler', function($q) {
    return {
        handleSuccess: handleSuccess,
        handleError: handleError
    };

    function handleSuccess(response) {
        return response.data;
    }

    function handleError(response) {
        if (
            ! angular.isObject( response.data ) ||
            ! response.data.message
        ) {
            return ( $q.reject("An unknown error occurred.") );
        }

        return( $q.reject( response.data.message ) );
    }
});