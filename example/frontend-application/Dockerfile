FROM node:24-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3001

CMD ["node", "app.js"]