# Development image for local development
FROM node:18.15.0-alpine AS server-development
# Install nodemon globally and # Create a new user with UID and GID of 1001
RUN addgroup -g 1001 ctint && adduser -D -u 1001 -G ctint ctint
WORKDIR /usr/src/app
# Set ownership and permissions for app directory
RUN chown -R ctint:ctint /usr/src/app && chmod -R 777 /usr/src/app
# Switch to the new user
USER ctint
# Copy package.json
COPY --chown=ctint:ctint package.json .
# Install dependencies
RUN npm install
# Copy the rest of the files
COPY --chown=ctint:ctint . .


# Base image for building the app for production
FROM node:18.15.0-alpine AS server-base
# Set the working directory
WORKDIR /usr/src/app
# Copy package.json and package-lock.json
COPY package.json .
# Install dependencies
RUN npm install
# Copy the rest of the files
COPY . .
# Build the app
RUN npm run build


# Production image
FROM node:18.15.0-alpine AS server-production
# Install required tooling
RUN apk update && apk add \
  nano
# Create a new user with UID and GID of 1001
RUN addgroup -g 1001 ctint && adduser -D -u 1001 -G ctint ctint
# Set the working directory
WORKDIR /usr/src/app
# Set ownership and permissions for app directory
RUN chown -R ctint:ctint /usr/src/app && chmod -R 777 /usr/src/app
# Switch to the new user
USER ctint
# Copy package.json and package-lock.json
COPY --chown=ctint:ctint package*.json .
# Install production dependencies
RUN npm install --only=production
# Copy the build image from the base image
COPY --chown=ctint:ctint --from=server-base /usr/src/app/dist ./dist
# Command to run the app
CMD ["node", "dist/server.js"]



