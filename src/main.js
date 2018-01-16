var express = require('express');
var bodyParser = require('body-parser');
var k8s = require('./k8s');

var app = express();


function get_callback(req, res) {
    console.log('Received Get');

    k8s.getPods(function (pods) {

        res.json({
            message: 'Pods Retrieved!',
            pods: pods
        })
    });
}


function post_callback(req, res) {
    console.log('Received Post');

    data = req.body;

    var pod_name = data.name;
    var container_name = data.image;

    k8s.createDeployment(pod_name, container_name, function(status) {

        if (status !== 0) {
            res.json({ message: "Failed to deploy pod " + pod_name });
        } else {
            res.json({ message: 'Deployment for pod ' + pod_name + ' instantiated!' });
        }
    });


}

console.log('Starting up k8s-instantiator');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

console.log('Setting routes for the app');

app.route('/test')
    .get(get_callback)
    .post(post_callback);

var server = app.listen(8081, function () {

    var host = server.address().address;
    var port = server.address().port;
    console.log("App listening at http://%s:%s", host, port)

});

