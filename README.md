# Kubernetes container instantiator PoC

This is a simple example on how to create a service to interact with kubernetes,
reading pods that are running and creating deployments with a specific name and image.

## Building the container

To build the container before running it on Kubernetes, run the following command:

```bash
$ docker build -t k8s-example .
```

## Deploying to Kubernetes

To deploy this example to Kubernetes, run:

```bash
$ kubectl create -f kubernetes_example/deployment.yaml -n YOUR_NAMESPACE
```

This will create a deployment, a service and the service account with proper permissions for the service

The container will expose a REST API on port 8081 that allows you to make a get rest to the
**/test** endpoint wich will return the list of pods running. Is is also possible to make a POST request
with a json as a content with the fields name and image, for instantiating a deployment on kubernetes with
the name and container image as requested on the message.
