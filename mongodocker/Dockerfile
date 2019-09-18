FROM mongo:latest
COPY mongoseed.json /mongoseed.json
CMD mongoimport --host mongodb_dev --db tkbackend --collection objects --type json --file /mongoseed.json --jsonArray