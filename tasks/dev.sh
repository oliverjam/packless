#! /usr/bin/env sh

set -e

DB_PATH='db.sqlite' \
deno run \
  --allow-net=0.0.0.0:8000 \
  --allow-read=./public,db.sqlite,db.sqlite-journal,lib/database/schema.sql \
  --allow-write=db.sqlite,db.sqlite-journal \
  --allow-env=DB_PATH \
  --watch \
  start.js