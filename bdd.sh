#!/usr/bin/env bash

getBackup() {
    echo "Retrieving last backup."
    docker exec --env-file='./.env' -i db bash -c 'mongodump --archive="./tmp/<database>.gz" --gzip --db <database> --uri "$DB_URL" && mongorestore --gzip --nsInclude="<database>.*" --archive="./tmp/<database>.gz"'
}

getBackup