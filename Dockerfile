FROM node:8

WORKDIR /opt/k8s_instantiator

COPY . .
RUN npm install

ENTRYPOINT npm run start
