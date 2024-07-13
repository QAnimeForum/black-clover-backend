#!/usr/bin/env bash
set -e

/opt/wait-for-it.sh postgres:6432
npm run migration:generate
npm run migration:run
npm run seed:run
npm run start:prod > prod.log 2>&1 &
npm run lint
npm run test:e2e -- --runInBand