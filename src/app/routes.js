/**
 * Created by utsavtiwary on 08/04/16.
 */

module.exports = function(app, passport) {

    //api routes
    require('./api/user.server.routes')(app, passport);
    require('./api/article.server.routes')(app, passport);
};