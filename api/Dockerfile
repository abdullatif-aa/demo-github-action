# Use the official Node.js 16 Alpine image as the base
FROM node:16-alpine
# Create app directory inside the container
WORKDIR /usr/src/app
# Install app dependencies by copying package.json and package-lock.json
COPY package*.json ./
# Install dependencies using npm ci which respects package-lock.json
RUN npm ci
# Bundle app source inside the Docker image
COPY . .
# Expose the port the app runs on
EXPOSE 3000
# Command to run the app
CMD ["node", "app.js"]