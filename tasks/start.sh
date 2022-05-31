#! /usr/bin/env sh

EXPORT DB_PATH='db.sqlite'

deno run \
  --allow-net=0.0.0.0:8000 \
  --allow-read=./public,db.sqlite,db.sqlite-journal,lib/database/schema.sql \
  --allow-write=db.sqlite \
  --allow-env=DB_PATH \
  start.js