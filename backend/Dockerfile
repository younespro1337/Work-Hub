ARG NODE_VERSION=20.11.1

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
