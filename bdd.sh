#!/usr/bin/env bash

getBackup() {
    echo "Retrieving last backup."
    docker exec --env-file='./.env' -i db bash -c 'mongodump --archive="./tmp/punchlines.gz" --gzip --db punchlines --uri "$DB_URL" && mongorestore --gzip --nsInclude="punchlines.*" --archive="./tmp/punchlines.gz"'
}

getBackup