# Production Dockerfile for DB Runner & Seeder
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package manifests first for efficient caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Set default environment variables
ENV NODE_ENV=production

# Health check / DB test script execution on container start
CMD ["node", "testConnection.js"]
