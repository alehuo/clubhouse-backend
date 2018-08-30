#!/bin/bash
INTERNAL_PORT=5000
EXTERNAL_PORT=${PORT-:8080}
docker run --rm --env-file=.env --expose=${INTERNAL_PORT} -p ${EXTERNAL_PORT}:${INTERNAL_PORT} -e PORT=${INTERNAL_PORT} --name clubhouse-backend-container clubhouse-backend