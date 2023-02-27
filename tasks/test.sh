#! /usr/bin/env sh

deno test \
  --allow-read=db.sqlite,db.sqlite-journal,lib/database/schema.sql \
  --allow-write=db.sqlite \
  --watch