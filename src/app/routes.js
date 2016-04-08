/**
 * Created by utsavtiwary on 08/04/16.
 */

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.sendfile("public/index.html");
    });

};