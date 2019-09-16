FROM node:10
WORKDIR /src/app/
COPY package*.json ./
RUN npm install
RUN npm install -g nodemon migrate-mongo
COPY . .
CMD [ "npm", "run", "start-dev" ]
EXPOSE 3000
