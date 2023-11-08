FROM node:lts as builder

WORKDIR /app/source

# restore dependencies
COPY package*.json ./
RUN npm install

# copy source
COPY . .


FROM node:lts-alpine as final

WORKDIR /app

ENV PORT=3000 \
    MODEM_BASE_URL= \
    MODEM_IGNORE_SSL= \
    MODEM_USERNAME= \
    MODEM_PASSWORD=

EXPOSE $PORT

# copy runtime files
COPY --from=builder /app/source ./

ENTRYPOINT ./docker-entrypoint.sh
