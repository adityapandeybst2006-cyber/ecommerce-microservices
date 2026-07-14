# Base Image
FROM node:20-alpine

# Working Directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Dependencies
RUN npm install

# Copy Project Files
COPY . .

# Expose Backend Port
EXPOSE 5000

# Start Application
CMD ["npm", "run", "dev"]