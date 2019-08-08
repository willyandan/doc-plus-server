FROM node:10
WORKDIR /src/app/
COPY package*.json ./
RUN npm install
RUN npm install -g nodemon
COPY . .
CMD [ "npm", "start" ]
EXPOSE 3000
