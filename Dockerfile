# Node JS Dockerfile

# Base image
FROM node:18.16.0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY . .

# Install dependencies
RUN npm install

# Expose port
EXPOSE 3000

# Run app
CMD ["node", "index.js"]