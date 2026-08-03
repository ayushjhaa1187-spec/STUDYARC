FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (only production if needed, but we install all here)
RUN npm install

# Copy application source code
COPY . .

# Expose the API port
EXPOSE 3001

# Start the application
CMD ["npm", "run", "server"]
