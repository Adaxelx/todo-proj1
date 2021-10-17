FROM node:14

WORKDIR /todo
COPY package.json .
RUN npm install
COPY . .
CMD npm start