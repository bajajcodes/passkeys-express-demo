FROM node:18
WORKDIR /usr/src/app

EXPOSE 3000

CMD [ "npx", "nodemon", "ts-node-dev", "index.ts" ]

COPY package*.json /usr/src/app/
RUN npm install

COPY . /usr/src/app/