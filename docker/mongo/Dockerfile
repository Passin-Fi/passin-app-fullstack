# Use the official MongoDB image as base
FROM mongo:7

# Copy init scripts (run once when database is empty)
COPY ./init/ /docker-entrypoint-initdb.d/

# Expose default MongoDB port
EXPOSE 27017

# No custom CMD needed; base image will start mongod and run init scripts.
