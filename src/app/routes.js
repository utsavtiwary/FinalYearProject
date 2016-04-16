/**
 * Created by utsavtiwary on 08/04/16.
 */

module.exports = function(app) {

    //api routes
    require('./api/user.server.routes')(app);
    require('./api/article.server.routes')(app);

};