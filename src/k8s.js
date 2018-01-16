var Client = require('node-kubernetes-client');
var fs = require('fs');

var getK8sServiceAddress = function() {
    return process.env.KUBERNETES_SERVICE_HOST + ":" + process.env.KUBERNETES_SERVICE_PORT
};

var getK8sNamespace = function() {
    return process.env.KUBE_NAMESPACE
};

var readToken = fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/token');

var clientV1 = new Client({
    host: getK8sServiceAddress(),
    namespace: getK8sNamespace(),
    protocol: 'https',
    version: 'v1',
    token: readToken
});

var clientV1Beta1 = new Client({
    host: getK8sServiceAddress(),
    namespace: getK8sNamespace(),
    protocol: 'https',
    version: 'extensions/v1beta1',
    token: readToken
});

clientV1Beta1.deployments = clientV1Beta1.createCollection('deployments', null, null, { apiPrefix : 'apis' });

function getPodsList(callback) {
    clientV1.pods.get(function (err, podResult) {

        if (err) {
            console.log("K8s: " + err.message.message);
            callback(err.message.message);
            return;
        }

        var pods = [];

        podList = podResult[0].items;

        for (var pod in podList) {
            pods.push(podList[pod].metadata.name)
        }

        console.log("Returning pods list: " + pods);
        callback(pods);
    });

}

function createDeployment(pod, image, callback) {

    body = {
        apiVersion: "extensions/v1beta1",
        kind: "Deployment",
        metadata: {
            labels: {
                name: pod
            },
            name: pod,
            namespace: getK8sNamespace()
        },
        spec: {
            replicas: 1,
            template: {
                metadata: {
                    labels: {
                        name: pod
                    }
                },
                spec: {
                    containers: [
                        {
                            image: image,
                            name: pod
                        }
                    ]
                }
            }
        }
    };

    clientV1Beta1.deployments.create(body, function (err, data) {
        if (err) {
            console.log("K8s: Error creating deployment:", err);
            callback(1);
        } else {
            console.log("Deployment created for pod: ", pod);
            callback(0);
        }
    });

}

module.exports = {
    getPods: getPodsList,
    createDeployment: createDeployment
};
