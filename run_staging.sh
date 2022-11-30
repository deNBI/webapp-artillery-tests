#! /bin/bash
source env/bin/activate && source ./staging_auth.sh && npm run test:staging "$@"
