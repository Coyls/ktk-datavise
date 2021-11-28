FROM node:16
WORKDIR /app
COPY ./dist .
COPY ./index.js .
COPY ./package.json .
RUN npm install
RUN npm install express
EXPOSE 3100




