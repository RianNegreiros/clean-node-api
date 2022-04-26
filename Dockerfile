FROM node:latest
WORKDIR /usr/src/clena-node-api
COPY ./package.json .
RUN npm install --only=prod
COPY ./dist ./dist
EXPOSE 5000
CMD npm start