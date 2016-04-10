/**
 * Created by utsavtiwary on 08/04/16.
 */

module.exports = function(app) {

    //routes for the views
    app.get('/', function(req, res) {
        res.sendfile("public/index.html");
    });

    //api routes
    require('./api/user.server.routes')(app);
};