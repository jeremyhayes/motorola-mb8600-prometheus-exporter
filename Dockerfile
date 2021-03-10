FROM node:14

WORKDIR /app
EXPOSE 3000

# restore dependencies
COPY package*.json ./
RUN npm install

# copy source
COPY . .

CMD [ "node", "server.js" ]
