#!/bin/sh

set -e

envsubst '${HOST}, ${BACKEND_LOCATION},' < /etc/nginx/default.conf > /etc/nginx/conf.d/default.conf