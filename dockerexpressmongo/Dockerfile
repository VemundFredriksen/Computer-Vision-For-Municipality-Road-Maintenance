#  when we deploy our container to the server, 
#  it will first install all the dependencies 
#  and then spin up the node server. 
#  The application will run on port 4000.
FROM node:7
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD node app.js
EXPOSE 4000