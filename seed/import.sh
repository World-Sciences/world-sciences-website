#!/usr/bin/env bash
set -euo pipefail

HOST="${MONGO_HOST:-mongo}"
DB="${MONGO_DB:-worldsciences}"
URI="mongodb://${HOST}:27017"

for coll in authors topics articles; do
  echo "Importing ${coll}..."
  mongoimport --uri "${URI}" --db "${DB}" --collection "${coll}" \
    --file "/seed/${coll}.json" --jsonArray --drop
done

echo "Creating slug indexes..."
mongosh "${URI}/${DB}" --quiet --eval '
  db.articles.createIndex({ slug: 1 }, { unique: true });
  db.authors.createIndex({ slug: 1 }, { unique: true });
'

echo "Seeding complete."
