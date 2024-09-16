# Use an official Node.js runtime as a parent image
ARG NODE_VERSION=20.11.1
FROM node:${NODE_VERSION}-alpine

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the React application
CMD ["npm", "start"]
